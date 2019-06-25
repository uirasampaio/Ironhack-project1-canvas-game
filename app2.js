// main Canvas star and stop functions

const canvasGame = {
  canvasBox: document.getElementById('canvas'),
  canvas: document.createElement("canvas"),
  frames: 0,
  maxEnemies: 2,
  start: function () {
    this.canvas.width = 800;
    this.canvas.height = 500;
    this.ctx = this.canvas.getContext("2d");
    canvas.insertBefore(this.canvas, this.canvasBox.childNodes[0]);
    interval = setInterval(gameLoop, 20)
  },
  clear: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(interval);
  }
}

let bgTest = new Image();
bgTest.src = 'images/super-mario-background-images-5632345.jpg';

const backgroundImage = {
  img: bgTest,
  x: 0,
  speed: -1,

  move() {
    this.x += this.speed;
    this.x %= canvasGame.canvas.width;
  },

  draw() {
    canvasGame.ctx.drawImage(this.img, this.x, 0);
    if (this.speed < 0) {
      canvasGame.ctx.drawImage(this.img, this.x + canvasGame.canvas.width, 0);
    } else {
      canvasGame.ctx.drawImage(this.img, this.x - this.img.width, 0);
    }
  },
};


let attackPattern = new Image();
attackPattern.src = 'images/attack-pattern1.png';

// change to player js archive

class Player {
  constructor(x, y, health, dmg) {
    this.x = x;
    this.y = y;
    this.vx = 1;
    this.speedX = 0;
    this.health = health;
    this.dmg = dmg;
    this.width = 29;
    this.height = 31;
    this.tickCount = 0;
    this.frames = 0;
    this.scaleWidth = this.width * 2;
    this.scaleHeight = this.height * 2;
    this.right = true;
    this.left = false;
    this.down = false;
    this.attack = false;
    this.gunReload = true;
    this.damageInterval = false;
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
      const characterDown = new Image();
      characterDown.src = 'images/knee.png';
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
      const downLeft = new Image();
      downLeft.src = 'images/knee-left.png';
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
      const attackImgLeft = new Image();
      attackImgLeft.src = 'images/attack-position-left.png';
      this.characterAnimation(attackImgLeft);
    } else if (this.right === true && this.attack === true) {
      const attackImg = new Image();
      attackImg.src = 'images/attack-position.png';
      this.characterAnimation(attackImg);
    } else if (this.left === true) {
      const characterLeft = new Image();
      characterLeft.src = 'images/left-side.png';
      this.characterAnimation(characterLeft);
    } else if (this.right === true) {
      const characterRight = new Image();
      characterRight.src = 'images/right-side.png';

      this.characterAnimation(characterRight);
    }
  }

  // update the movement and enforce boundarie to the left
  update() {
    if (this.x + this.speedX <= 0) { this.x -= this.speedX; }

    this.x += this.speedX;
    if (this.tickCount >= 3) {
      this.tickCount = 0;
      this.frames += 1;
    }
    if (this.frames >= 5) {
      this.frames = 0;
    }
  }

  receiveDamage() {
    console.log(this.health);
    if (this.checkGameOver()) {
      canvasGame.stop();
    }

    if (!this.damageInterval) {
      this.health = this.health - 25;
      this.x -= 1;
      this.damageInterval = true;
      setTimeout(() => this.damageInterval = false, 300);
    }
  }

  checkGameOver() {
    return (this.health <= 0);
  }

  playerPositionRight() {
    return this.x + this.width;
  }

  playerPositionLeft() {
    return this.x;
  }

  crashWith(enemies) {
    return !(this.playerPositionRight() < enemies.playerPositionLeft()
      || this.playerPositionLeft() > enemies.playerPositionRight());
  }
}

// should be created with the game start function
let player = new Player(50, 300, 100, 50);


// should move to enemy javascript archive;
let enemies = [];

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.health = 100;
    this.dmg = 25;
    this.width = 20;
    this.height = 20;
  }

  updateEnemy() {
    canvasGame.ctx.fillStyle = 'red';
    canvasGame.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  takeDamage() {
    this.health -= 25;
    this.x += 10;
  }

  playerPositionRight() {
    return this.x;
  }

  playerPositionLeft() {
    return this.x - this.width;
  }

  crashWith(shot) {
    return !(this.playerPositionRight() < shot.shotPositionLeft()
      || this.playerPositionLeft() > shot.shotPositionRight());
  }
}

// will need to update to check the damage of the obstacle
function updateEnemies() {
  enemies.forEach((enemy, idx) => {
    if (enemy.health <= 0) {
      enemies.splice(idx, 1);
    }
  });

  for (let i = 0; i < enemies.length; i += 1) {
    if (enemies[i].x < player.x) {
      enemies[i].x += 1;
    } else if (enemies[i].x > player.x) {
      enemies[i].x -= 1;
    }
    enemies[i].updateEnemy();
  }

  canvasGame.frames += 1;
  if (enemies.length < canvasGame.maxEnemies) {
    if (canvasGame.frames % 250 === 0) {
      enemies.push(new Enemy(900, 300));
    }
  }
}

function checkGameOver() {
  const crashed = enemies.some(dmg => player.crashWith(dmg));

  if (crashed) {
    player.receiveDamage();
  }
}

let laserArr = [];

function checkCrash() {
  enemies.forEach((item) => {
    const test = laserArr.some((dmg, idx) => {
      if (item.crashWith(dmg)) {
        laserArr.splice(idx, 1);
        return item.crashWith(dmg);
      }
    });
    if (test) {
      item.takeDamage();
    }
  });
}

class Shot {
  constructor(side) {
    this.x = player.x + 65;
    this.y = player.y + 25;
    this.trajectorie = side;
    this.charge = 1;
  }

  update() {
    if (this.trajectorie === true) {
      canvasGame.ctx.beginPath();
      canvasGame.ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
      canvasGame.ctx.fill();
    } else {
      canvasGame.ctx.beginPath();
      canvasGame.ctx.arc(this.x - 65, this.y, 5, 0, 2 * Math.PI);
      canvasGame.ctx.fill();
    }
  }

  shotPositionRight() {
    return this.x;
  }

  shotPositionLeft() {
    return this.x;
  }

  montersHit() {
    this.charge -= 1;
  }
}

canvasGame.start();
player.render();

function updateShot() {
  laserArr.forEach((shot, idx) => {
    shot.update();
    if (shot.charge <= 0) {
      laserArr.splice(idx, 1);
    }
    if (shot.trajectorie === true) {
      shot.x += 1;
    } else {
      shot.x -= 1;
    }

    if (shot.x > player.x + 300 || shot.x < player.x - 300) {
      laserArr.splice(idx, 1);
    }
  });
}


function gameLoop() {
  canvasGame.clear();
  player.render();
  player.update();
  updateEnemies();
  checkGameOver();
  updateShot();
  checkCrash();
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
      if (player.gunReload) {
        laserArr.push(new Shot(player.right));
        player.gunReload = false;
        setTimeout(() => player.gunReload = true, 1000);
      }
      break;
  }
};

document.onkeyup = function (e) {
  player.speedX = 0;
  player.frames = 0;
  player.update();
};
