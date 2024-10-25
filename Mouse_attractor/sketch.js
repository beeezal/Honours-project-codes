//Code to simulate an object being attracted towards the mouse pointer

//Initialising the mover object
let mv;


class Mover{
  /* This class is similart to the Mover class defined in 'Force Particle' file
  
  The Key differences being :
  - particle is considered to be a massless or of mass = 1 
  - Now also has functionality to stop/arrive to a particular object/target */
  constructor(x,y,r){
    this.r = r;
    this.D = r*2;
    this.pos = createVector(x,y);
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.mouse = createVector();
    this.desired_vel = createVector();
  }
  
  update(arriving_bhv = false){
    this.mouse.set(mouseX, mouseY);
    if (arriving_bhv){
      this.seek(this.mouse); 
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
    
    
    else{
      this.acc.set(p5.Vector.sub(this.mouse, this.pos).setMag(0.5));
      this.vel.add(this.acc);
      this.vel.limit(5);
      this.pos.add(this.vel);
    }
  }
  
  display(mouth_size = PI/10){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    let lower_lip = mouth_size/2* sin(frameCount*0.1) + mouth_size/2
    arc(0, 0, this.D, this.D, lower_lip, TWO_PI - lower_lip,PIE);
    pop();
  }
  
  applyForce(force){
    this.acc.add(force);
  }
  
  seek(target){
    this.desired_vel.set(p5.Vector.sub(target, this.pos));
    
    let d = this.desired_vel.mag();
    if (d < 100){
      this.desired_vel.setMag(map(d,0,100,0,5));
    }
    else { this.desired_vel.setMag(5); } 
    
    let steering_force = p5.Vector.sub(this.desired_vel, this.vel);
    steering_force.limit(0.125);
    
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
  mv = new Mover(width/2,height/2,20);
}

function draw() {
  background(220);
  fill(100);
  mv.display();
  mv.update(/*arriving_bhv*/true);
  mv.checkEdges();
}