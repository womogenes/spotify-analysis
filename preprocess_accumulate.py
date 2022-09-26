# Get moving averages of top 10s

import json
import datetime as dt
from collections import defaultdict
from tqdm import tqdm
from pprint import pprint

with open("./data/all_streams.json", encoding="utf-8") as fin:
    all_streams = json.load(fin)

# Access by date, then by song
# Song is (artist, track name)
moving_avgs = defaultdict(lambda: defaultdict(int))

min_day = dt.datetime(9999, 1, 1)
max_day = dt.datetime(1, 1, 1)

for stream in tqdm(all_streams):
    day = dt.datetime.strptime(
        stream[0], "%Y-%m-%d %H:%M").replace(hour=0, minute=0)
    min_day = min(min_day, day)
    max_day = max(max_day, day)

    play_time = stream[3]
    track_id = (stream[1], stream[2])

    for i in range(0, 7):
        # Add a few days
        moving_avgs[day + dt.timedelta(days=i)][track_id] += play_time


total_days = (max_day - min_day).days + 1
print(f"{total_days} total days of history")


def track_to_name(track):
    return f"{track[0]} – {track[1]}"


# Rip no comments
accumulated = []
rankings = []
durations = []

for day_count in range(total_days):
    day = min_day + dt.timedelta(days=day_count)
    time_totals = moving_avgs[day]
    top_tracks = sorted(time_totals.items(), key=lambda x: -x[1])

    todays_rankings = {}
    todays_durations = {}
    for i, track in enumerate(top_tracks):
        name = track_to_name(track[0])
        todays_rankings[name] = i
        todays_durations[name] = track[1]

    accumulated.append(top_tracks)
    rankings.append(todays_rankings)
    durations.append(todays_durations)


with open("./data/accumulated.js", "w", encoding="utf-8") as fout:
    json_str = json.dumps({
        "startDate": min_day.strftime("%Y-%m-%d"),
        "streamData": accumulated,
        "rankings": rankings,
        "durations": durations
    })
    fout.write(f"export const accumulated = {json_str};")
