# Preprocess extended listening history

import os
import json
from pprint import pprint
from tqdm import tqdm
import datetime as dt

folder_path = "./data/my_spotify_data_july_2023/MyData"

all_streams = []

for file in sorted(os.listdir(folder_path)):
    # There's a "Video" file, so let's filter that out
    if not "Audio" in file:
        continue

    print(f"Processing {file}...")

    with open(f"{folder_path}/{file}", "rb") as fin:
        data = json.load(fin)
        for stream in tqdm(data):
            entry = [
                dt.datetime.strftime(
                    dt.datetime.strptime(stream["ts"], "%Y-%m-%dT%H:%M:%SZ"),
                    "%Y-%m-%d %H:%M"
                ),
                stream["master_metadata_album_artist_name"],
                stream["master_metadata_track_name"],
                stream["ms_played"]
            ]

            if entry[1] == None or entry[2] == None:
                # Probably a podcast episode
                continue

            all_streams.append(entry)

    print()

with open("./data/all_streams.json", "wb") as fout:
    fout.write(b"[\n")
    for i, stream in enumerate(all_streams):
        line = "  " + json.dumps(stream)
        if i < len(all_streams) - 1:
            line += ","
        line += "\n"
        fout.write(line.encode())

    fout.write(b"]\n")

print(f"Done.")
