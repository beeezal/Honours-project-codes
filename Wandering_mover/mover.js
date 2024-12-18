class AutonMover {
  constructor(x, y, r) {
    this.r = r;
    this.D = r * 2;                  //Diameter of the particle - used in defining shapes 
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.desired_vel = createVector();
  }

  update(target, chk_edges = false) {
    this.seek(target);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    if (chk_edges) { this.checkEdges(); }
  }

  applyForce(force) {
    this.acc.add(force);
  }

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

  seek(target) {
    // Calculate the desired velocity
    this.desired_vel = p5.Vector.sub(target, this.pos);
    this.desired_vel.setMag(this.maxSpeed || 5); // Set the magnitude of the desired velocity to maxSpeed

    // Calculate the steering force
    let steer = p5.Vector.sub(this.desired_vel, this.vel);
    steer.limit(this.maxForce || 0.125);         // Limit the steering force to maxForce or 0.125 

    this.applyForce(steer); 

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
}