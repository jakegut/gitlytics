from datetime import datetime, timedelta
import pandas as pd
from app import db

def get_past_dates(number_of_days=30):
    return pd.date_range(datetime.today().date() - timedelta(days=number_of_days), periods=number_of_days+1).to_pydatetime().tolist()

def get_repo_csv(project_id):
    query = ("SELECT repos.name AS repo_name, gitdata.sha AS commit_sha, gitdata.date::date AS commit_date, gitdata.contributor_user AS contributor, "
             "gitdata.additions AS additions, gitdata.deletions AS deletions, repos.group_id AS group_id "
             "FROM gitdata "
             "INNER JOIN repos ON repos.id = gitdata.repo_id "
             f"WHERE repos.project_id = {project_id}")

    df = pd.read_sql(query, db.engine)
    return df.to_csv()

