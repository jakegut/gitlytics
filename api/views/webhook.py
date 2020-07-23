from models import GitData, Repo
from app import WEBHOOK, db
from flask import current_app

@WEBHOOK.hook()
def push_hook(data):
    if data['ref'] != "refs/heads/master":
        print("MASTER AIGNT GOT HEAD", flush=True)
        return

    repo_name = data['repository']['full_name']
    repo = Repo.query.filter_by(name=repo_name).first()

    #TODO: delete webhook if repo is not found
    if repo is None:
        print("Where the repo at?", flush=True)
        return

    for commit in data['commits']:
        print(commit, flush=True)
        data = GitData()
        data.repo_id = repo.id
        data.sha = commit['sha']
        data.api_url = commit['url']
        db.session.add(data)

    db.session.commit()

    git = current_app.celery.delay()
    print("finished??!", flush=True)

@WEBHOOK.hook(event_type="ping")
def ping_hook(data):
    print('Received a PING event')