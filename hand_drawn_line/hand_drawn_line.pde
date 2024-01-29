int x = 0;
int len =200;
int start_point;

void setup(){
  size(900,500);
  background(255);
}

void draw(){
  start_point=(width-len)/2;
  strokeWeight(2);
  
  line(start_point, height/2, start_point + x, height/2);
  start_point += x;
  
  if (x>=len) { noLoop(); }
  x+=2;
}
