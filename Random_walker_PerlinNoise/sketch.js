/* Code for a 2D RW that is manupilated according to perlin noise.
Perlin noise is used in different ways to create different effects
Hereafter noise value will be referred as n-value*/

class PerlinWalker {
  // Setting class fields - offests for each co-ordinate (starting point in time for the noise function)
  // x and y offests are always increased and z offest only when step() affecting_parameter is 'step'
  xoff = 0;
  yoff = 1000;      
  zoff = 2000; 
   // Note that the difference in exact values of x, y, z offsets is arbitrary, 
   // but the difference itself is important, in order to avoid co-orrelation between each direction (at a given time t)
  constructor(x,y,r) {
    this.pos = createVector(x,y);   
    this.vel =p5Vector.random2D();  

    this.r = r;

    this.posHistory = [];
    this.showHistory = true;
  }

  display() {
    // Displays the walker at the current location with a circle of radius r
    stroke(0);
    fill(100);
    circle(this.pos.x, this.pos.y, this.r*2);    //last param of circle() is diameter
  }

  step(noisyStepSize = false, vel_mag = 3, relativeMaxStepSize = 0.75) {
    if(noisyStepSize){
      // Changing step size according to perlin noise, where zoff is the input for noise() and
      // the output is mapped from (0,1) to (0,r*0.75) by default - experimentally observed to be visually appealing
        vel_mag = noise(this.zoff)*(this.r*relativeMaxStepSize);
        this.zoff += 0.01;
    }   
    this.noisyVelocity(this.xoff, this.yoff);
    this.vel.mult(vel_mag);
    this.pos.add(this.vel);

    this.xoff += 0.01;
    this.yoff += 0.01;
  }

  static noisyVelocity(xOffset, yOffset){
    // Changing the direction in which the walker is moving
    // by providing a n-value of change at each frame for x, y coords of this.vel
    // The n-value of change is mapped from (0,1) to (-1,1) which enables RW to move in all directions

    this.vel.set(map(noise(xOffset),0,1,-1,1), 
                 map(noise(yOffset),0,1,-1,1));
  }
  
}

let w;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  w = new PerlinWalker(width/2, height/2, 10);   //Creating an object w of the class Walker
}

function draw() {
  w.display();
  w.step(/*noisyStepSize*/ /*vel_mag*/ /*relativeMaxStepSize*/);
}

/* 
1. Mention the real use of vel_mag how it is different from other walkers.
2. Also ellaborate on how the difference in how the randomness is introduced and use is different
3. Add params chk_edges and showHistory, explain all the existing params concisely
4. Add the trialing behaviour
*/