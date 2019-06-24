let img = new Image();
img.src = 'https://orig15.deviantart.net/8bed/f/2015/058/a/8/smb1_background_by_steamerthesteamtrain-d8jq7ea.png';

const canvasGame = {
  canvasBox: document.getElementById('canvas'),
  canvas: document.createElement("canvas"),
  frames: 0,
  start: function () {
    this.canvas.width = 800;
    this.canvas.height = 500;
    this.ctx = this.canvas.getContext("2d");
    canvas.insertBefore(this.canvas, this.canvasBox.childNodes[0]);
  },
  clear: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

canvasGame.start();

const backgroundImage = {
  img: img,
  x: 0,
  speed: -1,

  move: function() {
    this.x += this.speed;
    this.x %= canvas.width;
  },

  draw: function() {
    canvasGame.ctx.drawImage(this.img, this.x, 0);
    if (this.speed < 0) {
      canvasGame.ctx.drawImage(this.img, this.x + canvas.width, 0);
    } else {
      canvasGame.ctx.drawImage(this.img, this.x - this.img.width, 0);
    }
  },
};
// 
class Player {
  constructor(x, y, health, dmg) {
    this.x = x;
    this.y = y;
    this.vx = 1;
    this.health = health;
    this.dmg = dmg;
    this.speedX = 0;

  }

  drawPlayer() {
    canvasGame.ctx.fillRect(this.x, this.y, 36, 36);
  }
  update() {
    let car = document.querySelector('#car')
    canvasGame.ctx.fillRect(this.x, this.y, 36, 36);
  }
  movement() {
    if (this.x + this.speedX <= 0) {
      this.x -= this.speedX;
    } else if (this.x + this.speedX > 750) {
      this.x -= this.speedX;
    }
    this.x += this.speedX
  }
}

// let's see if your need to extend the player to create this 
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.health = 50;
    this.dmg = 20;
    this.width = 30;
    this.height = 30;
  }

  attack() {
    return this.dmg
  }
  takeDmg(dmg) {
    this.health -= dmg; 
  }
  updateEnemy() {
    canvasGame.ctx.fillRect(this.x, this.y, 36, 36);
  }
}

let player = new Player(50, 300, 100, 50);


var myObstacles = [];

function updateObstacles() {
  for (let i = 0; i < myObstacles.length; i++) {
    myObstacles[i].x += 1;
    console.log(myObstacles[i]);
    myObstacles[i].updateEnemy();
  }

  gameCanvas.frames += 1;
  if (gameCanvas.frames % 30 === 0) {
    myObstacles.push(new Enemy(850, 300));
  }
  requestAnimationFrame(updateObstacles);
}

// game update requesting set interval
function updateGameArea() {
  backgroundImage.move();
  canvasGame.clear();
  backgroundImage.draw();
  player.movement();
  player.update();
}

// player movement requests, add damage later, add jump later
document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37: // left arrow
      player.speedX -= player.vx;
      break;
    case 39: // right arrow
      player.speedX += player.vx;
      break;
  }
};

document.onkeyup = function (e) {
  player.speedX = 0;
};

