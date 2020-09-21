from models import GitData, Repo
from app import WEBHOOK, db
from tasks import update_git_data

@WEBHOOK.hook()
def push_hook(data):
    repo_name = data['repository']['full_name']
    repo = Repo.query.filter_by(name=repo_name).first()

    #TODO: delete webhook if repo is not found
    if repo is None:
        return

    for commit in data['commits']:
        git = GitData()
        git.repo_id = repo.id
        git.sha = commit['id']
        git.ref = data['ref']
        db.session.add(git)

    db.session.commit()

    git = update_git_data.delay([repo.id])

@WEBHOOK.hook(event_type="ping")
def ping_hook(data):
    print('Received a PING event')