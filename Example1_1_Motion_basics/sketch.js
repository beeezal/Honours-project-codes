// Program to move a circle from center to 400 px to the right, at desired speed

let x_coord
let y_coord 
let timeTaken
let speed

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  fill(100);

  x_coord = width/2;
  y_coord = height/2;

  // Change the time taken here (in #frames), to see how it affects the animation
  timeTaken = prompt("Enter the time taken (in px) for the circle to move", 400);
  speed = 400/timeTaken

  circle(x_coord, y_coord, 20);
}

function draw() {
  // If condition used here to stop the draw loop() after we have arrived at our destination
  if (x_coord <= width/2 + 400){
    background(255);

    // Since we are only moving along x-axis, we can ignore the y-coordinate
    x_coord += speed;
    // If we want to move to a location that is not along either axis relative to initianl position
    // Then we would have to calculate the slope of the line joining the locations and
    // use that to manupilate the y-coord i.e., 
    // y_coord += slope * speed;   [where slope = change in y / change in x]

    circle(x_coord, y_coord, 20);
  }
  // noLoop() will stop the draw loop
  else{ noLoop(); }
}

