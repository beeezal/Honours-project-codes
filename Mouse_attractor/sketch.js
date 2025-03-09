//Code to simulate an object being attracted towards the mouse pointer

//Initialising the mover object
let mv;
let mouse;

function setup() {
  createCanvas(windowWidth,windowHeight);
  mv = new Seeker(width/2,height/2,20);
  mouse = createVector(mouseX, mouseY);
}

function draw() {
  background(220);
  fill(100);
  mv.display(/*dinstingDirection*/ true);

  mouse.set(mouseX, mouseY);
  mv.update(/*target*/ mouse, /*arriving_bhv*/ true, /*chk_edges*/ true);
}