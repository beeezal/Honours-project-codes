let rWalkers;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(200);
  rWalkers = new rWalkerSystem();
  for (let i = 0; i < 5; i++) {
    rWalkers.addWalker(random(width/3, 2*width/3), random(height/3,2*height/3), 15);
  }
}

function draw() {
  background(200, 40);
  rWalkers.run();
}

class rWalker{
  constructor(x, y, r) {
    this.location = createVector(x, y);
    this.v = p5.Vector.random2D();
    this.r = r;
    this.sa = random(0, TWO_PI);
    this.life = 10*60;
  } 

  step(step_size=1,t_inteval=1) {
    if (this.life % t_inteval == 0) {
      this.sa = random(0, TWO_PI);
    }
    this.v.set(cos(this.sa), sin(this.sa));
    this.v.mult(step_size);
    this.location.add(this.v);
  }

  display() {
    stroke(0);
    fill(100);
    circle(this.location.x, this.location.y, this.r);
    this.life -= 1;
  }

  isDead() {
    return (this.life <= 0);
  }
}

class rWalkerSystem{
  constructor() {
    this.walkers = [];
  }

  addWalker(x, y, r) {
    this.walkers.push(new rWalker(x, y, r));
  }

  run() {
    let length = this.walkers.length - 1;
    for (let i = length; i >= 0; i--) {
      this.walkers[i].step(3, 15);
      this.walkers[i].display();
      if (this.walkers[i].isDead()) {
        this.walkers.splice(i, 1);
      }
    }
  } 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
  rWalkers.addWalker(mouseX, mouseY, 15);
}