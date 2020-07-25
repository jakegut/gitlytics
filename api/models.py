from flask_dance.consumer.storage.sqla import OAuthConsumerMixin
from flask_login import UserMixin
from app import db
from utils import random_string
from sqlalchemy.sql import func
import enum

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
    username = db.Column(db.String(100), unique=True)
    email = db.Column(db.String(100))
    avatar_url = db.Column(db.String(255))
    name = db.Column(db.String(255))
    oauth_token = db.Column(db.Text)

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
    course = db.relationship(Course, backref=db.backref("projects"))

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
    project = db.relationship(Project, backref=db.backref("repos", lazy='dynamic'), cascade="all, delete")

    group_id = db.Column(db.Integer, db.ForeignKey("groups.id"))
    group = db.relationship(Group, backref=db.backref("repo"))

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user = db.relationship(User, backref=db.backref("repos"))

class GitData(db.Model):
    __tablename__ = "gitdata"

    id = db.Column(db.Integer, primary_key=True)
    sha = db.Column(db.Text, nullable=False)
    api_url = db.Column(db.Text)
    additions = db.Column(db.Integer)
    deletions = db.Column(db.Integer)
    date = db.Column(db.DateTime)
    contributor_user = db.Column(db.Text)

    repo_id = db.Column(db.Integer, db.ForeignKey("repos.id"))
    repo = db.relationship(Repo, backref=db.backref("gitdata", lazy='dynamic'))
