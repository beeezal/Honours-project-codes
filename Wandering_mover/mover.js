class AutonMover{
    constructor(x,y,r){
        this.r = r;
        this.D = r*2;                  //Diameter of the particle - actual 3rd argument of circle()
        this.pos = createVector(x,y);
        this.vel = createVector(0,0);
        this.acc = createVector(0,0);
        this.desired_vel = createVector();   
      }

    update(target, chk_edges = false){
        this.seek(target);           
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        if (chk_edges){ this.checkEdges(); }
      }

      applyForce(force){
        this.acc.add(force);
      }
  
    display(dinsting_direction = false, mouth_size = PI/10){
        if (dinsting_direction){
            push();
            translate(this.pos.x, this.pos.y);
            rotate(this.vel.heading());
            let lower_lip = mouth_size/2* sin(frameCount*0.1) +mouth_size/2;
            arc(0, 0, this.D, this.D, lower_lip, TWO_PI - lower_lip,PIE);
            pop();

        } 
        else {
        //Draws a circle at the current location (x,y) with radius r
        circle(this.location.x,this.location.y,this.D);
        }
    }

    seek(target){
            // Calculate the desired velocity
            this.desired_vel = p5.Vector.sub(target, this.pos);
            this.desired_vel.setMag(this.maxSpeed || 5); // Set the magnitude of the desired velocity to maxSpeed

            // Calculate the steering force
            let steer = p5.Vector.sub(this.desired_vel, this.vel);
            steer.limit(this.maxForce || 0.125); // Limit the steering force to maxForce

            this.applyForce(steer); // Apply the steering force
   
    }

}