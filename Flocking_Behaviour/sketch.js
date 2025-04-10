class Flock {
  constructor() {
    this.flock = [];
    this.maxCapacity = 50;
    this.curIndex = this.maxCapacity-1;    // a variable to access what 'flocker' we are on
  }

  addMover(x, y, r) {
    this.flock.push(new AutonMover(x, y, r));
  }

  applyBehaviours(mover = this.flock[0], sepWeight = 1, cohereWeight = 0, alignWeight = 1 - sepWeight - cohereWeight) {
    // Can we constrain the user from setting weights s.t. net is greater than 1?
    // Get the steer forces mult with weights
    // Apply it to the acceleration - is there a way to add the forces at once?
    let sepForce = p5.Vector.mult(mover.separate(this.flock), sepWeight);
    let alignForce = p5.Vector.mult(mover.align(this.flock), cohereWeight);
    let cohereForce = p5.Vector.mult(mover.cohere(this.flock), alignWeight);

    mover.applyForce(p5.Vector.add(sepForce,
      p5.Vector.add(cohereForce, alignForce)));
  }

  run(chk_edges = true) {
    for (; this.curIndex > 0 ; this.curIndex--) {
      this.flock[this.curIndex].display();

      this.applyBehaviours(this.flock[this.curIndex], 1, 0.5, 0.5);
      this.flock[this.curIndex].update(chk_edges);

      if (this.flock[this.curIndex].isDead()) {
        this.flock.splice(this.curIndex, 1);
      }
    }
    this.curIndex = this.maxCapacity-1; 
  }
}

let flock;

function setup() {
  createCanvas(windowWidth, windowHeight);
  flock = new Flock();

  for (let i = 0; i < flock.maxCapacity; i++) {
    flock.addMover(
      random(width * 0.3, width * 0.7),
      random(height * 0.3, height * 0.7),
      10
    );
  }
}

function draw() {
  background(220);
  flock.run();
}