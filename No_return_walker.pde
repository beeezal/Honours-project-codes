import java.util.*;
import java.util.stream.Stream;

class Walker{
  int x;
  int y;
  List<Integer> choices = new ArrayList<Integer>(Arrays.asList(1,2,3,4));
  List<Integer> last_step_no = choices;
  int choice;
  int return_step;
  
  Walker(){
    x = width/2;
    y = height/2;
  }
  
  void display(){
    stroke(0);
    point(x,y);
  }
  
  void step(){
    int choice_index = int(random(3));
    choice = last_step_no.get(choice_index);
    if (choice == 1){
      x++;
      return_step = 2;
    } else if (choice == 2){
      x--;
      return_step =1;
    } else if (choice == 3){
      y++;
      return_step = 4;
    } else{
      y--;
      return_step = 3;
    }
    
    last_step_no.remove(Integer.valueOf(return_step));
    last_step_no.add(return_step);
    
  }
}

Walker w;

void setup(){
  size(1280,720);
  w = new Walker();
  background(255);
}

void draw(){
  w.step();
  w.display();
}
