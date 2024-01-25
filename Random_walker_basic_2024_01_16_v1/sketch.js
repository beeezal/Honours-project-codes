class Walker {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
  }

  show() {
    stroke(0);
    point(this.x, this.y);
  }

  step() {
    this.x += floor(random(-1, 2));
    this.y += floor(random(-1, 2));
  }
}

let w;

function setup() {
  createCanvas(700, 500);
  w = new Walker();
  background(255);
}

function draw() {
  w.show();
  w.step();
}
