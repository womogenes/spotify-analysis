# Combine streaming history files without duplicates

import os
import re
import json

all_streams = set()

for root, dirs, files in os.walk(os.path.abspath("./data")):
    for file in files:
        if re.match("StreamingHistory[0-9]+\.json", file):
            with open(os.path.join(root, file), encoding="utf-8") as fin:
                streams = json.load(fin)
                for s in streams:
                    tup = tuple(s.values())
                    if not tup in all_streams:
                        all_streams.add(tup)


print(f"{len(all_streams)} unique streams")

# Sort by end time
all_streams_sorted = sorted(all_streams, key=lambda s: s[0])

with open("./data/all_streams.json", "w", encoding="utf-8") as fout:
    json.dump(all_streams_sorted, fout, indent=4)
