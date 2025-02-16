//Pseudocode for the class.
/* 
1. Inherent all the functions from parent class Mover  - maybe learn how to in different ways.
2.  Includes update(), display(), applyForce(), chkEdges() and seek()
3. Modify update() or create new function that provides the wandering behaviour
4. a) Ask user for radius of the circle centered at predicted location and change in angle 
    b) Calculate the center of the circle by adding the current velocity vector to the position vector
    c) Initialize a random vector (for direction from the center) and change it every frame by given angle.

5. Now finally seek the point on the circle. 
6. Remaining follow the same procedure as in general Automonous Agent.
*/
class Wanderer extends Seeker{
  constructor(x,y,r){
    super(x,y,r);

    this.wanderRadius = this.r*2;
    this.predictionInterval = this.r*5;

    this.predictedPos = createVector(0,0); 
    this.targetAngle=radians(random(0,360));
    this.displayWanderCircle = true;
  }

  //Pseudo-target - target is generated within the class - make this private
  #target = p5.Vector.fromAngle(this.targetAngle); 

  calculateWanderTarget(){              //To calculate the predicted location and target
    this.predictedPos.set(p5.Vector.setMag(this.vel, this.predictionInterval));
    this.predictedPos.add(this.pos);

    this.targetAngle += random(-0.3,0.3);
    this.#target.set(p5.Vector.fromAngle(this.targetAngle + this.vel.heading(),this.wanderRadius));
    this.#target.add(this.predictedPos);
  }

  displayCircle(){
    noFill();
    //drawingContext.setLineDash([5,5]);
    line(this.pos.x,this.pos.y,this.predictedPos.x,this.predictedPos.y);
    //drawingContext.setLineDash([]);
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

let wanderer;
let randomRadius = false;

function setup() {
  createCanvas(windowWidth,windowHeight);
  wanderer = new Wanderer(width/2,height/2,10);
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

function keyPressed(){
  if (keyCode === 32){
    wanderer.displayWanderCircle = !wanderer.displayWanderCircle;
  }  
  if(key === 'r'){
    randomRadius = !randomRadius;
  }
  return false;
}