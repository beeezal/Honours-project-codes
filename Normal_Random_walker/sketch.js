let w;

class WalkerNormal {
  constructor(x, y, r) {
    //Instance made with parameters position (x,y) and radius - r
    this.pos = createVector(x, y);         //createVector() instantiates a vector object
    this.vel = p5.Vector.random2D();  

    this.r = r;                                 //r - radius of the walker

    this.directionAngle = this.vel.heading();   
		this.col = color(100)												//col - initialised with the grayscale value 100
  }
  
  display() {
		stroke(0);
    fill(this.col);
    // Displaying the step of the walker using a relatively thin line
    strokeWeight(this.r/1.5);
    line(this.pos.x - this.vel.x, this.pos.y - this.vel.y,this.pos.x, this.pos.y);
    // Displaying the walker as a circle of radius r
    strokeWeight(1);
    circle(this.pos.x, this.pos.y, this.r*2);
  }
  
  step(vel_mag=1,chk_edges=false) {
    if (frameCount % 3 === 0) {
			/*randomGaussian() returns a random sample from a N(0,1) 
			Therefore by performing scaling and translation of the distribution we have 
			the directionAngle distributed according to N(current direction,π/8)*/
			
      this.directionAngle = randomGaussian() * PI / 8 + this.vel.heading();
			//σ and μ were picked experimentally
			
      if (abs(this.directionAngle - this.vel.heading()) >= QUARTER_PI) {       //  Changing color if change in direction is more than 2 S.Ds (π/4 = 2σ) 
        this.col = color(random(255), random(255), random(255));				       // color is set by choosing random RGB values
      }
    }
    this.vel.setHeading(this.directionAngle);        // v.setHeading(direction) is same as v = v.mag() * (cos(directionAngle), sin(directionAngle))                                       
    this.vel.mult(vel_mag);
    this.pos.add(this.vel);
		if (chk_edges){
			this.checkEdges();
		}
  }
  
  checkEdges() {
		//Function to check if the walker has crossed the canvas edges, if so - wrap around
    if (this.pos.x > width) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = height;
    }
  }
}

function windowResized(){
  //Function to resize canvas when window is resized - in other words, resize our sketch when windown is resized
  resizeCanvas(windowWidth,windowHeight);
  background(200);
}

function setup() {
  createCanvas(windowWidth,windowHeight);
	
	//Initialising in the centre of the screen with size 20 is standard. Can be played around with.
  w = new WalkerNormal(width / 2, height / 2, 10);
  background(200);
}

function draw() {
  w.display();
  w.step(3,true);     // vel_mag = 3 is just an arbitrary standard picked after experimentation
}

/* 
3. add posHistory. 
4. add a setAngle function and parameters for - σ and μ - but default to π/8, curr direction
*/