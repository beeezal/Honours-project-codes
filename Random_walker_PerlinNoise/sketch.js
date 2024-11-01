/* Code for a 2D RW that is manupilated according to perlin noise.
Walk is performed by picking a noise value separately for the x-coord and y-coord
Hereafter noise value will be referred as n-value*/

class Walker {
  /* Setting class fields - offests for each co-ordinate (starting point in time for the noise function)
  x and y offests are always increased and z offest only when step() affecting_parameter is 'step'*/
  xoff = 0;
  yoff = 1000;      ////Note that the difference is arbitrary, but it is important,
  zoff = 2000;      //in order to avoid co-orrelation between each direction (in a given time t)
  constructor(x,y,r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  display() {
    //Displays the walker at the current location with a circle of radius r
    stroke(0);
    fill(100);
    circle(this.x, this.y,this.r);
  }

  step(affecting_params='direction') {
    //Switch statement to determine the which parameter is being affected. Default: direction
    //All of them are affected by Perlin noise
    switch(affecting_params){
      // Changing the direction in which the walker is moving
      case 'direction':
        this.x += map(noise(this.xoff),0,1,-1,1)*3;     //map() scales n-value to (-1,1) from (0,1) - Enabling RW to move in all directions
        this.y += map(noise(this.yoff),0,1,-1,1)*3;     //3 is the maginitude of the step. An arbitrary standard accross all RW methods
        break;
      // Directly changing the location of the walker
      case 'location':
        this.x = noise(this.xoff)*width;                //noise(t)*k - scales n-value to (0,k) from (0,1)
        this.y = noise(this.yoff)*height;               //Therefore here x-values are (0,width) and y-values are (0,height)
        break;
      
      // Changing both step size and direction
      case 'step':
        let vel_mag = noise(this.zoff)*(this.r/2);
        this.x += map(noise(this.xoff),0,1,-1,1)*vel_mag;
        this.y += map(noise(this.yoff),0,1,-1,1)*vel_mag;
        this.zoff += 0.01;
        break;
    }
    
    this.xoff += 0.01;
    this.yoff += 0.01;

    /* NOTE: the affecting parameters' names are a bit misleading
    They do not actually in all cases directly refer to the parameter being affected. 
    But rather refer to the methods previously used to affect such parameters (with noise).
    For EG: all modes affect step_size to some extent. But none explicitly other than 'step' */
  }
  
}

let w;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  w = new Walker(width/2, height/2, 20);   //Creating an object w of the class Walker
}

function draw() {
  w.display();                             //Be aware of which function you call first according to the step type you chose
  w.step('direction');
}
