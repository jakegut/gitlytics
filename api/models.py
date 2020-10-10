from flask_login import UserMixin
from sqlalchemy.orm.exc import NoResultFound
from flask_jwt_extended import decode_token
from sqlalchemy_utils.types.encrypted.encrypted_type import AesEngine, StringEncryptedType

from app import db
from utils import random_string
from sqlalchemy.sql import func
import enum
from datetime import datetime
import settings

registered = db.Table("registered",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id")),
    db.Column("course_id", db.Integer, db.ForeignKey("courses.id")),
    db.UniqueConstraint('user_id', 'course_id', name="unique_course")
)

assignments = db.Table("assignments",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id")),
    db.Column("group_id", db.Integer, db.ForeignKey("groups.id")),
    db.UniqueConstraint('user_id', 'group_id', name="unique_group")
)

class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(StringEncryptedType(db.String, settings.DB_ENCRYPT_KEY, AesEngine), unique=True)
    email = db.Column(StringEncryptedType(db.String, settings.DB_ENCRYPT_KEY, AesEngine))
    avatar_url = db.Column(db.String(255))
    name = db.Column(db.String(255))
    oauth_token = db.Column(StringEncryptedType(db.Text, settings.DB_ENCRYPT_KEY, AesEngine))

    courses = db.relationship('Course', secondary=registered, backref=db.backref('users'))

class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    invite_id = db.Column(db.String(10))

    owner_id = db.Column(db.Integer, db.ForeignKey(User.id))
    owner = db.relationship(User, backref=db.backref("owned_courses"))

    def __init__(self, **kwargs):
        super(Course, self).__init__(**kwargs)
        self.invite_id = random_string(8)

    def is_owner(self, user_id):
        return self.owner_id == user_id

    def is_user(self, user_id):
        return (u.id == user_id for u in self.users)

class Invite(db.Model):
    __tablename__ = "invites"
    __table_args__ = (
        db.UniqueConstraint('username', 'course_id'),
    )
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100))
    course_id = db.Column(db.Integer, db.ForeignKey(Course.id))

    course = db.relationship(Course, backref=db.backref("invites"))

class ProjectTypes(enum.Enum):
    IND = "individual"
    GROUP_IND = "group_ind"
    GROUP_GROUP = "group_group"

    def __str__(self):
        return self.value

class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    date_created = db.Column(db.DateTime(timezone=True), server_default=func.now())
    start_date = db.Column(db.DateTime(timezone=True), nullable=False)
    due_date = db.Column(db.DateTime(timezone=True), nullable=False)
    type = db.Column(db.Enum(ProjectTypes, values_callable=lambda obj: [e.value for e in obj]))

    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"))
    course = db.relationship(Course, backref=db.backref("projects", cascade="all, delete"))

    def get_group_for_user(self, user_id):
        q = User.query.get(user_id).groups
        g = self.groups.intersect(q).first()
        return g

    def get_repo_for_user(self, user_id):
        if self.type == ProjectTypes.IND or self.type == ProjectTypes.GROUP_IND:
            return self.repos.filter_by(user_id=user_id).first()
        else:
            g = self.get_group_for_user(user_id)
            if g is None: return None
            return g.repo

class Group(db.Model):
    __tablename__ = "groups"

    id = db.Column(db.Integer, primary_key=True)

    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    project = db.relationship(Project, backref=db.backref("groups", lazy='dynamic', cascade="all, delete"))

    users = db.relationship(User, secondary=assignments, backref=db.backref("groups", lazy='dynamic'))

class Repo(db.Model):
    __tablename__ = "repos"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True)
    webhook_id = db.Column(db.Integer)

    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"))
    project = db.relationship(Project, backref=db.backref("repos", lazy='dynamic', cascade="all, delete"))

    group_id = db.Column(db.Integer, db.ForeignKey("groups.id"))
    group = db.relationship(Group, backref=db.backref("repo"))

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user = db.relationship(User, backref=db.backref("repos"))

class GitData(db.Model):
    __tablename__ = "gitdata"

    id = db.Column(db.Integer, primary_key=True)
    sha = db.Column(db.Text, nullable=False, unique=True)
    ref = db.Column(db.Text)
    api_url = db.Column(db.Text)
    additions = db.Column(db.Integer)
    deletions = db.Column(db.Integer)
    date = db.Column(db.DateTime)
    contributor_user = db.Column(StringEncryptedType(db.Text, settings.DB_ENCRYPT_KEY, AesEngine))

    repo_id = db.Column(db.Integer, db.ForeignKey("repos.id"))
    repo = db.relationship(Repo, backref=db.backref("gitdata", lazy='dynamic', cascade="all, delete"))

class TokenList(db.Model):
    __tablename__ = "tokenlist"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False)
    token_type = db.Column(db.String(10), nullable=False)
    user_identity = db.Column(db.Text, nullable=False)
    revoked = db.Column(db.Boolean, nullable=False)
    expires = db.Column(db.DateTime, nullable=False)

    @classmethod
    def prune(cls):
        now = datetime.now()
        expired = cls.query.filter_by(cls.expires < now).all()
        for row in expired:
            db.session.delete(row)
        db.session.commit()

    @classmethod
    def is_revoked(cls, decoded_token):
        jti = decoded_token['jti']
        token = cls.query.filter_by(jti=jti).first()
        if token is None:
            return True
        else:
            return token.revoked

    @classmethod
    def revoke(cls, raw_token):
        try:
            jti = raw_token['jti']
            token = cls.query.filter_by(jti=jti).first()
            db.session.delete(token)
            db.session.commit()
        except NoResultFound:
            return

    @classmethod
    def add_to_db(cls, encoded_token, identity_claim):
        decoded_token = decode_token(encoded_token)
        jti = decoded_token['jti']
        token_type = decoded_token['type']
        user_identity = decoded_token[identity_claim]
        expires = datetime.fromtimestamp(decoded_token['exp'])
        revoked = False

        db_token = TokenList(
            jti=jti,
            token_type=token_type,
            user_identity=user_identity,
            expires=expires,
            revoked=revoked
        )
        db.session.add(db_token)
        db.session.commit()