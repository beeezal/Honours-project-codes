class AutonMover {
    constructor(x, y, r) {
        this.r = r;
        this.D = r * 2;                  //Diameter of the particle - used in defining shapes 
        
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.acc = createVector(0, 0);
        this.desired_vel = createVector();

        this.maxSpeed = 5;
        this.maxForce = 0.125;
        this.lifespan = 600;
        this.desiredSeparation = this.D;

        this.posHistory = [];
        this.showHistory = false;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    updateHistory(){
        this.posHistory.push(this.pos.copy());
        if (this.posHistory.length > 500) { 
            this.posHistory.shift();
        }
    }

    display(dinstingDirection = false, mouthSize = PI / 10) {
        if (dinstingDirection) {
            //Save local state and draw an oscillating mouth animation 
            //To visualise the direction of motion
            push();
            fill(100);
            translate(this.pos.x, this.pos.y);
            rotate(this.vel.heading());
            let lowerLip = mouthSize / 2 * sin(frameCount * 0.1) + mouthSize / 2;
            arc(0, 0, this.D, this.D, lowerLip, TWO_PI - lowerLip, PIE);
            pop();  //Return to orgianl saved state 
        }
        else {
            //Draws a circle at the current location (x,y) with radius r = D/2
            fill(100);
            circle(this.pos.x, this.pos.y, this.D);
        }
    }

    steer(){ 
        let steer = p5.Vector.sub(this.desired_vel, this.vel);
        steer.limit(this.maxForce);         

        return steer;
    }

    separate(entityArray){
        let count = 0;
        this.desired_vel.set();

        for (let otherAgent of entityArray){
            let diffVector = p5.Vector.sub(this.pos, otherAgent.pos);
            if (otherAgent !== this && (diffVector.mag() < this.desiredSeparation)){
                diffVector.setMag(1/diffVector.mag());
                this.desired_vel.add(diffVector);
                count++;
            }
       }
       if (count > 0){
            this.desired_vel.setMag(this.maxSpeed);
            return this.steer();
        }
        return createVector(0,0);
    }

    checkEdges() {
        //Checking if the walker has crossed the canvas edges, if so - wrap around
        if (this.pos.x > width + this.r) {
            this.pos.x = this.pos.x - (width + this.r);
        } else if (this.pos.x < -this.r) {
            this.pos.x = width + (this.pos.x + this.r);
        }
        if (this.pos.y > height + this.r) {
            this.pos.y = this.pos.y - (height + this.r);
        } else if (this.pos.y < -this.r) {
            this.pos.y = height + (this.pos.y + this.r);
        }
    }

    isDead(){
        return (this.lifespan <= 0);
    }
}

class Seeker extends AutonMover{
    seek(target, arrive = false){
        // Calculate the desired velocity
        this.desired_vel = p5.Vector.sub(target, this.pos);    // Same as desired.vel.set(p5.Vector.sub(target, this.pos))
        let distance = this.desired_vel.mag();


        if (arrive && distance < 100){
                let desiredMag = map(distance, 0, 100, 0, this.maxSpeed);
                this.desired_vel.setMag(desiredMag);
                                
        }
        else{this.desired_vel.setMag(this.maxSpeed)};

        return this.steer();
    }

    applyBehaviours(seekWeight = 0.5, sepWeight = 0.5, target = createVector(width/2,height/2), arrive = false, entityArray = []){
        let seekForce = p5.Vector.mult(this.seek(target, arrive), seekWeight);
        let separationForce = p5.Vector.mult(this.separate(entityArray), sepWeight);
        
        this.applyForce(seekForce);
        this.applyForce(separationForce);
    }

    update(chk_edges = false) {
        this.updateHistory();

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);

        if (chk_edges) { this.checkEdges(); }
    }

    display(dinstingDirection = false, mouthSize = PI / 10) {
        if (this.showHistory) {
            for (let i = 0; i < this.posHistory.length-1; i++) {
                let prevPos = this.posHistory[i];
                let currPos = this.posHistory[i + 1];

                let posChange = p5.Vector.dist(prevPos, currPos);
                if (posChange >= windowWidth || posChange >= windowHeight) {
                    continue;
                }
                line(prevPos.x, prevPos.y, currPos.x, currPos.y);
            }
        }
        super.display(dinstingDirection, mouthSize);
    }
}

class Evader extends AutonMover {
    evade(target, safeAware = false){ 
        this.desired_vel = p5.Vector.sub(this.pos, target);
        let distance = this.desired_vel.mag();
        
        if (safeAware){
            if (distance < 150) {
                let desiredMag = map(distance, 150, 0, this.maxSpeed, this.maxSpeed*2);
                this.desired_vel.setMag(desiredMag);

                return this.steer();
            }

            if (distance > 500) {
                let desiredMag = map(distance, 600, 500, this.maxSpeed * 0.2, this.maxSpeed, true);
                this.desired_vel.setMag(desiredMag);   
                
                return this.steer();
            }
        }
        this.desired_vel.setMag(this.maxSpeed);
        return this.steer();
    }

    applyBehaviours(evadeWeight = 0.5, sepWeight = 0.5, target = createVector(width/2,height/2), safeAware = false, entityArray = []){
        let evadeForce = p5.Vector.mult(this.evade(target, safeAware), evadeWeight);
        let separationForce = p5.Vector.mult(this.separate(entityArray), sepWeight);
        
        this.applyForce(evadeForce);
        this.applyForce(separationForce);

    }

    update(chk_edges = false){
        this.updateHistory();

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);

        if (chk_edges) { this.checkEdges(); }
    }

    display(dinstingDirection = false, mouthSize = PI / 10) {
        if (this.showHistory) {
            for (let i = 0; i < this.posHistory.length-1; i++) {
                let prevPos = this.posHistory[i];
                let currPos = this.posHistory[i + 1];

                let posChange = p5.Vector.dist(prevPos, currPos);
                if (posChange >= windowWidth || posChange >= windowHeight) {
                    continue;
                }
                line(prevPos.x, prevPos.y, currPos.x, currPos.y);
            }
        }
        super.display(dinstingDirection, mouthSize);
    }
}

/*
Problems with direct implementation of Evader:
- evader runs away too much - because we are bounded by the canvas - keeps turning around the edges - might be desirable depending on the case
- eg. if the cavas is huge or velocities are low 
*/