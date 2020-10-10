from flask import Blueprint, url_for, redirect, session, request, jsonify, make_response
from flask_jwt_extended import jwt_required, current_user
from app import db
import pandas as pd
from datetime import datetime, timedelta
import settings

from models import Repo, Project
from views.projects.schemas import RepoSchema
from tasks import get_project_commits
from .utils import get_past_dates, get_repo_csv

from sqlalchemy_utils.types.encrypted.encrypted_type import AesEngine

stats = Blueprint('stats', __name__)

engine = AesEngine()
engine._update_key(settings.DB_ENCRYPT_KEY)
engine._set_padding_mechanism()

@stats.route("/repo/<int:repo_id>/commits")
@jwt_required
def get_repo_commits(repo_id):
    days = int(request.args.get('days', 30))
    repo = Repo.query.get(repo_id)
    if repo is None:
        return jsonify(message="Repo not found"), 404

    if not (repo.project.course.is_owner(current_user.id) or repo in current_user.repos):
        return jsonify(message="Unauthorized to view repo"), 403

    query = ("SELECT gitdata.date::date AS commit_date, COUNT(*) AS commits, contributor_user " 
             "FROM gitdata " 
             f"WHERE repo_id = {repo.id} AND date > current_date - '{days} days'::interval " 
             "GROUP BY date(gitdata.date), contributor_user  "
             "ORDER BY date(gitdata.date);")

    df = pd.read_sql(query, db.engine, parse_dates=['commit_date'])
    d = []
    dates = get_past_dates(days)

    df['contributor_user'] = [engine.decrypt(user) for user in df['contributor_user']]
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
    days = int(request.args.get('days', 30))
    repo = Repo.query.get(repo_id)
    if repo is None:
        return jsonify(message="Repo not found"), 404

    if not (repo.project.course.is_owner(current_user.id) or repo in current_user.repos):
        return jsonify(message="Unauthorized to view repo"), 403

    query = ("SELECT gitdata.date::date AS commit_date, contributor_user, SUM(additions) AS additions, SUM(deletions) AS deletions "
             "FROM gitdata "
             f"WHERE repo_id = {repo.id} AND date > current_date - '{days} days'::interval "
             "GROUP BY 1, 2 "
             "ORDER BY 1 ")

    df = pd.read_sql(query, db.engine, parse_dates=['commit_date'])
    dates = get_past_dates(days)

    df['contributor_user'] = [engine.decrypt(user) for user in df['contributor_user']]
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
    days = int(request.args.get('days', 30))
    repo = Repo.query.get(repo_id)
    if repo is None:
        return jsonify(message="Repo not found"), 404

    if not (repo.project.course.is_owner(current_user.id) or repo in current_user.repos):
        return jsonify(message="Unauthorized to view repo"), 403

    query = ("SELECT contributor_user, COUNT(sha) AS commits "
             "FROM gitdata "
             f"WHERE repo_id = {repo.id} AND date > current_date - '{days} days'::interval "
             "GROUP BY 1 "
             "ORDER BY 1;")

    rows = db.session.execute(query)
    data = []

    for row in rows:
        data.append({"name": engine.decrypt(row['contributor_user']), "commits": int(row['commits'])})

    return jsonify(data=data), 200


@stats.route("/project/<int:proj_id>/populate", methods=['PUT'])
@jwt_required
def populate(proj_id):
    proj = Project.query.get(proj_id)
    if proj is None:
        return jsonify(message="Project not found"), 404

    if not proj.course.is_owner(current_user.id):
        return jsonify(message="Unauthorized to view repo"), 403

    get_project_commits.delay(proj.id)
    return '', 204

@stats.route("/project/<int:project_id>/csv")
@jwt_required
def get_project_csv(project_id):
    proj = Project.query.get(project_id)
    if proj is None:
        return jsonify(message="Project not found"), 404

    if not proj.course.is_owner(current_user.id):
        return jsonify(message="Unauthorized to view repo"), 403

    resp = make_response(get_repo_csv(project_id))
    resp.headers["Content-Type"] = "text/csv"
    string = f'{proj.name.replace(" ", "_")}_repos_{datetime.utcnow().isoformat()}.csv'
    resp.headers["Content-Disposition"] = f"attachment; filename={string}"
    return resp

