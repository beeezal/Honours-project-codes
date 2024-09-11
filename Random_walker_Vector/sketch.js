/*Creating a RW - Random Walker class with vectors.
p5.Vector implements vectors in p5*/

class Walker{
   /* t - time, in units of frameCount. Used as input of noise(). 100 was chosen arbitrarily as starting point in time
   t is a Class field - not accesible by instances*/

  //t = 100; 
  //Uncomment above if RW is controlled by noise                                      
  constructor(x, y, r) {
    //Instance made with parameters position (x,y) and radius - r
    this.location = createVector(x, y);         //createVector() instantiates a vector object
    this.velocity = p5.Vector.random2D();              
    this.sa = random(0,TWO_PI);                 //sa - step angle
  }
  
  display() {
    stroke(0);
    fill(100);
    // Displaying the step of the walker using a relatively thin line
    strokeWeight(this.r/1.5);
    line(this.location.x - this.velocity.x, this.location.y - this.velocity.y,this.location.x, this.location.y);
    //Displaying the walker as a circle of radius r
    strokeWeight(1);
    circle(this.location.x, this.location.y, this.r);
  }
	
  
  move(vel_mag=1,chk_edges=false) {
    /* Idea used is new location = old location + velocity vector
    Velocity vectors changes every 3 frame randomly changing the params step size (vel_mag) and/or direction (sa) 
    3 frames picked as a standard accross all walker methods*/
    if (frameCount%3==0){
      this.sa = random(0,TWO_PI);
      //Uncomment below if RW is controlled by noise
      //this.sa = noise(this.t)*TWO_PI;
    }
    this.velocity.set(cos(this.sa), sin(this.sa));
    this.velocity.mult(vel_mag);
    this.location.add(this.velocity);
		if (chk_edges){
			this.checkEdges();
		}
    //Uncomment below if RW is controlled by noise
    //this.t += 0.01;
  }
	
  checkEdges() {
    //Function to check if the walker has crossed the canvas edges, if so - wrap around
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
  //Function to resize canvas when window is resized - in other words, resize our sketch when windown is resized
  resizeCanvas(windowWidth,windowHeight);
  background(200);
}

function RandomSquared(){
  //Function to generate random numbers with a x^2 distribution - using accept reject method
  let x = random();
  let y = random();
  while (y>x**2){
    x = y;
    y = random();
  }
  return x;
}

let w;

function setup() {
    createCanvas(windowWidth,windowHeight);
    background(200);
    w = new Walker(width / 2, height / 2, 20);
}

function draw() {
  w.display();
  /* Remove below comment slashes, if we need to also vary step size by a custom distribution */
  //let vel_mag =(frameCount%180==0)?RandomSquared()*50:1;
  //w.move(vel_mag);
  w.move(3,true); 
}