// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// setup paragraph

const para = document.querySelector('p');
let counter = 0;
para.textContent = "Ball count: " + counter;


class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "white";
    this.size = 10;

    window.addEventListener("keydown", (e) => {
      
      // let key = e.key;
      // if (key === "ArrowUp" && key === "ArrowLeft"){
      //   this.y -= this.velY;
      //   this.x -= this.velX;
      // }else if (key === "ArrowUp" && key === "ArrowRight"){
      //   this.y -= this.velY;
      //   this.x += this.velX;
      // }else if (key === "ArrowDown" && key === "ArrowLeft"){
      //   this.y += this.velY; 
      //   this.x -= this.velX;
      // }else if (key === "ArrowDown" && key === "ArrowRight"){
      //   this.y += this.velY; 
      //   this.x += this.velX;
      // }else if (key === "a" || key === "ArrowLeft"){
      //   this.x -= this.velX;
      // }else if (key === "d" || key === "ArrowRight"){
      //   this.x += this.velX;
      // }else if (key === "w" || key === "ArrowUp"){
      //   this.y -= this.velY;
      // }else if (key === "s" || key === "ArrowDown"){
      //   this.y += this.velY;   
      // }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
          this.x -= this.velX;
          break;
        case "ArrowRight":
        case "d":
          this.x += this.velX;
          break;
        case "ArrowUp":
        case "w":
          this.y -= this.velY;
          break;
        case "ArrowDown":
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // x-offset, y-offset, radius, starting angle, ending angle (in radians)
    ctx.stroke();
  }

  checkBounds() {
    if ((this.x + this.size) >= width) {
      this.x = (this.x) - this.size;
    }
  
    if ((this.x - this.size) <= 0) {
        this.x = (this.x) + this.size;
    }
  
    if ((this.y + this.size) >= height) {
        this.y = (this.y) - this.size;
    }
    
    if ((this.y - this.size) <= 0) {
        this.y = (this.velY) + this.size;
    }
  }

  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + ball.size) {
          ball.exists = false;
          counter--;  // update counter when evilCircle collides with balls
          para.textContent = "Ball count: " + counter;
        }
      }
    }
  }
}

class Ball extends Shape {
    constructor(x, y, velX, velY, color, size) {
      super(x, y, velX, velY);
      this.color = color;
      this.size = size;
      this.exists = true;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // x-offset, y-offset, radius, starting angle, ending angle (in radians)
        ctx.fill();
      }

    /*
    In each case, we include the size (size === radius) of the ball in the calculation because the x/y coordinates are 
    in the center of the ball, but we want the edge of the ball to bounce off the perimeter — we don't 
    want the ball to go halfway off the screen before it starts to bounce back.
    */
    update() {
        if ((this.x + this.size) >= width) {
            this.velX = -(this.velX);
        }
        
        if ((this.x - this.size) <= 0) {
            this.velX = -(this.velX);
        }
        
        if ((this.y + this.size) >= height) {
            this.velY = -(this.velY);
        }
        
        if ((this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }
    
        this.x += this.velX;
        this.y += this.velY;

    }

    collisionDetect() {
        for (const ball of balls) {
          if (!(this === ball) && ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
      
            if (distance < this.size + ball.size) {
              ball.color = this.color = randomRGB();
            }
          }
        }
      }
}

const balls = [];

while (balls.length < 25) {
  const size = random(10,20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
  counter++;  // update counter when balls are generated
  para.textContent = "Ball count: " + counter;
}

// instantiate evilCircle

let evilCircleSize = random(10,20);
const evilCircle = new EvilCircle(
  random(0 + evilCircleSize, width - evilCircleSize),
  random(0 + evilCircleSize, height - evilCircleSize)
);

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
  
    for (const ball of balls) {
      if (ball.exists) {
        ball.draw();
        ball.update();
        ball.collisionDetect();
      }

      evilCircle.draw();
      evilCircle.checkBounds();
      evilCircle.collisionDetect();
    }
  
    requestAnimationFrame(loop);
  }

// setup timer

const div = document.querySelector('div');
let timer = 0;

let time = 1000;
let flick = 500;
setInterval(() => {
  if (counter !== 0) {
    div.textContent = "Timer: " + (timer + 1);
    timer++;
  } 

}, time);

setInterval(() =>{
  if(counter === 0)
    div.className = div.className === "white-color" ? "other-color" : "white-color";
}, flick);


// invoke loop()

loop();