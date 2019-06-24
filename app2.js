const canvasGame = {
  canvasBox: document.getElementById('canvas'),
  canvas: document.createElement("canvas"),
  frames: 0,
  start: function () {
    this.canvas.width = 800;
    this.canvas.height = 500;
    this.ctx = this.canvas.getContext("2d");
    canvas.insertBefore(this.canvas, this.canvasBox.childNodes[0]);
    interval = setInterval(gameLoop, 20)
  },
  clear: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

let characterRight = new Image();
characterRight.src = 'images/right-side.png';
let characterLeft = new Image();
characterLeft.src = 'images/left-side.png';
let characterDown = new Image();
characterDown.src = 'images/knee.png';
let attackImg = new Image();
attackImg.src = 'images/attack-position.png';
let downLeft = new Image();
downLeft.src = 'images/knee-left.png';
let attackImgLeft = new Image();
attackImgLeft.src = 'images/attack-position-left.png';


class Player {
  constructor(x, y, health, dmg) {
    this.x = x;
    this.y = y;
    this.vx = 1;
    this.spriteX = 0;
    this.speedX = 0;
    this.health = health;
    this.dmg = dmg;
    this.width = 29;
    this.height = 31;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.frames = 0;
    this.scaleWidth = this.width * 2;
    this.scaleHeight = this.height * 2;
    this.otherFrame = 3;
    this.right = true;
    this.left = false;
    this.down = false;
    this.attack = false;
  }

  // Used to draw animations with no modification on the x or y axis
  characterAnimation(drawThis) {
    canvasGame.ctx.drawImage(
      drawThis,
      this.width * this.frames,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.scaleWidth,
      this.scaleHeight,
    );
  }

  // draw the player based on his position
  render() {
    canvasGame.ctx.clearRect(this.x, this.y, this.width, this.height);
    if (this.right === true && this.down === true) {
      canvasGame.ctx.drawImage(
        characterDown,
        this.width * this.frames,
        0,
        this.width,
        this.height,
        this.x,
        this.y + 15,
        this.scaleWidth,
        this.scaleHeight,
      );
    } else if (this.left === true && this.down === true) {
      canvasGame.ctx.drawImage(
        downLeft,
        this.width * this.frames,
        0,
        this.width,
        this.height,
        this.x,
        this.y + 15,
        this.scaleWidth,
        this.scaleHeight,
      );
    } else if (this.left === true && this.attack === true) {
      this.characterAnimation(attackImgLeft);
    } else if (this.right === true && this.attack === true) {
      this.characterAnimation(attackImg);
    } else if (this.left === true) {
      this.characterAnimation(characterLeft);
    } else if (this.right === true) {
      this.characterAnimation(characterRight);
    }
  }

  // update the movement and enforce boundarie to the left
  update() {
    if (this.x + this.speedX <= 0) { this.x -= this.speedX; }

    this.x += this.speedX;
    if (this.tickCount > 3) {
      this.tickCount = 0;
      this.frames += 1;
    }
    if (this.frames >= 5) {
      this.frames = 0;
    }
  }

  attack() {

  }

  receiveDamage(dmg) {
    this.health = this.health - dmg;
  }
}

// enemies
class Enemy {
  constructor (x, y, health, dmg) {
    this.x = x;
    this.y = y;
    this.health;
    this.dmg;
  }
}


let player = new Player(50, 300, 100, 50);
canvasGame.start();
player.render();


function gameLoop() {
  canvasGame.clear();
  player.render();
  player.update();
}


document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37: // left arrow
      player.speedX -= player.vx;
      player.left = true;
      player.right = false;
      player.down = false;
      player.attack = false;
      break;
    case 39: // right arrow
      player.speedX += player.vx;
      player.tickCount += 1;
      player.right = true;
      player.left = false;
      player.down = false;
      player.attack = false;
      break;
    case 40: // down arrow
      player.down = true;
      player.attack = false;
      break;
    case 32: // space-bar
      player.down = false;
      player.attack = true;
      break;
  }

};

document.onkeyup = function (e) {
  player.speedX = 0;
  player.frames = 0;
  player.update();
};
