let seekers;
let mouse;
class Seekers {
  constructor(maxCapacity = 40){
    this.seekers = [];
    this.maxCapacity = maxCapacity;
  }

  addSeeker(x, y, r){
    this.seekers.push(new Seeker(x, y, r));
  }

  run(target){
    for (let i = this.seekers.length - 1; i >= 0; i--){
      this.seekers[i].display();
      this.seekers[i].update(target);
      this.seekers[i].checkEdges();

      if (this.seekers[i].isDead()){
        this.seekers.splice(i, 1);
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  seekers = new Seekers();
  mouse = createVector(mouseX, mouseY);
  // Adding seekers to the Seeker system, with random position - constrained so that they aren't too scattered
  // Radius of each seeker could be randomized to create a more visually varied system 
  for (let i = 0; i < seekers.maxCapacity; i++) {
    seekers.addSeeker(
      random(width * 0.25, width * 0.75), 
      random(height * 0.25, height * 0.75), 
      10
    );
  }

}

function draw() {
  background(220);
  fill(100);
  seekers.run(mouse);
  mouse.set(mouseX, mouseY);

}
