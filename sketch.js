let alignSlider, cohesionSlider, separationSlider, colorSliderR, colorSliderG, colorSliderB;
let xoff = 0.4;
let xoff2 = 6;
let xoff3 = 0.2;
let time1 = 1;

function Boid(){
    this.location = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxSpeed = 4;
    this.maxForce = 1;
    //this.calcSpeed;

    this.update = function() {
      this.location.add(this.velocity);
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.acceleration.mult(0);
      //this.calcSpeed = String(this.velocity.magSq());

    }

    this.display = function() {
      stroke(0);
      //fill(map(this.calcSpeed,0,20,0,255));
      fill(colorSliderR.value(),random(150,colorSliderG.value()),random(150,colorSliderB.value()),random(0,50));
      noStroke();
      //ellipse(this.location.x,this.location.y,map(this.calcSpeed,0,15,150,1),map(this.calcSpeed,0,15,150,1));
      ellipse(this.location.x,this.location.y,(xoff/xoff3)*(xoff/xoff3)+time1/500,(xoff/xoff3)*(xoff/xoff3)+time1/500);
    }

    this.edges = function() {
      if (this.location.x > width) {
        this.location.x = 0;
      } else if (this.location.x < 0) {
        this.location.x = width;
      }

      if (this.location.y > height) {
        this.location.y = 0;
      } else if (this.location.y < 0) {
        this.location.y = height;
      }
    }

    this.align = function(boids){
      let perceptionRadius = 50;
      let steering = createVector();
      let total = 0;

      for (let other of boids) {
        let d = dist(
          this.location.x,
          this.location.y,
          other.location.x,
          other.location.y
        );
        if (other != this && d < perceptionRadius) {
          steering.add(other.velocity);
          total++;
        }
      }

      if (total > 0) {
        steering.div(total);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);
      }
      return steering;

    }

    this.separation = function(boids) {
        let perceptionRadius = 50;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
          let d = dist(
            this.location.x,
            this.location.y,
            other.location.x,
            other.location.y
          );
          if (other != this && d < perceptionRadius) {
            let diff = p5.Vector.sub(this.location, other.location);
            diff.div(d * d);
            steering.add(diff);
            total++;
          }
        }
        if (total > 0) {
          steering.div(total);
          steering.setMag(this.maxSpeed);
          steering.sub(this.velocity);
          steering.limit(this.maxForce);
        }
        return steering;
    }

    this.cohesion = function(boids){
        let perceptionRadius = 100;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
          let d = dist(
            this.location.x,
            this.location.y,
            other.location.x,
            other.location.y
          );
          if (other != this && d < perceptionRadius) {
            steering.add(other.location);
            total++;
          }
        }
        if (total > 0) {
          steering.div(total);
          steering.sub(this.location);
          steering.setMag(this.maxSpeed);
          steering.sub(this.velocity);
          steering.limit(this.maxForce);
        }
        return steering;

    }
    this.flock = function(boids){

        let cohesion = this.cohesion(boids);
        let alignment = this.align(boids);
        let separation = this.separation(boids);

        alignment.mult(alignSlider2);
        cohesion.mult(cohesionSlider2);
        separation.mult(separationSlider2);

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }
  }


  let boids = [];

  function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    noStroke();



    // alignSlider = createSlider(0, 2, 1, 0.1);
    // alignSlider.position(10, height+20);
    //
    // cohesionSlider = createSlider(0, 2, 1, 0.1);
    // cohesionSlider.position(10, height+40);
    //
    // separationSlider = createSlider(0, 2, 1, 0.1);
    // separationSlider.position(10, height+60);

    colorSliderR = createSlider(0, 255, 1, 0.1);
    colorSliderR.position(10, height+60);

    colorSliderG = createSlider(0, 255, 1, 0.1);
    colorSliderG.position(width/8, height+60);

    colorSliderB = createSlider(0, 255, 1, 0.1);
    colorSliderB.position(width/8*2, height+60);

    for (let i = 0; i < 260; i++) {
      boids[i] = new Boid();
    }
  }

  function draw() {
    background('rgba(0,0,0, 0.001)');
    xoff = xoff + 0.04;
    xoff2 = xoff2 + 0.035;
    xoff3 = xoff3 + 0.032;
    time1 = time1 + 1

    let n = noise(xoff);
    let n2 = noise(xoff2);
    let n3 = noise(xoff3);

    alignSlider2 = map(n,0,1,0,2);
    cohesionSlider2 = map(n2,0,1,0,2);
    separationSlider2 =  map(n3,0,1,0,2);
    console.log(alignSlider2)
    for (let i = 0; i < boids.length; i++) {



      boids[i].edges();
      boids[i].update();
      boids[i].flock(boids);
      boids[i].display();
    }

  }
