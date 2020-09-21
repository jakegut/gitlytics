from celery import Celery
from app import db, celery, create_app
from models import GitData, Repo, Project
from requests_oauthlib import OAuth2Session
import settings
import datetime
from sqlalchemy.exc import IntegrityError

# @celery.task
# def get_previous_commits(repo_id, oauth_token, days=30):
#     repo = Repo.query.get(repo_id)
#     if repo is None: return
#
#     session = OAuth2Session(settings.GITHUB_OAUTH_CLIENT_ID, token={"access_token": oauth_token})
#     future = (datetime.datetime.today() + datetime.timedelta(days=days)).isoformat()
#     url = f'{settings.GITHUB_API_BASE_URL}repos/{repo.name}/commits?until={future}'
#     past = ""
#     while url is not None:
#         print("GITHUB_URL:", url)
#         data = session.get(url).json()
#         for commit in data:
#             try:
#                 gitdata = GitData()
#                 gitdata.sha = commit['sha']
#                 gitdata.repo_id = repo.id
#                 db.session.add(gitdata)
#                 try:
#                     db.session.commit()
#                 except IntegrityError:
#                     db.session.rollback()
#             except KeyError as e:
#                 print("KEY ERROR:", str(e))
#                 continue
#         if len(data) > 0:
#             try:
#                 temp_past = data[-1]['commit']['author']['date']
#                 if past == temp_past:
#                     url = None
#                 else:
#                     url = f'{settings.GITHUB_API_BASE_URL}repos/{repo.name}/commits?since={past}&until={future}'
#                     past = temp_past
#             except KeyError:
#                 url = None
#         else:
#             url = None
#
#     update_git_data.delay(oauth_token)

def add_previous_commits(repo, prev_days):
    user = repo.user
    if user is None: return
    session = OAuth2Session(settings.GITHUB_OAUTH_CLIENT_ID,
                            token={"access_token": user.oauth_token})
    past = (datetime.datetime.today() - datetime.timedelta(days=prev_days)).isoformat()
    page = 1
    while True:
        url = f'{settings.GITHUB_API_BASE_URL}repos/{repo.name}/commits?since={past}&page={page}&per_page=100'
        data = session.get(url).json()
        if data is None: return
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
        if len(data) == 0:
            break
        else:
            page += 1

@celery.task
def get_project_commits(proj_id, prev_days=30):
    proj = Project.query.get(proj_id)
    if proj is None: return
    repo_ids = []

    for repo in proj.repos.all():
        add_previous_commits(repo, prev_days)
        repo_ids.append(repo.id)

    update_git_data.delay(repo_ids)

@celery.task
def update_git_data(repo_ids, oauth_token=None):

    for repo_id in repo_ids:
        gitdata = GitData.query.filter_by(additions=None, repo_id=repo_id).all()
        if gitdata is None or len(gitdata) == 0: continue
        user = gitdata[0].repo.user
        for commit in gitdata:
            if user is None and oauth_token is None: continue
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

@celery.task
def delete_webhooks(to_delete):
    for d in to_delete:
        session = OAuth2Session(settings.GITHUB_OAUTH_CLIENT_ID,
                                token={"access_token": d['oauth']})
        string = f'{settings.GITHUB_API_BASE_URL}repos/{d["name"]}/hooks/{d["webhook_id"]}'
        req = session.delete(string)