//Code to simulate an object being attracted towards the mouse pointer

//Initialising the mover object
let mv;
let mouse;

class SMover{
  /* This class is similar to the Mover class defined in 'Force Particle' file
  
  The Key differences being :
  - particle is considered to be of mass = 1 
  - Modified to stop/arrive at a particular object/target */
  constructor(x,y,r){
    this.r = r;
    this.D = r*2;                  //Diameter of the particle - actual 3rd argument of circle()
    this.pos = createVector(x,y);
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.desired_vel = createVector();   //refers to the ideal velocity to reach the target 
  }
  
  update(target, arriving_bhv = false, chk_edges = false){
    /* target - the position vector that the particle should move towards
    arriving_bhv - whether the particle should slow down and stop at the target  (booleen)
    chk_edges - whether we should wrap around the edges or not (booleen) */

    /* If arriving behaviour is true, then the accelartion of the particle will be according to a steering force 
    calculated by the seek() function or else we simply accelerate towards the mouse with mag = 0.5v */
    if (arriving_bhv){ 
      this.seek(target);           //Check seek() function for a more detailed explanation
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
    
    
    else{
      //using v.add instead of v.set to stay consistent with previous methods (will not make difference in this case)
      this.acc.add(p5.Vector.sub(target, this.pos).setMag(0.5)); 
      this.vel.add(this.acc);
      this.vel.limit(5);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    if (chk_edges){ this.checkEdges(); }
  }
  
  display(mouth_size = PI/10){
    /* We first save the current state of the canvas using push() and then
    translate our origin to the current position of our particle and 
    rotate the 'head' of the particle according to the direction of velocity and finally drawing the particle */

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    let lower_lip = mouth_size/2* sin(frameCount*0.1) + mouth_size/2
    arc(0, 0, this.D, this.D, lower_lip, TWO_PI - lower_lip,PIE);
    pop();

    // after the particle is drawn, we now go back to the original state of the canvas using pop()
  }
  
  applyForce(force){
    this.acc.add(force);
  }
  
  seek(target){
    // Function to calculate and apply the amount of force required to move towards the target

    /* desired velocity = target - current position 
    i.e. the desired direction should be along the line joining the target and the current position
    and the magnitude should be that the particle reaches as soon as possible (0 to maxSpeed). */

    this.desired_vel.set(p5.Vector.sub(target, this.pos));  //first we set the direction of the desired velocity
    
    let m = this.desired_vel.mag();

    //Then depending on the distance of the particle from target, we set the magnitude of the desired velocity as maxSpeed
    //if within 100 pixels of the target, then magnitude ∝ distance (pricisely, the linear scaling [0,100] -> [0, maxSpeed])
    if (m < 100){ 
      this.desired_vel.setMag(map(m,0,100,0,5));
    }
    //or if distance is more than 100 pixels, then mag = maxSpeed, which has been arbitrarily set to 5 
    else { this.desired_vel.setMag(5); } 
    
    //Now the steering force is the force required to change the current velocity to the desired velocity
    let steering_force = p5.Vector.sub(this.desired_vel, this.vel);
    steering_force.limit(0.125);    // which is also limited to a maximum value to create a more life like movement of the particle
    
    return this.applyForce(steering_force);
  }
  
  
   checkEdges() {
    //Function to check if the walker has crossed the canvas edges, if so - wrap around
    if (this.pos.x > width+this.r) {
      this.pos.x = this.pos.x - (width + this.r);
    } else if (this.pos.x < -this.r) {
      this.pos.x = width+( this.pos.x + this.r);
    }
    if (this.pos.y > height+this.r) {
      this.pos.y = this.pos.y - (height + this.r);
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + (this.pos.y + this.r);
    }
  }
}


function setup() {
  createCanvas(windowWidth,windowHeight);
  mv = new SMover(width/2,height/2,20);
  mouse = createVector(mouseX, mouseY);
}

function draw() {
  background(220);
  fill(100);
  mv.display();

  mouse.set(mouseX, mouseY);
  mv.update(/*target*/ mouse, /*arriving_bhv*/ true, /*chk_edges*/ true);
}