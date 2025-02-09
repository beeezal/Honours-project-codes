let w;

class WalkerNormal {
  constructor(x, y, r) {
    //Instance made with parameters position (x,y) and radius - r
    this.pos = createVector(x, y);              //createVector() instantiates a vector object
    this.vel = p5.Vector.random2D();  

    this.r = r;                                 //r - radius of the walker

    this.directionAngle = this.vel.heading();   
		this.col = color(100)												//col - initialised with the grayscale value 100

    this.posHistory = [];
    this.showHistory = true;
  }
  
  display(drawConnectingLines = false) {
    // Loop through posHistory and draw lines between consecutive points
    if (this.showHistory) {
      for (let i = 0; i < this.posHistory.length-1; i++) {
          let prevPos = this.posHistory[i];
          let currPos = this.posHistory[i + 1];

          let posChange = p5.Vector.dist(prevPos, currPos);
          if (posChange >= windowWidth || posChange >= windowHeight) {
              continue;
          }
          line(prevPos.x, prevPos.y, currPos.x, currPos.y);
      }
    }

    // Displaying the step of the walker using a relatively thin line
    if(drawConnectingLines){
      strokeWeight(this.r/1.5);
      line(this.pos.x - this.vel.x, this.pos.y - this.vel.y,this.pos.x, this.pos.y);
      strokeWeight(1);
    }
    // Displaying the walker as a circle of radius r
    fill(this.col);
    circle(this.pos.x, this.pos.y, this.r*2);
  }
  
  step(vel_mag=1,chk_edges=false) {
    this.updateHistory();

    this.setAngle();
    this.vel.setHeading(this.directionAngle);        // v.setHeading(direction) is same as v = v.mag() * (cos(directionAngle), sin(directionAngle))                                       
    this.vel.setMag(vel_mag);
    this.pos.add(this.vel);

		if (chk_edges){this.checkEdges();}
  }
  
  setAngle(sigma = PI/8, mu = this.vel.heading(), changeRate = 3, changeColor = true){ 
    // Function to set the direction angle of the walker's velocity
    // changeRate - rate at which we change the angle in terms of frames
    // changeColor - Whether walker's color changes when the direction changes significantly (>2 SDs)

    if (frameCount % changeRate === 0) {
			// randomGaussian() returns a random sample from a N(0,1) 
			// Therefore by performing scaling and translation of the distribution we have 
			// the directionAngle distributed according to N(current direction,π/8) or N(μ,σ)
			
      this.directionAngle = randomGaussian() * sigma + mu;        //σ and μ were picked experimentally
			//this.drectionAngle = randomGaussian(mu, sigma);		
      
      // Changing color if change in direction is more than 2 SDs
      if (abs(this.directionAngle - mu) >= 2*sigma && (changeColor)) {
      this.col = color(random(255), random(255), random(255));        // color is set by choosing random RGB values
      }
    }
  }

  updateHistory(){
    this.posHistory.push(this.pos.copy());
    if (this.posHistory.length > 500) { 
        this.posHistory.shift();
    }
  }
  checkEdges() {
		//Function to check if the walker has crossed the canvas edges, if so - wrap around
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

function windowResized(){
  //Function to resize canvas when window is resized - in other words, resize our sketch when windown is resized
  resizeCanvas(windowWidth,windowHeight);
  background(200);
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  background(200);
	
	//Initialising in the centre of the screen with size 20 is standard. Can be played around with.
  w = new WalkerNormal(width / 2, height / 2, 10);
}

function draw() {
  background(200);
  w.display();
  w.step(/*vel_mag*/ 3,/*chk_edges*/ true);     // vel_mag = 3 is just an arbitrary standard picked after experimentation
}