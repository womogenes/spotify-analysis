# Spotify analysis

I'm going to try to analyze my Spotify listening history in an animated data-vis style video.

Going to use Python for some preprocessing.

## How is data structured

Using [Spotify's data download feature](https://support.spotify.com/us/article/data-rights-and-privacy-settings/), you can download a zip file. You can put several of the unzipped versions of these zip files, renamed to be distinct, in `./data`.

Any file names that match `StreamingHistory[n].json` will get read in.
