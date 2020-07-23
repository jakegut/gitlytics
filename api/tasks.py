from celery import Celery
from app import db, celery, create_app
from models import GitData
from requests_oauthlib import OAuth2Session
import settings


# def make_celery(app=None):
#     app = app or create_app()
#     celery = Celery(app.import_name, broker=app.config['CELERY_BROKER'])
#     celery.conf.update(app.config)
#     TaskBase = celery.Task
#     class ContextTask(TaskBase):
#         abstract = True
#         def __call__(self, *args, **kwargs):
#             with app.app_context():
#                 return TaskBase.__call__(self, *args, **kwargs)
#     celery.Task = ContextTask
#     return celery

@celery.task
def update_git_data():
    gitdata = GitData.query.filter_by(additions=None).all()

    for commit in gitdata:
        user = commit.repo.user
        session = OAuth2Session(settings.GITHUB_OAUTH_CLIENT_ID, token={"access_token": user.oauth_token})
        string = f'{settings.GITHUB_API_BASE_URL}repos/{commit.repo.name}/commits/{commit.sha}'
        commit_data = session.get(string).json()
        try:
            commit.date = commit_data['commit']['author']['date']
            commit.contributor_user = commit_data['author']['login']
            commit.additions = commit_data['stats']['additions']
            commit.deletions = commit_data['stats']['deletions']
        except KeyError as e:
            print("KEY ERROR:", str(e))
            continue

    db.session.commit()