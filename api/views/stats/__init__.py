from flask import Blueprint, url_for, redirect, session, request, jsonify
from flask_jwt_extended import jwt_required, current_user
from app import db
import pandas as pd
from datetime import datetime, timedelta

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
    dates = pd.date_range(datetime.today().date() - timedelta(days=30), periods=30).to_pydatetime().tolist()
    contributors = df['contributor_user'].unique().tolist()

    for date in dates:
        data = {"date": int(date.strftime('%s')) * 1000}
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

@stats.route("/repo/<int:repo_id>/contributions")
@jwt_required
def get_repo_contrib(repo_id):
    repo = Repo.query.get(repo_id)
    if repo is None:
        return jsonify(message="Repo not found"), 404

    if not (repo.project.course.is_owner(current_user.id) or repo in current_user.repos):
        return jsonify(message="Unauthorized to view repo"), 403

    query = ("SELECT gitdata.date::date AS commit_date, contributor_user, SUM(additions) AS additions, SUM(deletions) AS deletions "
             "FROM gitdata "
             f"WHERE repo_id = {repo.id} "
             "GROUP BY 1, 2 "
             "ORDER BY 1 ")

    df = pd.read_sql(query, db.engine, parse_dates=['commit_date'])
    dates = pd.date_range(datetime.today().date() - timedelta(days=30), periods=30).to_pydatetime().tolist()
    contributors = df['contributor_user'].unique().tolist()
    d = []

    for contributor in contributors:
        temp_contributor = []
        for date in dates:
            temp = {"date": int(date.strftime('%s')) * 1000}
            row = df[(df['commit_date'] == date) & (df['contributor_user'] == contributor)]
            if row.empty:
                temp['additions'] = 0
                temp['deletions'] = 0
            else:
                temp['additions'] = int(row['additions'].iloc[0])
                temp['deletions'] = int(row['deletions'].iloc[0])
            temp_contributor.append(temp)
        d.append({"name": contributor, "data": temp_contributor})

    return jsonify(result=d), 200

@stats.route("/repo/<int:repo_id>/total_contributions")
@jwt_required
def get_repo_total_contribs(repo_id):
    repo = Repo.query.get(repo_id)
    if repo is None:
        return jsonify(message="Repo not found"), 404

    if not (repo.project.course.is_owner(current_user.id) or repo in current_user.repos):
        return jsonify(message="Unauthorized to view repo"), 403

    query = ("SELECT contributor_user, COUNT(sha) AS commits "
             "FROM gitdata "
             f"WHERE repo_id = {repo.id} AND date > current_date - '30 days'::interval "
             "GROUP BY 1 "
             "ORDER BY 1;")

    rows = db.session.execute(query)
    data = []

    for row in rows:
        data.append({"name": row['contributor_user'], "commits": int(row['commits'])})

    return jsonify(data=data), 200


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
        else:
            return jsonify(message="Repo not found"), 404
