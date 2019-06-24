
const canvasGame = {
  canvasBox: document.getElementById('canvas'),
  canvas: document.createElement("canvas"),
  frames: 0,
  start: function () {
    this.canvas.width = 800;
    this.canvas.height = 500;
    this.ctx = this.canvas.getContext("2d");
    canvas.insertBefore(this.canvas, this.canvasBox.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}


// canvas movement animation

canvasGame.start();

// 
class Player {
  constructor(x, y, health, dmg) {
    this.x = x;
    this.y = y;
    this.vx = 1;
    this.width = 20;
    this.height = 20;
    this.edgeRegion = 50;
    this.spriteX = 0;
    this.speedX = 0;
    this.health = health;
    this.dmg = dmg;
    this.animateTime = 2;
    this.animateCur = 0;
    this.moving = false;
    this.animatePos = [0, 42, 84, 42, 0, 128, 170, 128];
  }

  drawPlayer() {
    var charImg = new Image();
    charImg.onload = function () {
      charReady = true;
    };
    charImg.src = 'images/nes_mega_man_x_by_bonermang_d8f6gew.png';
    canvasGame.ctx.drawImage(charImage)
  }
  update() {
    canvasGame.ctx.fillStyle = 'red';
    canvasGame.ctx.fillRect(this.x, this.y, 100, 100);
  }
  movement() {
    if (this.x + this.speedX <= 0) {
      this.x -= this.speedX;
    }
    this.x += this.speedX
  }

  atack1() {
    return this.dmg;
  }
  atack2() {
    return this.dmg * 2;
  }

  heal() {

  }

  receiveDmg(dmg) {

  }

}

// let's see if your need to extend the player to create this 
class Enemie {
  constructor(x, y, health, dmg) {

  }
}

let player = new Player(50, 320, 150, 50);

// game update requesting set interval
function updateGameArea() {
  canvasGame.clear();
  player.movement();
  player.update();
}

// player movement requests, add damage later, add jump later
document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37: // left arrow
      player.speedX -= player.vx;
      player.moving = true
      break;
    case 39: // right arrow
      player.speedX += player.vx;
      player.moving = true
      break;
  }
};

document.onkeyup = function (e) {
  player.speedX = 0;
  player.moving = false;
};


let imgTest = new Image();
imgTest.src = "images/nes_mega_man_x_by_bonermang_d8f6gew.png";