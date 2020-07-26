from flask import Blueprint, url_for, redirect, session, request, jsonify
from flask_jwt_extended import jwt_required, current_user
from app import db
import pandas as pd

from models import Repo

stats = Blueprint('stats', __name__)

@stats.route("/repo/<int:repo_id>/commits")
@jwt_required
def get_repo_commits(repo_id):
    repo = Repo.query.get(repo_id)
    if repo is None:
        return jsonify(message="Repo not found"), 404

    if repo.project.get_repo_for_user(current_user.id).id != repo.id:
        return jsonify(message="Unauthorized to view repo"), 403

    query = ("SELECT gitdata.date::date AS commit_date, COUNT(*) AS commits, contributor_user " 
             "FROM gitdata " 
             f"WHERE repo_id = {repo.id} " 
             "GROUP BY date(gitdata.date), contributor_user  "
             "ORDER BY date(gitdata.date);")

    df = pd.read_sql(query, db.engine)
    d = []
    dates = df['commit_date'].unique().tolist()
    contributors = df['contributor_user'].unique().tolist()

    for date in dates:
        data = {"date": date}
        for contributor in contributors:
            row = df[(df['commit_date'] == date) & (df['contributor_user'] == contributor)]
            if row.empty:
                data[contributor] = 0
            else:
                data[contributor] = int(row['commits'][0])
        d.append(data)

    resp = {
        "lines": contributors,
        "data": d
    }

    return jsonify(result=resp), 200