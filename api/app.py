import sys
from flask import Flask, jsonify, make_response
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from dotenv import load_dotenv
from flask_github_webhook import GithubWebhook
from flask_cors import CORS
from celery import Celery
from celery_utils import init_celery
import settings

db = SQLAlchemy(session_options={
    'expire_on_commit': False
})
login_manager = LoginManager()
migrate = Migrate()
jwt = JWTManager()
WEBHOOK = GithubWebhook()
celery = Celery(__name__, broker=settings.CELERY_BROKER, include=['tasks'])


def create_app():
    load_dotenv()
    app = Flask(__name__, static_folder='static')
    app.config.from_object('settings')

    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    WEBHOOK.init_app(app)
    CORS(app)
    init_celery(celery, app)

    from models import Course, User, Invite, TokenList

    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return user.username

    @jwt.user_loader_callback_loader
    def user_loader_callback(identity):
        return User.query.filter_by(username=identity).first()

    @jwt.user_loader_error_loader
    def custom_user_loader_error(identity):
        ret = {
            "msg": "User {} not found".format(identity)
        }
        return jsonify(ret), 404

    @jwt.token_in_blacklist_loader
    def check_token(token):
        return TokenList.is_revoked(token)

    from views.users import schemas
    from views.courses import schemas
    from views.invites import schemas

    @app.route("/")
    def hello():
        return "hello"

    from views.auth import auth
    app.register_blueprint(auth, url_prefix="/auth")

    from views.courses import courses
    app.register_blueprint(courses, url_prefix='/courses')

    from views.users import user
    app.register_blueprint(user, url_prefix="/users")

    from views.invites import invites
    app.register_blueprint(invites, url_prefix="/invites")

    from views.projects import projects
    app.register_blueprint(projects, url_prefix="/projects")

    from views.stats import stats
    app.register_blueprint(stats, url_prefix="/stats")

    from views import webhook

    return app

api = create_app()

if __name__ == '__main__':
    import os
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'
    os.environ['PYTHONPATH'] = '.'
    a = create_app()
    a.debug = False
    a.run()
