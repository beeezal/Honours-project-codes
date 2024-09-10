
function setup() {
  createCanvas(800, 400);
  background(200);

  loadPixels();
  let noiseScale = 0.01;

  // Updating pixels with perlin noise
  for (let y = 0; y < height; y++) {

    for (let x = 0; x < width/2; x++) {
      // Calculating brightness value for perlin noise
      const bright = map(Noise.perlin2(x * noiseScale, y * noiseScale),-0.75,0.75,0,255);
      set(x, y, floor(bright));
    }

    for (let x = width/2; x < width; x++) {
      // Calculating brightness value for simplex noise
      const bright = map(Noise.simplex2(x * noiseScale, y * noiseScale),-1.25,1.25,0,255);
      set(x, y, floor(bright));
    }
  }

  updatePixels();
  noLoop();
}

function draw() {
}
