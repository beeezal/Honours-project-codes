let w;

function setup() {
    createCanvas(windowWidth,windowHeight);
    background(200);
    w = new Walker(width / 2, height / 2, 0.75);
}

function draw() {
  w.display();
  /* Controling the magnitude of the step according to exponential distribution
  But multiplying by 3 to see effects clearer - generated random variable - Exp(3) */
  let vel_mag = genExp()*3;
  w.move(vel_mag); 
}

class Walker{
  constructor(x, y, r) {
    this.location = createVector(x, y);
    this.v = p5.Vector.random2D();
    this.r = r;
    stroke(0);
    fill(100);
  }
  
  display() {
    /*Making the line drawn if walker jumps much less thicker if larger and
    making sure it doesn't become too small if radius of walker is small*/
    strokeWeight(max(this.r/4,0.5));
    line(this.location.x - this.v.x, this.location.y - this.v.y,this.location.x, this.location.y);
    strokeWeight(1);
    circle(this.location.x, this.location.y, this.r);
  }
	
  
  move(vel_mag=1,chk_edges=false) {
    this.sa = random(0,TWO_PI)
    this.v.set(cos(this.sa), sin(this.sa));
    this.v.mult(vel_mag);
    this.location.add(this.v);
		if (chk_edges){
			this.checkEdges();
		}
  }
	
  checkEdges() {
    if (this.location.x > width+this.r) {
      this.location.x = this.location.x - (width + this.r);
    } else if (this.location.x < -this.r) {
      this.location.x = width+( this.location.x + this.r);
    }
    if (this.location.y > height+this.r) {
      this.location.y = this.location.y - (height + this.r);
    } else if (this.location.y < -this.r) {
      this.location.y = height + (this.location.y + this.r);
    }
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
  background(200);
}

function genExp(){
  let x = random();
  exp_rand= -log(x);
  return exp_rand;
}