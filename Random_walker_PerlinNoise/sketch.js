/* A 2D random walk performed by a point object on a screen.
Walk is performed by picking a noise valueseparately for the x-coord and y-coord*/

class Walker {
  //This is the class for the walker object
  xoff = 0;
  yoff = 1000;
  zoff = 2000;
  constructor(x,y,r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  display() {
    //Displays the point at the given location
    stroke(0);
    fill(100);
    circle(this.x, this.y,this.r);
  }

  step(affecting_params='direction') {
    switch(affecting_params){
      // Changing the direction in which the walker is moving
      case 'direction':
        this.x += map(noise(this.xoff),0,1,-1,1)*3;
        this.y += map(noise(this.yoff),0,1,-1,1)*3;
        break;
      // Directly changing the location of the walker
      case 'location':
        this.x = noise(this.xoff)*width;
        this.y = noise(this.yoff)*height;
        break;
      case 'step':
        let vel_mag = noise(this.zoff)*(this.r/2);
        this.x += map(noise(this.xoff),0,1,-1,1)*vel_mag;
        this.y += map(noise(this.yoff),0,1,-1,1)*vel_mag;
        this.zoff += 0.01;
        break;
    }
    
    this.xoff += 0.01;
    this.yoff += 0.01;
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
