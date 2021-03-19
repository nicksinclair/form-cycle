p5.disableFriendlyErrors = true;

let WIDTH = 600;
let HEIGHT = 600;
let FORM_SIZE = 30;

let maxRings = 6;
let minCanvasDimension = Math.min(WIDTH, HEIGHT);
let maxCanvasDimension = Math.max(WIDTH, HEIGHT);
let diameterFactor = minCanvasDimension / maxRings;

let prev_width = WIDTH;
let prev_height = HEIGHT;
let prev_formSize = FORM_SIZE;
let prev_maxRings = maxRings;

// UI DOM ELEMENTS
let primaryColorPicker;
let secondaryColorPicker;
let backgroundColorPicker;

let heightSlider;
let widthSlider;
let maxRingsSlider;
let growthRateSlider;
// let formSizeSlider; // taken out due to difficulties constraining to window

// VIDEO EXPORT
const fps = 30;
let frame = 1;
// let capturer = new CCapture({
//   format: "png",
//   framerate: fps,
// });
let capturer;
let recording = false;
let recordButton;

// THEMES
let dynamicTheme = [];
// let theme1 = [];
// let theme2 = [];
// let theme3 = [];
// let theme4 = [];
let PALETTE = [];

let rings = [];
let growthRate = 1;
let angle = 0;

function setup() {
  pixelDensity(1);
  colorMode(HSB);

  let maxWidth = windowWidth - 350;
  let maxHeight = windowHeight;

  // UI DOM ELEMENTS
  // parent ui element
  const ui = createDiv().class("control-panel");

  // labels
  const primaryLabel = createDiv("PRIMARY COLOR").class("label").parent(ui);
  const secondaryLabel = createDiv("SECONDARY COLOR").class("label").parent(ui);
  const backgroundLabel = createDiv("BACKGROUND COLOR")
    .class("label")
    .parent(ui);

  const heightLabel = createDiv("HEIGHT").class("label").parent(ui);
  const widthLabel = createDiv("WIDTH").class("label").parent(ui);
  const maxRingsLabel = createDiv("RINGS").class("label").parent(ui);
  const growthRateLabel = createDiv("GROWTH RATE").class("label").parent(ui);

  // color pickers
  primaryColorPicker = createColorPicker(color(0, 0, 10))
    .class("color-picker")
    .parent(primaryLabel);
  secondaryColorPicker = createColorPicker(color(0, 0, 40))
    .class("color-picker")
    .parent(secondaryLabel);
  backgroundColorPicker = createColorPicker(color(0, 0, 70))
    .class("color-picker")
    .parent(backgroundLabel);

  // sliders
  heightSlider = createSlider(300, maxHeight, 600, 50)
    .class("slider")
    .parent(heightLabel);
  widthSlider = createSlider(300, maxWidth, 600, 50)
    .class("slider")
    .parent(widthLabel);
  maxRingsSlider = createSlider(3, 12, 6, 1)
    .class("slider")
    .parent(maxRingsLabel);
  growthRateSlider = createSlider(1, 8, 1, 1)
    .class("slider")
    .parent(growthRateLabel);
  // formSizeSlider = createSlider(10, 30, 10, 1).class("slider").parent(ui);

  // VIDEO EXPORT
  // frameRate(fps);
  recordButton = document.createElement("button");
  recordButton.textContent = "START RECORDING";
  document.getElementsByClassName("control-panel")[0].appendChild(recordButton);
  recordButton.onclick = record;
  // recordButton.click(); // starts recording immediately

  createCanvas(WIDTH, HEIGHT, WEBGL);

  // MODES
  rectMode(CENTER);
  angleMode(DEGREES);

  // THEMES
  // theme1 = [
  //   color(0, 0, 10), // dark gray
  //   color(0, 0, 40), // light gray
  //   color(0, 0, 70), // very light gray
  // ];

  // theme2 = [
  //   color(180, 100, 30), // dark cyan
  //   color(180, 100, 60), // light cyan
  //   color(180, 100, 90), // very light cyan
  // ];

  // theme3 = [
  //   color(300, 100, 30), // dark magenta
  //   color(300, 100, 60), // light magenta
  //   color(300, 100, 90), // very light magenta
  // ];

  // theme4 = [
  //   color(60, 100, 30), // dark yellow
  //   color(60, 100, 60), // light yellow
  //   color(60, 100, 90), // very light yellow
  // ];

  calculatePalette();

  // maxRings = floor(random(3, 12)) + 1;
  // minCanvasDimension = min(WIDTH, HEIGHT);
  // maxCanvasDimension = max(WIDTH, HEIGHT);
  // diameterFactor = minCanvasDimension / maxRings;

  generateRings();
}

function draw() {
  let dx = (sin(angle) * width) / 2;
  // let dy = (cos(angle) * height) / 2;

  // let v = createVector(dx, dy, 0);
  // v.normalize();

  // LAYOUT
  calculateLayout();

  // COLOR
  calculatePalette();

  // LIGHTS
  ambientLight(120);
  pointLight(0, 0, 100, dx, 0, 0);

  angle += 0.001;

  background(PALETTE[2]);
  noStroke();

  // FORM CYCLE
  // renderRings();
  renderRingForms();

  // Uncomment to stop interactivity
  // noLoop();

  // Trigger video capture
  if (capturer) {
    console.log(recording);
    capturer.capture(document.getElementById("defaultCanvas0"));
  }
}

function generateRings() {
  rings.splice(0, rings.length);

  for (let i = 0; i <= maxRings; i++) {
    rings.push(new Ring(0, 0, diameterFactor * i));
  }

  rings.forEach((ring) => {
    ring.allocateForms();
  });
}

function renderRings() {
  rings.forEach((ring) => {
    ring.render();
  });
}

function renderRingForms() {
  rings.forEach((ring) => {
    if (ring.diameter > maxCanvasDimension * 1.5) {
      rings.pop();
      const newRing = new Ring(0, 0, 0);
      newRing.allocateForms();
      rings.unshift(newRing);
    }

    ring.renderForms();
    ring.grow(growthRateSlider.value());
  });
}

function calculateLayout() {
  WIDTH = widthSlider.value();
  HEIGHT = heightSlider.value();

  maxRings = maxRingsSlider.value();
  minCanvasDimension = Math.min(WIDTH, HEIGHT);
  maxCanvasDimension = Math.max(WIDTH, HEIGHT);
  diameterFactor = minCanvasDimension / maxRings;

  if (evaluateResize()) {
    generateRings();
  }

  prev_width = WIDTH;
  prev_height = HEIGHT;
  prev_maxRings = maxRings;

  resizeCanvas(WIDTH, HEIGHT);
}

function calculatePalette() {
  dynamicTheme = [
    primaryColorPicker.color(),
    secondaryColorPicker.color(),
    backgroundColorPicker.color(),
  ];

  PALETTE = dynamicTheme;
}

function evaluateResize() {
  if (prev_width != WIDTH) {
    return true;
  }
  if (prev_height != HEIGHT) {
    return true;
  }
  if (prev_formSize != FORM_SIZE) {
    return true;
  }
  if (prev_maxRings != maxRings) {
    return true;
  }
}

function record() {
  recording = true;
  capturer = new CCapture({
    format: "png",
    framerate: fps,
  });
  capturer.start();

  recordButton.textContent = "STOP RECORDING";

  recordButton.onclick = (e) => {
    capturer.stop();
    capturer.save();
    capturer = null;
    recording = false;

    recordButton.textContent = "START RECORDING";
    recordButton.onclick = record;
  };
}
