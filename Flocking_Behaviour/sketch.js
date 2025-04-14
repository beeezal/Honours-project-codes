class FlockMover {
  constructor(x, y, r) {
    this.r = r;
    this.D = r * 2;                  //Diameter of the particle - used in defining shapes 

    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.desired_vel = createVector();

    this.maxSpeed = 5;
    this.maxForce = 0.125;
    this.lifespan = 600;
    this.desiredSeparation = this.D * 1.25;
    this.neighbourDistance = this.D * 3;

    this.posHistory = [];
    this.showHistory = false;

    this.zeroVector = createVector(0, 0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  updateHistory() {
    this.posHistory.push(this.pos.copy());
    if (this.posHistory.length > 500) {
      this.posHistory.shift();
    }
  }
  // CHANGE DISPLAY STYLE OF DIRECTION - MORE SIMPLER
  display(dinstingDirection = false, mouthSize = PI / 10) {
    if (dinstingDirection) {
      //Save local state and draw an oscillating mouth animation 
      //To visualise the direction of motion
      push();
      fill(100);
      translate(this.pos.x, this.pos.y);
      rotate(this.vel.heading());
      let lowerLip = mouthSize / 2 * sin(frameCount * 0.1) + mouthSize / 2;
      arc(0, 0, this.D, this.D, lowerLip, TWO_PI - lowerLip, PIE);
      pop();  //Return to orgianl saved state 
    }
    else {
      //Draws a circle at the current location (x,y) with radius r = D/2
      fill(100);
      circle(this.pos.x, this.pos.y, this.D);
    }
  }

  steer() {
    let steer = p5.Vector.sub(this.desired_vel, this.vel);
    steer.limit(this.maxForce);

    return steer;
  }

  separate(otherAgent) {
    let diffVector = p5.Vector.sub(this.pos, otherAgent.pos);
    if (otherAgent !== this) {
      diffVector.setMag(1 / diffVector.mag());
      this.desired_vel.set(diffVector);

      return this.steer();
    }
    return createVector(0, 0);
  }

  cohere(otherAgent) {
    if (otherAgent !== this) {
      this.desired_vel.set(p5.Vector.sub(otherAgent.pos, this.pos));
      return this.steer();
    }
    return createVector(0, 0);
  }

  align(otherAgent) {
    if (otherAgent !== this) {
      this.desired_vel.set(otherAgent.vel);

      return this.steer();
    }
    return createVector(0, 0);
  }

  update(chk_edges = false) {
    this.updateHistory();

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (chk_edges) { this.checkEdges(); }
  }

  checkEdges() {
    //Checking if the walker has crossed the canvas edges, if so - wrap around
    if (this.pos.x > width + this.r) {
      this.pos.x = this.pos.x - (width + this.r);
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + (this.pos.x + this.r);
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = this.pos.y - (height + this.r);
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + (this.pos.y + this.r);
    }
  }

  isDead() {
    return (this.lifespan <= 0);
  }
}

class Flock {
  constructor() {
    this.flock = [];
    this.maxCapacity = 50;
    this.curIndex = this.maxCapacity - 1;    // a variable to access what 'flocker' we are on
  }

  addMover(x, y, r) {
    this.flock.push(new FlockMover(x, y, r));
  }

  applyBehaviours(mover = this.flock[0], sepWeight = 1, cohereWeight = 0, alignWeight = 1 - sepWeight - cohereWeight) {
    // Can we constrain the user from setting weights s.t. net is greater than 1?
    // Get the steer forces mult with weights
    // Apply it to the acceleration - is there a way to add the forces at once?
    let count = 0;
    let sepCount = 0;

    let sepForce = createVector(0, 0);
    let alignForce = createVector(0, 0);
    let cohereForce = createVector(0, 0);
    for (let otherAgent of this.flock) {
      let distance = p5.Vector.dist(mover.pos, otherAgent.pos);
      if (distance < mover.desiredSeparation){
        sepForce.add(mover.separate(otherAgent));
        cohereForce.add(mover.cohere(otherAgent));
        alignForce.add(mover.align(otherAgent));

        count++;
        sepCount++;
      }
      else if (distance < mover.neighbourDistance) {
        cohereForce.add(mover.cohere(otherAgent));
        alignForce.add(mover.align(otherAgent));

        count++;
      }
    }
    if (sepCount > 0) {
      sepForce.mult(sepWeight/sepCount);
      cohereForce.mult(cohereWeight/count);
      alignForce.mult(alignWeight/count);
      
    mover.applyForce(p5.Vector.add(sepForce,alignForce));
    }
    else if(count > 0) {
      console.log(alignWeight/count);
      cohereForce.mult(cohereWeight/count);
      alignForce.mult(alignWeight/count);

      mover.applyForce(alignForce);
    }
  }

  run(chk_edges = true) {
    for (; this.curIndex > 0; this.curIndex--) {
      this.flock[this.curIndex].display();

      this.applyBehaviours(this.flock[this.curIndex], 1, 0.5, 0.5);
      this.flock[this.curIndex].update(chk_edges);

      if (this.flock[this.curIndex].isDead()) {
        this.flock.splice(this.curIndex, 1);
      }
    }
    this.curIndex = this.maxCapacity - 1;
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