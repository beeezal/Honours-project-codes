let w;

class WalkerNormal {
  constructor(x, y, r) {
    //Instance made with parameters position (x,y) and radius - r
    this.location = createVector(x, y);         //createVector() instantiates a vector object
    this.velocity = p5.Vector.random2D();  
    this.r = r;                                 //r - diameter of the walker
    this.sa = this.velocity.heading();          //sa - step angle (intialised to direction of velocity)
		this.col = color(100)												//col - initialised with the grayscale value 100
  }
  
  display() {
		stroke(0);
    fill(this.col);
    // Displaying the step of the walker using a relatively thin line
    strokeWeight(this.r/1.5);
    line(this.location.x - this.velocity.x, this.location.y - this.velocity.y,this.location.x, this.location.y);
    //Displaying the walker as a circle of radius r
    strokeWeight(1);
    circle(this.location.x, this.location.y, this.r);
  }
  
  move(vel_mag=1,chk_edges=false) {
    if (frameCount % 3 === 0) {
			/*randomGaussian() returns a random sample from a N(0,1) 
			Therefore by performing scaling and translation of the distribution we have 
			the step_angle distributed according to N(current direction,π/8)*/
			
      this.sa = randomGaussian() * PI / 8 + this.velocity.heading();
			//σ and μ were picked experimentally
			
      if (abs(this.sa - this.velocity.heading()) >= QUARTER_PI) {       //  Changing color if change in direction is more than 2 S.Ds (π/4 = 2σ) 
        this.col = color(random(255), random(255), random(255));				// color is set by choosing random RGB values
      }
    }
    this.velocity = createVector(cos(this.sa), sin(this.sa));
    this.velocity.mult(vel_mag);
    this.location.add(this.velocity);
		if (chk_edges){
			this.checkEdges();
		}
  }
  
  checkEdges() {
		//Function to check if the walker has crossed the canvas edges, if so - wrap around
    if (this.location.x > width) {
      this.location.x = 0;
    } else if (this.location.x < 0) {
      this.location.x = width;
    }
    if (this.location.y > height) {
      this.location.y = 0;
    } else if (this.location.y < 0) {
      this.location.y = height;
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
  w = new WalkerNormal(width / 2, height / 2, 20);
  background(200);
}

function draw() {
  w.display();
  w.move(3,true);     // vel_mag = 3 is just an arbitrary standard picked after experimentation
}
