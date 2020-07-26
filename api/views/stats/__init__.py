from flask import Blueprint, url_for, redirect, session, request, jsonify
from flask_jwt_extended import jwt_required, current_user
from app import db
import pandas as pd

from models import Repo, Project
from views.projects.schemas import RepoSchema
from tasks import get_previous_commits

stats = Blueprint('stats', __name__)

@stats.route("/repo/<int:repo_id>/commits")
@jwt_required
def get_repo_commits(repo_id):
    repo = Repo.query.get(repo_id)
    if repo is None:
        return jsonify(message="Repo not found"), 404

    if not (repo.project.course.is_owner(current_user.id) or repo in current_user.repos):
        return jsonify(message="Unauthorized to view repo"), 403

    query = ("SELECT gitdata.date::date AS commit_date, COUNT(*) AS commits, contributor_user " 
             "FROM gitdata " 
             f"WHERE repo_id = {repo.id} " 
             "GROUP BY date(gitdata.date), contributor_user  "
             "ORDER BY date(gitdata.date);")

    df = pd.read_sql(query, db.engine, parse_dates=['commit_date'])
    d = []
    df['commit_date'] = pd.to_datetime(df['commit_date'], unit='s')
    dates = df['commit_date'].unique()
    contributors = df['contributor_user'].unique().tolist()

    for date in dates:
        data = {"date": int(date) / 1000000}
        for contributor in contributors:
            row = df[(df['commit_date'] == date) & (df['contributor_user'] == contributor)]
            if row.empty:
                data[contributor] = 0
            else:
                data[contributor] = int(row['commits'].iloc[0])
        d.append(data)

    resp = {
        "lines": contributors,
        "data": d
    }

    return jsonify(result=resp), 200


@stats.route("/populate", methods=['POST'])
@jwt_required
def populate():
    data = request.get_json()
    if 'project_id' in data:
        project = Project.query.get(data['project_id'])
        if project is None:
            return jsonify(message="Project not found"), 404

        repo = Repo()
        repo.project_id = data['project_id']
        repo.name = data['repo_name']
        db.session.add(repo)
        db.session.commit()

        get_previous_commits.delay(repo.id, current_user.oauth_token)

        return jsonify(repo=RepoSchema().dump(repo)), 201
    else:
        repo = Repo.query.filter_by(name=data['repo_name']).first()
        if repo is not None:
            get_previous_commits.delay(repo.id, current_user.oauth_token)
            return jsonify(repo=RepoSchema().dump(repo)), 201
