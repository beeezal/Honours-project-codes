let w;

function setup() {
    createCanvas(windowWidth,windowHeight);
    background(200);
    w = new Walker(width / 2, height / 2, 0.75);
}

function draw() {
  w.display();

  /* Remove below comment slashes, if we need to also vary step size by a custom distribution */
  //let vel_mag =(frameCount%180==0)?genRandomNum()*50:1;
  w.move(vel_mag); 
}

class Walker{
  constructor(x, y, r) {
    this.location = createVector(x, y);
    this.v = p5.Vector.random2D();
    this.r = r;
  }
  
  display() {
    stroke(0);
    fill(100);
    strokeWeight(this.r/1.5);
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

function genRandomNum(){
  let x = random();
  let y = random();
  while (y>x**2){
    x = y;
    y = random();
  }
  return x;
}