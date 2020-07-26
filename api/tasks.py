from celery import Celery
from app import db, celery, create_app
from models import GitData, Repo
from requests_oauthlib import OAuth2Session
import settings
import datetime
from sqlalchemy.exc import IntegrityError

@celery.task
def get_previous_commits(repo_id, oauth_token, days=30):
    repo = Repo.query.get(repo_id)
    if repo is None: return

    session = OAuth2Session(settings.GITHUB_OAUTH_CLIENT_ID, token={"access_token": oauth_token})
    future = (datetime.datetime.today() + datetime.timedelta(days=days)).isoformat()
    url = f'{settings.GITHUB_API_BASE_URL}repos/{repo.name}/commits?until={future}'
    past = ""
    while url is not None:
        print("GITHUB_URL:", url)
        data = session.get(url).json()
        for commit in data:
            try:
                gitdata = GitData()
                gitdata.sha = commit['sha']
                gitdata.repo_id = repo.id
                db.session.add(gitdata)
                try:
                    db.session.commit()
                except IntegrityError:
                    db.session.rollback()
            except KeyError as e:
                print("KEY ERROR:", str(e))
                continue
        if len(data) > 0:
            try:
                temp_past = data[-1]['commit']['author']['date']
                if past == temp_past:
                    url = None
                else:
                    url = f'{settings.GITHUB_API_BASE_URL}repos/{repo.name}/commits?since={past}&until={future}'
                    past = temp_past
            except KeyError:
                url = None
        else:
            url = None

    update_git_data.delay(oauth_token)

@celery.task
def update_git_data(oauth_token=None):
    gitdata = GitData.query.filter_by(additions=None).all()

    for commit in gitdata:
        user = commit.repo.user
        session = OAuth2Session(settings.GITHUB_OAUTH_CLIENT_ID, token={"access_token": user.oauth_token if oauth_token is None else oauth_token})
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