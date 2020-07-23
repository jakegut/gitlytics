from models import GitData, Repo
from app import WEBHOOK, db
from tasks import update_git_data

@WEBHOOK.hook()
def push_hook(data):
    if data['ref'] != "refs/heads/master":
        return

    repo_name = data['repository']['full_name']
    repo = Repo.query.filter_by(name=repo_name).first()

    #TODO: delete webhook if repo is not found
    if repo is None:
        return

    for commit in data['commits']:
        data = GitData()
        data.repo_id = repo.id
        data.sha = commit['id']
        data.api_url = commit['url']
        db.session.add(data)

    db.session.commit()

    git = update_git_data.delay()

@WEBHOOK.hook(event_type="ping")
def ping_hook(data):
    print('Received a PING event')