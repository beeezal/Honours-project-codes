let m;
let gravity; 
let fric_coeff = 0.075;

class Mover{

  constructor(x,y,m){
    this.location = createVector(x,y);
    this.velocity = createVector(2,-1);
    this.acceleration = createVector();
    this.mass = m;
    this.r = m*1.75;
  }
  
  update(){
    if (this.hitFloor()){
      let fric = p5.Vector.setMag(this.velocity, fric_coeff);
      fric.mult(-1);
      this.applyForce(fric);
    }
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.checkEdges();
    this.acceleration.mult(0);
  }
  
  show(){
    circle(this.location.x,this.location.y,this.r);
  }
  
  applyForce(force){
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }
  
  checkEdges(){
    if (this.location.y + this.r/2 > height){
      this.velocity.y*=-0.85;
      this.location.y += height - (this.location.y+this.r/2);
      
    } else if (this.location.y - this.r/2 < 0){
      this.velocity.y*=-0.85;
      this.location.y -= this.location.y - this.r/2
    }
    
    if (this.location.x + this.r/2 > width){
      this.velocity.x*=-0.95;
      this.location.x += width - (this.location.x+this.r/2);
    } else if (this.location.x - this.r/2 < 0) {
      this.velocity.x*=-0.95;
      this.location.x -= this.location.x - this.r/2;
    }
  }
  
  hitFloor(){
    return (this.location.y + this.r/2 >= height);  // try  > height - 1
  }
}

function setup() {
  createCanvas(400,400);
  gravity = createVector(0,0.075);
  m = new Mover(200,50,20);
}

function draw() {
  background(220);
  fill(100);
  m.show();
  m.applyForce(p5.Vector.mult(gravity,m.mass));
  m.update();
  
}