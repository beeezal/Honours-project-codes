/* A 2D random walk performed by a point object on a screen.
The Probability distribution taken for the RW is Uniform(-1,1) - separately for the x-value and y-value*/

class Walker {
  //This is the class for the point object
  constructor() {
    //we are placing the point at the center of the screen
    this.x = width / 2;
    this.y = height / 2;
  }

  show() {
    //Displays the point at the given location
    stroke(0);
    point(this.x, this.y);
  }

  step() {
    //Changes the location of the point randomly within a unit square of the current location
    this.x += random(-1, 1);
    this.y += random(-1, 1);
  }
}

let w;

//Global functions inbuilt in p5.js, setup() runs once and draw() runs repeatedly
/*The setup() function is used to define the initial environment properties such as screen size and background color
and creating any objects required in the programme*/
function setup() {
  createCanvas(700, 500);
  w = new Walker();   //Creating an object w of the class Walker
  background(255);
}

/*The draw() function is called repeatedly in a infinte loop. It is used to animate the objects in the canvas,
by repeatedly changing the variables of the objects presented on the screen*/
function draw() {
//*Calling the functions of the walker object 'w' - show() and step() 
  w.show();
  w.step();
}
