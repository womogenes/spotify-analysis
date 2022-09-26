import { accumulated } from '../data/accumulated.js';
import { cyrb53, trackToName, cubicInterp, cosineInterp } from './utils.js';

let { streamData, rankings, startDate } = accumulated;
startDate = new Date(Date.parse(startDate));

const BAR_HEIGHT = 60;
const BAR_PAD = 10;
const GRAPH_X = 100;

const rankToY = (rank) => {
  // Get y-coordinate given a 0-8 ranking
  return rank * (BAR_HEIGHT + BAR_PAD) + 130;
};

const trackToColor = (x) => {
  // Track is an array with 2 elements: [author, track]
  const hue = cyrb53(x) % 100;
  return color(hue, 70, 50);
};

const dayToDateObj = (day) => {
  return new Date(startDate.getTime() + day * 60 * 60 * 24 * 1000);
};

const drawBar = (entry, rank) => {
  // entry is [[artist, track], millis]

  // barWidth will probably be extracted at some point
  const barWidth = entry[1] / 20000;

  fill(trackToColor(entry[0][1]));
  noStroke();
  rect(GRAPH_X, rankToY(rank), barWidth, BAR_HEIGHT);

  const barCenterY = rankToY(rank) + BAR_HEIGHT / 2;

  fill(255);
  textSize(30);
  textStyle('normal');
  textAlign('left', 'center');
  text(trackToName(entry[0]), GRAPH_X + 10, barCenterY);
  textAlign('right', 'center');
  text(parseInt(rank) + 1, GRAPH_X - 20, barCenterY);
};

const drawDay = (day) => {
  textSize(60);
  fill(255);
  textStyle('bold');
  textAlign('right', 'top');
  text(dayToDateObj(day).toLocaleDateString(), width - 50, 50);

  let fraction = day % 1;
  day = parseInt(day);

  // PROBLEM: songs that rise from below 8 are jumpy
  streamData[day].slice(0, 10).forEach((entry, rank) => {
    // entry is [[artist, track], millis]
    // Interpolate rankings
    let name = trackToName(entry[0]);

    // TODO: Make more sophisticated cubic interpolation
    let y0 = rankings[day > 1 ? day - 1 : 0][name];
    let y1 = rankings[day][name];
    let y2 = rankings[day + 1][name];
    let y3 = rankings[day + 2][name];
    // let trueRank = cubicInterp(y0, y1, y2, y3, fraction);
    let trueRank = cosineInterp(y1, y2, fraction);

    drawBar(entry, trueRank);
  });
};

const draw = () => {
  background(0);

  let x = map(constrain(mouseX, 0, width), 0, width, 0, streamData.length - 1);

  let day = x;

  drawDay(day);
};

export { draw };
