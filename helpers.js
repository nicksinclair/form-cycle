// GEOMETRY

// Finds a point on a circle of a given radius
function pointOnCircle(posX, posY, radius, angle) {
  const x = posX + radius * cos(angle);
  const y = posY + radius * sin(angle);
  return createVector(x, y);
}

// Draws a right triangle
function rightTriangle(posX, posY, length) {
  beginShape();
  const a = createVector(posX + length / 2, posY + length / 2);
  const b = createVector(posX - length / 2, posY + length / 2);
  const c = createVector(posX - length / 2, posY - length / 2);

  vertex(a.x, a.y);
  vertex(b.x, b.y);
  vertex(c.x, c.y);
  vertex(a.x, a.y);
  endShape();
}

// Draws a hexagon
function hexagon(posX, posY, radius) {
  const rotAngle = 360 / 6;
  beginShape();
  for (let i = 0; i < 6; i++) {
    const thisVertex = pointOnCircle(posX, posY, radius, i * rotAngle);
    vertex(thisVertex.x, thisVertex.y);
  }
  endShape(CLOSE);
}

// UTILITY

// Randomly selects boolean value
function randomSelectTwo() {
  // Number of Lines
  const rand = random(1);

  if (rand < 0.5) {
    return true;
  } else {
    return false;
  }
}

// Selects a color from PALETTE randomly
function getRandomFromPalette() {
  const rand = floor(random(0, PALETTE.length - 1));
  return PALETTE[rand];
}

// SHAPES

// Applies a random rotation
function applyRotation() {
  const angle = floor(random(4));
  rotate(angle * 90);
}

// Handles logic for selecting shape to render
function renderShape(shape, posX, posY, shapeSize, transform) {
  if (shape === 0) {
    rect(posX, posY, shapeSize);
  } else if (shape === 1) {
    ellipse(posX, posY, shapeSize);
  } else if (shape === 2) {
    rotate(transform * 90);
    rightTriangle(posX, posY, shapeSize);
  }
}

// FORMS

// Select a form to render based on random value
function renderForm(form, size) {
  if (form === 1) {
    box(size);
  } else if (form === 2) {
    torus(size / 2, size / 8);
  } else if (form === 3) {
    cone(size / 2, size / 2);
  }
}

function applyTransformation(transform, angle) {
  if (transform === 1) {
    rotateForm(angle);
  } else if (transform === 2) {
    scaleForm(angle);
  } else if (transform === 3) {
    rotateForm(angle);
    scaleForm(angle);
  }
}

function rotateForm(angle) {
  rotateX(angle);
  rotateY(angle);
  rotateZ(angle);
}

function scaleForm(angle) {
  scale(abs(sin(angle)));
}
