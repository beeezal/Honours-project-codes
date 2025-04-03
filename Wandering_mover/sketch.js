
let wanderer;
let randomRadius = true;

class Wanderer extends Seeker{
  constructor(x,y,r){
    super(x,y,r);

    this.wanderRadius = 40;
    this.predictionInterval = 100;    // How far ahead to draw the circle

    this.predictedPos = createVector(0,0);    // Vector from current position to predicted position

    // Since we are making random changes to the target position along a circle, 
    // we use the angle (b/w the target from the center and current direction) - and make small changes to it
    // i.e., we work with polar coordinates
    this.targetAngle=radians(random(0,360));    // Initialize to some random angle - same as random(0, TWO_PI)
    this.displayWanderCircle = true;
  }

  // Pseudo-target - target is generated within the class 
  // To disallow access outside the class, made it private - #
  #target = p5.Vector.fromAngle(this.targetAngle); 

  calculateWanderTarget(){              
    this.predictedPos.set(p5.Vector.setMag(this.vel, this.predictionInterval));
    this.predictedPos.add(this.pos);

    this.targetAngle += random(-0.3,0.3);    // here the change is in radians
    this.#target.set(p5.Vector.fromAngle(this.targetAngle + this.vel.heading(),this.wanderRadius)); // target = (θ, r)
    this.#target.add(this.predictedPos);
  }

  displayCircle(){
    noFill();
    line(this.pos.x,this.pos.y,this.predictedPos.x,this.predictedPos.y);
    circle(this.predictedPos.x,this.predictedPos.y, this.wanderRadius*2);
    line(this.predictedPos.x,this.predictedPos.y,this.#target.x,this.#target.y);
    circle(this.#target.x,this.#target.y,5);
  }

  display(dinstingDirection = false, mouthSize = PI / 10){
    if(this.displayWanderCircle){
      this.displayCircle();
    }
    super.display(dinstingDirection, mouthSize);
  }

  get target(){
    return this.#target;
  }
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  wanderer = new Wanderer(width/2,height/2,20);
}

function draw() {
  background(220);
  fill(100);

  wanderer.display(/*distingDirection*/ /*mouthSize*/);
  wanderer.wanderRadius = randomRadius ? constrain(wanderer.wanderRadius+=random(-2,2), 5, wanderer.predictionInterval-wanderer.r) 
                                      : wanderer.wanderRadius;
  wanderer.calculateWanderTarget();
  wanderer.update(/*target*/ wanderer.target,/*arrive*/ false,/*chk_edges*/ true);
}

// Providing functionality to toggle - displaying the wanderCircle, changing radius randomly
function keyPressed(){
  if (keyCode === 32){
    wanderer.displayWanderCircle = !wanderer.displayWanderCircle;
  }  
  if(key === 'r'){
    randomRadius = !randomRadius;
  }
  return false;
}