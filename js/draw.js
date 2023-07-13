import { accumulated } from '../data/accumulated.js';
import {
  cyrb53,
  trackToName,
  cubicInterp,
  cosineInterp,
  msToTime,
} from './utils.js';

let { streamData, rankings, durations, startDate } = accumulated;
startDate = new Date(Date.parse(startDate));

const BAR_HEIGHT = 40;
const BAR_PAD = 10;
const GRAPH_X = 100;

const rankToY = (rank) => {
  // Get y-coordinate given a 0-8 ranking
  return rank * (BAR_HEIGHT + BAR_PAD) + 120;
};

const trackToColor = (x) => {
  // Track is an array with 2 elements: [author, track]
  const hue = cyrb53(x) % 100;
  return color(hue, 70, 50);
};

const dayToDateObj = (day) => {
  return new Date(startDate.getTime() + day * 60 * 60 * 24 * 1000);
};

const drawBar = (entry, rank, duration) => {
  // entry is [[artist, track], millis]
  const barCenterY = rankToY(rank) + BAR_HEIGHT / 2;
  const barWidth = duration / 50000;

  fill(trackToColor(entry[0][1]));
  noStroke();
  rect(GRAPH_X, rankToY(rank), barWidth, BAR_HEIGHT, 10);

  fill(255);
  textSize(BAR_HEIGHT * 0.5);
  textStyle('normal');
  textAlign('left', 'center');
  text(
    `${trackToName(entry[0])} (${msToTime(duration)})`,
    GRAPH_X + 10,
    barCenterY
  );
  textAlign('right', 'center');
  text(Math.round(rank) + 1, GRAPH_X - 20, barCenterY);
};

const drawDay = (day) => {
  textSize(60);
  fill(255);
  textStyle('bold');
  textAlign('right', 'top');
  text(dayToDateObj(day).toLocaleDateString(), width - 50, 40);
  textAlign('left', 'top');
  text('Spotify top tracks', 50, 40);

  let fraction = day % 1;
  day = parseInt(day);

  // PROBLEM: songs that rise from below 8 are jumpy
  let tracks = new Set([...streamData[day], ...streamData[day + 1]]);
  let seen = new Set();

  tracks.forEach((entry) => {
    // entry is [[artist, track], millis]
    // Interpolate rankings
    let name = trackToName(entry[0]);
    if (seen.has(name)) {
      return;
    }
    seen.add(name);

    const normRank = (rank) => {
      return rank !== undefined ? rank : 12;
    };

    // TODO: Make more sophisticated cubic interpolation
    let y0 = normRank(rankings[day > 1 ? day - 1 : 0][name]);
    let y1 = normRank(rankings[day][name]);
    let y2 = normRank(rankings[day + 1][name]);
    let y3 = normRank(rankings[day + 2][name]);

    // let trueRank = cubicInterp(y0, y1, y2, y3, fraction);
    let trueRank = cosineInterp(y1, y2, fraction);
    let duration = cosineInterp(
      durations[day][name] || 0,
      durations[day + 1][name] || 0,
      fraction
    );

    drawBar(entry, trueRank, duration);
  });
};

const draw = () => {
  background(0);

  let x = map(constrain(mouseX, 0, width), 0, width, 0, streamData.length - 1);

  // let day = frameCount / 60 + 300;
  let day = min(parseInt(x), streamData.length - 3);

  drawDay(day);
};

export { draw };
