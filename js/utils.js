/**
 * https://stackoverflow.com/questions/9763441/milliseconds-to-time-in-javascript
 * Convert (milli)seconds to time string (hh:mm:ss[:mss]).
 *
 * @param Boolean seconds
 *
 * @return String
 */
Number.prototype.toTimeString = function (seconds) {
  var _24HOURS = 8.64e7; // 24*60*60*1000

  var ms = seconds ? this * 1000 : this,
    endPos = ~(4 * !!seconds), // to trim "Z" or ".sssZ"
    timeString = new Date(ms).toISOString().slice(11, endPos);

  if (ms >= _24HOURS) {
    // to extract ["hh", "mm:ss[.mss]"]
    var parts = timeString.split(/:(?=\d{2}:)/);
    parts[0] -= -24 * Math.floor(ms / _24HOURS);
    timeString = parts.join(':');
  }

  return timeString;
};

/*
    cyrb53 (c) 2018 bryc (github.com/bryc)
    A fast and simple hash function with decent collision resistance.
    Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
    Public domain. Attribution appreciated.
*/
export const cyrb53 = function (str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const trackToName = (track) => {
  // [artist, track]
  return `${track[0]} – ${track[1]}`;
};

export const cubicInterp = (y0, y1, y2, y3, mu) => {
  let a0, a1, a2, a3, mu2;

  mu2 = mu * mu;
  a0 = y3 - y2 - y0 + y1; //p
  a1 = y0 - y1 - a0;
  a2 = y2 - y0;
  a3 = y1;

  return a0 * mu * mu2 + a1 * mu2 + a2 * mu + a3;
};

export const cosineInterp = (y1, y2, mu) => {
  let mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
  return y1 * (1 - mu2) + y2 * mu2;
};
