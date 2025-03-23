// Desc: This sketch demonstrates the interaction between two agents: a seeker and an evader.
// Declare variables for our two agents
let seeker;
let evader;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Could make initial position random
  seeker = new Seeker(width * 0.35, random(height*0.25, height*0.75), 15);
  seeker.maxSpeed = 6;
  
  // Create the evader in the bottom right
  evader = new Evader(width * 0.55, random(height*0.25, height*0.75), 15);
  evader.maxSpeed = 3.5;
}

function draw() {
  background(220);

  seeker.applyBehaviours(/*seekWeight*/ 1, /*sepWeight*/ 0, /*target*/ evader.pos, /*arrive*/ false);
  seeker.update(/*chk_edges*/ true);

  evader.applyBehaviours(/*evadeWeight*/ 1, /*sepWeight*/ 0, /*target*/ seeker.pos, /*safeAware*/ true);
  evader.update(/*chk_edges*/ true);
  
  seeker.display(true, PI/6);
  evader.display(true);
  
  // Optional: display distance between them
  // let distance = p5.Vector.dist(seeker.pos, evader.pos);
  // fill(0);
  // textSize(14);
  // text(`Distance: ${floor(distance)}`, 10, 20);
  }