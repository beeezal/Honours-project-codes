//Code to simulate a bouncing ball under the influence of gravity and frictional forces

// Initialising the mover object, gravitational acceleration and coeffecient of friction
// Uses of all are explained in the code
let mv;
let gravity; 
let fric_coeff = 0.075;     // An arbitrary choice made after some experimentation

class Mover{
  /* This class contains functionality that allows us to mainpulate an object through environmental forces */

  constructor(x,y,m){
    this.location = createVector(x,y);
    this.velocity = createVector(2,-1);  //Arbitrary choice that showcases all the features of the code
    this.acceleration = createVector(); // Creates a vector of default values (0,0)
    this.mass = m;
    this.r = m*1.75;                    // Object radius ∝ mass - bigger ⇒ heavier
  }
  
  update(){
    /* Updates the location of the object, according to the forces acting on it at frame 't'
    
    First  the acceleration is updated according to the net force accting on the mover
    using the formula a = F/m. Check the applyforce() function for implementation. 
    
    Then the acceleration is added to the current velocity to get new velocity. 
    Refactor the discrete vector equation [a = (v₁ - v₀)/t] to understand why we add (t=1 here)
    Similarly the new velocity is added to the location to get the new location of the mover */
    
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.acceleration.mult(0);       //Acceleration is reset - only affected by force(s) at that frame
    
    /* Note that acceleration is reset before call to bounceEdges() 
    As we want the effect frictional force applied in bounceEdges() to be carried over to the next frame */
    this.bounceEdges();
  }
  
  show(){
    //Draws a circle at the current location (x,y) with radius r
    circle(this.location.x,this.location.y,this.r);
  }
  
  applyForce(force){
    //Making a copy of the given force and dividing by movers' mass
    let f = p5.Vector.div(force, this.mass); 
    this.acceleration.add(f);      //Adding so that effect of net force will be considered each frame
  }
  
  bounceEdges(fric_Force=true){    
    /* Function to create a bouncing appearence of the mover when it contacts an edge
    
    Checks if mover is located beyond an edge 
    if so reset the location to the edge and reflect the velocity along the edge axis */
    
    if (this.location.y + this.r/2 > height){
      this.velocity.y*=-0.85;
      this.location.y += height - (this.location.y+this.r/2);
      
      /* Now if we have frictional surface as the bottom edge,
      then after the reset a frictional force is applied */
      if (fric_Force){
        /* Formula used is fric = µN (-û) where 
        µ - frictional coeffecient, N- Normal force, û - unit vector along current velocity 
        
        Basically friction is a force acting along the opposite direction of the velocity */ 
        let fric = p5.Vector.setMag(this.velocity, fric_coeff); //Here we consider N = 1
        fric.mult(-1);
        this.applyForce(fric);
      }
      
      
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
}

function setup() {
  createCanvas(400,400);
  fill(100);
  gravity = createVector(0,0.075);  // An arbitrary choice made after some experimentation
  mv = new Mover(200,50,20);

}

function draw() {
  background(220);
  mv.show();
  
  mv.applyForce(p5.Vector.mult(gravity,mv.mass));   
  // Applying any universal forces in the simulation - in this case gravitational force (G)
  // Note that G is scaled according to mass as the vector 'gravity' refers to graivtational acceleration
  
  mv.update();
  
}