import settings
from app import db
from flask_dance.consumer import OAuth2ConsumerBlueprint
from flask_dance.consumer.storage.sqla import SQLAlchemyStorage
from flask_dance.consumer import oauth_authorized
from flask_login import current_user, login_user
from models import OAuth, User
from sqlalchemy.orm.exc import NoResultFound

github_bp = OAuth2ConsumerBlueprint(
    "github", __name__,
    client_id=settings.GITHUB_OAUTH_CLIENT_ID,
    client_secret=settings.GITHUB_OAUTH_CLIENT_SECRET,
    base_url="https://github.tamu.edu/api/v3/",
    token_url="https://github.tamu.edu/login/oauth/access_token",
    authorization_url="https://github.tamu.edu/login/oauth/authorize",
    scope=["repo", "user"]
)

github_bp.backend = SQLAlchemyStorage(OAuth, db.session, user=current_user)

@oauth_authorized.connect_via(github_bp)
def on_github_auth(blueprint, token):
    info = blueprint.session.get("user")
    assert info.ok
    info_json = info.json()
    print(info_json)
    username = info_json['login']

    query = User.query.filter_by(username=username)
    try:
        user = query.one()
    except NoResultFound:
        user = User(username=username,
                    email=info_json['email'],
                    name=info_json['name'],
                    avatar_url=info_json['avatar_url'])
        db.session.add(user)
        db.session.commit()

    login_user(user)
