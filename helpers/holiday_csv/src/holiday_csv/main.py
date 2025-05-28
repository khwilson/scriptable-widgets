import csv
import sys

import pandas as pd
import holidays
from datetime import datetime, timedelta

def generate_holiday_calendar():
    # Get today's date
    today = datetime.now()

    # Calculate start date (30 days ago) and end date (60 days from now)
    start_date = today - timedelta(days=30)
    end_date = today + timedelta(days=60)

    # Get Ontario holidays
    on_holidays = holidays.CA(prov='ON')

    writer = csv.writer(sys.stdout)
    writer.writerow(["date", "day_of_week", "is_holiday"])

    cur_date = start_date
    while cur_date <= end_date:
        writer.writerow([cur_date.strftime("%Y-%m-%d"), cur_date.strftime("%A"), cur_date in on_holidays])
        cur_date += timedelta(days=1)


if __name__ == "__main__":
    generate_holiday_calendar()
