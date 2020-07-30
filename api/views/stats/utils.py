from datetime import datetime, timedelta
import pandas as pd

def get_past_dates(number_of_days=30):
    return pd.date_range(datetime.today().date() - timedelta(days=number_of_days), periods=number_of_days+1).to_pydatetime().tolist()