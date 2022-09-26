import { draw } from './draw.js';

// Globals
window.Vector = p5.Vector;

window.setup = () => {
  const canvas = createCanvas(1280, 720);
  canvas.parent(document.querySelector('#sketch-container'));
  pixelDensity(2);
  ellipseMode('center');
  textFont('Inter');
  textStyle('bold');
  colorMode(HSB, 100);
};

window.draw = draw;
