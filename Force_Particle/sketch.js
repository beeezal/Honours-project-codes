// Program to simulate a bouncing ball under the influence of gravity and frictional forces
class Mover {
  /* This is the syntax for creating a class, now within this block 
  we can define and attach properties and functions (methods) to the class
  by using the 'this' keyword */

  // The constructor sets the initial values that are required after instantiation
  // for the Mover class we require, x and y coordinates, and mass of the object

  constructor(x, y, m) {
    // The velocity chosen such that it showcases all the features of the program

    this.pos = createVector(x, y);
    this.vel = createVector(2, -3);
    this.acc = createVector();    // Creates a vector of default values (0,0)
    this.mass = m;
    this.r = m * 0.875;   // Object radius ∝ mass - i.e., assuming bigger ⇒ heavier
    this.D = this.r * 2;    // Diameter - used as argument for drawing circle
  }

  // Inside classes, function/methods don't need the 'function' keyword,
  update() {
    // The below three lines implement the physical laws as sequenced in the modelling section
    // This implementation will be used throughout all simulations as part of the update() method

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);       //Acceleration is reset - only affected by force(s) at that frame

    // bounceEdges() is called after the reset, since the effect of friction
    // applied in bounceEdges() is only used in the next frame 
    this.bounceEdges();
  }

  show() {
    circle(this.pos.x, this.pos.y, this.D);
  }

  applyForce(force) {
    // Since gravitational acceleration is constant, we have to create a copy
    // And apply second law to the copied vector
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  bounceEdges(fric_Force = true) {
    if (this.pos.y + this.r > height) {
      this.vel.y *= -0.85;
      this.pos.y += height - (this.pos.y + this.r);

      if (fric_Force) {
        // Formula used is fric = µN (-û) where 
        // µ - frictional coeffecient, N- Normal force, û - unit vector along current velocity 
        // Basically friction is a force acting along the opposite direction of the velocity

        let fric = p5.Vector.setMag(this.vel, fric_coeff); 
        fric.mult(-1);
        this.applyForce(fric);
      }
    } else if (this.pos.y - this.r < 0) {
      this.vel.y *= -0.85;
      this.pos.y -= this.pos.y - this.r
    }

    if (this.pos.x + this.r > width) {
      this.vel.x *= -0.95;
      this.pos.x += width - (this.pos.x + this.r);
    } else if (this.pos.x - this.r < 0) {
      this.vel.x *= -0.95;
      this.pos.x -= this.pos.x - this.r;
    }
  }
}

let mv;   // The mover instance decleration
let gravity;
const fric_coeff = 0.075;

function setup() {
  createCanvas(400, 400);
  fill(100);
  gravity = createVector(0, 0.1);
  mv = new Mover(200, 80, 20);

}

function draw() {
  background(220);
  mv.show();

  // Applying any universal forces in the simulation - in this case just gravity
  // But since grativational force actually scales according to mass, we pass a new vector at each frame
  // i.e., our constant gravity vector multiplied by the mass of the mover
  mv.applyForce(p5.Vector.mult(gravity, mv.mass));


  mv.update();

}