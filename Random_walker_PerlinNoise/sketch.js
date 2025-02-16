/** 
 * A class for a 2D Random Walker (RW) whose velocity direction and optionally magnitude is manupilated according  
 * to Perlin Noise
 * 
 * This class serves as an alternative method to produce a random walk that appears smooth (by changing parameters)  
 * compared to the Wanderer and NormalWalker classes.  
 * The key difference from the other two classes is how the randomness is introduced in the velocity direction. We pick a  
 * random vector inside the 2-unit square, and then set its magnitude to either a constant or a noise value. Refer to the  
 * static method noisyVelocity() for implementation
 * 
 * @constructor PerlinWalker
 * @param {number} x - The x-coordinate of the walker's intial position.
 * @param {number} y - The y-coordinate of the walker's intial position.
 * @param {number} r - The radius of the walker.
*/
class PerlinWalker {
  // Setting class fields - offests for each output affected by noise (intial values of x in noise(x))
  // Note that the difference in exact values of offsets is arbitrary, 
  // but the difference itself is important, in order to avoid correlation between each direction and/or magnitude

  xOffset = 0;      
  yOffset = 1000;      
  magOffset = 2000;  

  constructor(x,y,r) {
    this.pos = createVector(x,y);   
    this.vel = p5.Vector.random2D();

    this.r = r;

    this.posHistory = [];
    this.showHistory = true;
  }

  display() {
    // Loop through posHistory and draw lines between consecutive points
    if (this.showHistory) {
      for (let i = 0; i < this.posHistory.length-1; i++) {
          let prevPos = this.posHistory[i];
          let currPos = this.posHistory[i + 1];
          
          // Check if the Mover has jumped edges, and continue the loop and don't draw the line
          let posChange = p5.Vector.dist(prevPos, currPos);
          if (posChange >= windowWidth || posChange >= windowHeight) {
              continue;
          }
          line(prevPos.x, prevPos.y, currPos.x, currPos.y);
      }
    }

    stroke(0);
    fill(100);
    circle(this.pos.x, this.pos.y, this.r*2);
    // We are doing r*2 because last param of circle() is diameter and r is radius    
  }

  /**
   * @method step
   * @param {boolean} [noisyStepSize=false] - If true, the step size is varied based on Perlin noise.
   * @param {number} [vel_mag=3] - The magnitude of the velocity vector if noisyStepSize is false.
   * @param {boolean} [chk_edges=true] - If true, checks if the walker has crossed the canvas edges and wraps around.
   * @param {number} [relativeMaxStepSize=0.75] - The maximum step size relative to the radius, when noisyStepSize is true.
 */
  step(noisyStepSize = false, vel_mag = 3, chk_edges=true, relativeMaxStepSize = 0.75) {
    this.updatePosHistory(1000);

    if(noisyStepSize){
    // Changing step size according to perlin noise, where magOffset is the input for noise() and
    // the output is mapped from (0,1) to (0,r*0.75) by default - experimentally observed to be visually appealing
        vel_mag = noise(this.magOffset)*(this.r*relativeMaxStepSize);
        this.magOffset += 0.01;
    }   

    //Manupilate the velocity of the walker using Perlin noise
    PerlinWalker.noisyVelocity(this.xOffset, this.yOffset, this.vel);
    //Explore difference between 
    // this.vel.mult(vel_mag); 
    this.vel.setMag(vel_mag);
    this.pos.add(this.vel);

    this.xOffset += 0.01;
    this.yOffset += 0.01;

    if(chk_edges){this.checkEdges();}
  }

  static noisyVelocity(xOffset, yOffset, vector){
    // map(val, d0, d1, d2, d3) is same as: 
    // Define linear scale and translate map L : [d0, d1] -> [d2, d3] 
    // return L(val) 
    // We need to map the noise output because we want the velocity's coords to be in the range [-1,1]
    // as velocity should be able to point in any direction in 2D space
    vector.set(map(noise(xOffset),0,1,-1,1), 
                map(noise(yOffset),0,1,-1,1));
  }

  updatePosHistory(maxArrayLength = 500) {
    // Limiting the maximum number of elements so that the array doesn't grow indefinitely
    // Array.shift() removes the 1st element, which is the oldest position visited by the walker
    this.posHistory.push(this.pos.copy());
    if (this.posHistory.length > maxArrayLength) {      // The max limit can be modified - could be added as a parameter
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

let noiseWalker;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noiseWalker = new PerlinWalker(width/2, height/2, 10)  
}

function draw() {
  background(255);
  noiseWalker.display();
  noiseWalker.step(/*noisyStepSize*/ false, /*vel_mag*/ 3, /*relativeMaxStepSize*/ 0.25);
}