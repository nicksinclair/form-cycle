class Shape {
  constructor(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.shape = floor(random(3));
    this.paletteIndex = floor(random(0, PALETTE.length - 1));
    this.color = PALETTE[this.paletteIndex];
    this.fill = randomSelectTwo();
    this.transform = floor(random(4));
    this.shapeSize = SHAPE_SIZE;
  }

  render() {
    if (this.fill) {
      fill(this.color);
    } else {
      stroke(this.color);
    }

    if (this.shape === 0) {
      rect(this.x, this.y, this.shapeSize);
    } else if (this.shape === 1) {
      ellipse(this.x, this.y, this.shapeSize);
    } else if (this.shape === 2) {
      // rotate(this.transform * 90);
      rightTriangle(this.x, this.y, this.shapeSize);
    }
  }

  update() {
    this.shapeSize = SHAPE_SIZE;
    this.color = PALETTE[this.paletteIndex];
  }
}