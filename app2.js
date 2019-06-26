// main Canvas star and stop functions

const canvasGame = {
  canvasBox: document.getElementById('canvas'),
  canvas: document.createElement('canvas'),
  frames: 0,
  maxEnemies: 3,
  pause: false,
  start() {
    this.canvas.width = 600;
    this.canvas.height = 300;
    this.ctx = this.canvas.getContext('2d');
    canvas.insertBefore(this.canvas, this.canvasBox.childNodes[0]);
    interval = setInterval(gameLoop, 20);
  },
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop() {
    clearInterval(interval);
  },
};

let bgTest = new Image();
bgTest.src = 'images/super-mario-background-images-5632345.jpg';

const backgroundImage = {
  img: bgTest,
  x: 0,
  speed: -0.5,

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


// change to player js archive

class Player {
  constructor(x, y, health, dmg) {
    this.x = x;
    this.y = y;
    this.vx = 3;
    this.health = health;
    this.dmg = dmg;
    this.width = 28;
    this.height = 27;
    this.tickCount = 0;
    this.frames = 0;
    this.scaleWidth = this.width * 1.5;
    this.scaleHeight = this.height * 1.5;
    this.right = true;
    this.left = false;
    this.down = false;
    this.attack = false;
    this.gunReload = true;
    this.damageInterval = false;
    this.jumping = false;
    this.vy = 0;
    this.score = 0;
    this.chargedShot = false;
    this.charge = 0;
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
    canvasGame.ctx.beginPath();
    canvasGame.ctx.fillStyle = '#d3c3c3';
    canvasGame.ctx.rect(20, 30, 140, 12);
    canvasGame.ctx.fill();
    canvasGame.ctx.closePath();

    canvasGame.ctx.beginPath();
    canvasGame.ctx.strokeStyle = 'black';
    canvasGame.ctx.rect(20, 30, 140, 12);
    canvasGame.ctx.stroke();
    canvasGame.ctx.closePath();

    if (this.chargedShot === false) {
      canvasGame.ctx.beginPath();
      canvasGame.ctx.strokeStyle = 'black';
      canvasGame.ctx.rect(24, 32, this.charge * 33, 6);
      canvasGame.ctx.stroke();
      canvasGame.ctx.fillStyle = 'blue';
      canvasGame.ctx.rect(24, 32, this.charge * 33, 5);
      canvasGame.ctx.fill();
      canvasGame.ctx.closePath();
    } else {
      canvasGame.ctx.save();
      canvasGame.ctx.beginPath();
      canvasGame.ctx.shadowColor = 'lightblue';
      canvasGame.ctx.shadowOffsetX = 0;
      canvasGame.ctx.shadowOffsetY = 0;
      canvasGame.ctx.shadowBlur = 15;
      canvasGame.ctx.fillStyle = 'blue';
      canvasGame.ctx.rect(24, 32, 4 * 33, 8);
      canvasGame.ctx.fill();
      canvasGame.ctx.closePath();
      canvasGame.ctx.restore();
    }

    canvasGame.ctx.beginPath();
    canvasGame.ctx.fillStyle = '#d3c3c3';
    canvasGame.ctx.rect(5, 5, 140, 24);
    canvasGame.ctx.fill();
    canvasGame.ctx.closePath();

    canvasGame.ctx.beginPath();
    canvasGame.ctx.strokeStyle = 'black';
    canvasGame.ctx.rect(5, 5, 140, 25);
    canvasGame.ctx.rect(20, 9, 100 * 1.2 + 2, 17);
    canvasGame.ctx.stroke();
    canvasGame.ctx.closePath();

    if (this.health >= 30) {
      canvasGame.ctx.beginPath();
      canvasGame.ctx.fillStyle = 'darkgreen';
      canvasGame.ctx.rect(20, 9, this.health * 1.2 + 1, 16);
      canvasGame.ctx.fill();
      canvasGame.ctx.closePath();
    } else {
      canvasGame.ctx.save();
      canvasGame.ctx.beginPath();
      canvasGame.ctx.shadowColor = 'red';
      canvasGame.ctx.shadowOffsetX = 0;
      canvasGame.ctx.shadowOffsetY = 0;
      canvasGame.ctx.shadowBlur = 15;
      canvasGame.ctx.fillStyle = 'red';
      canvasGame.ctx.rect(20, 9, this.health * 1.2 + 1, 16);
      canvasGame.ctx.fill();
      canvasGame.ctx.closePath();
      canvasGame.ctx.restore();
    }

    canvasGame.ctx.beginPath();
    canvasGame.ctx.font = 'bold 18px Verdana';
    canvasGame.ctx.fillStyle = 'black';
    canvasGame.ctx.fillText(`Score:${this.score}`, 460, 25);
    canvasGame.ctx.fill();
    canvasGame.ctx.closePath();

    canvasGame.ctx.beginPath();
    canvasGame.ctx.fillStyle = 'white';
    canvasGame.ctx.font = 'italic bold 26px Verdana';
    canvasGame.ctx.fillText('X', 10, 26);
    canvasGame.ctx.font = 'italic bold 14px Verdana';
    canvasGame.ctx.fillText('Alpha Game Footage', 420, 290);
    canvasGame.ctx.font = 'italic bold 27px Verdana';
    canvasGame.ctx.strokeStyle = 'black';
    canvasGame.ctx.strokeText('X', 10, 26);
    canvasGame.ctx.closePath();

    if (this.jumping === true && this.right === true) {
      const jumping = new Image();
      jumping.src = 'images/jumping.png';
      this.characterAnimation(jumping);
    } else if (this.jumping === true && this.left === true) {
      const jumping2 = new Image();
      jumping2.src = 'images/jumping2.png';
      this.characterAnimation(jumping2);
    } else if (this.right === true && this.down === true) {
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
    if (this.charge >= 4) {
      this.chargedShot = true;
      this.charge = 0;
    } else if (this.chargedShot === true) {
      this.charge = 0;
    }

    this.vy += 1;
    this.y += this.vy;
    this.vy *= 0.9;
    if (this.y > 202) {
      this.jumping = false;
      this.y = 202;
      this.vy = 0;
    }
    if (this.x + this.vx <= 0) { this.x += this.vx; }

    if (this.tickCount >= 3) {
      this.tickCount = 0;
      this.frames += 1;
    }
    if (this.frames >= 5) {
      this.frames = 0;
    }
  }

  receiveDamage() {
    const damage = new Image();
    damage.src = 'images/damage.png';
    if (this.checkGameOver()) {
      restart();
    }

    if (!this.damageInterval) {
      this.x -= 30;
      this.health = this.health - 25;
      this.x -= 1;
      this.damageInterval = true;
      setTimeout(() => this.damageInterval = false, 800);
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

  playerPositionY() {
    return this.y + this.height;
  }

  crashWith(enemies) {
    return !(this.playerPositionRight() < enemies.playerPositionLeft()
      || this.playerPositionLeft() > enemies.playerPositionRight());
  }
}

// should be created with the game start function

// should move to enemy javascript archive;
let enemies = [];

class Enemy {
  constructor(x, y, directionOfMov) {
    this.x = x;
    this.y = y;
    this.health = 100;
    this.dmg = 25;
    this.width = 55;
    this.height = 57;
    this.direction = directionOfMov;
    this.widthScale = this.width * 0.8;
    this.heightScale = this.height * 0.8;
  }

  updateEnemy() {
    let monster = new Image();
    if (this.direction === 'right') {
      monster.src = 'images/monter1.png';
      canvasGame.ctx.drawImage(
        monster,
        this.width * 0,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.widthScale,
        this.heightScale,
      );
    } else {
      monster.src = 'images/monter2.png';
      if (this.direction === 'right') {
        monster.src = 'images/monter1.png';
        canvasGame.ctx.drawImage(
          monster,
          this.width * 0,
          0,
          this.width,
          this.height,
          this.x,
          this.y,
          this.widthScale,
          this.heightScale,
        );
      }
    }
  }

  takeDamage(dmgOutput) {
    if (this.direction === 'right') {
      this.health -= 25 * dmgOutput;
      this.x += 10;
    } else {
      this.health -= 25 * dmgOutput;
      this.x -= 10;
    }
  }

  playerPositionRight() {
    return this.x;
  }

  playerPositionLeft() {
    return this.x - this.width;
  }

  playerPositionY() {
    return this.y + this.height;
  }

  crashWith(shot) {
    return !(this.playerPositionRight() < shot.shotPositionLeft()
      || this.playerPositionLeft() > shot.shotPositionRight());
  }
}

class Boss extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.health = 100;
    this.dmg = 25;
    this.width = 55;
    this.height = 57;
    this.frames = 0;
  }
}

// will need to update to check the damage of the obstacle
function updateEnemies() {
  enemies.forEach((enemy, idx) => {
    if (enemy.health <= 0) {
      enemies.splice(idx, 1);
      player.score += 200;
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
  if (canvasGame.frames >= 1400) {
    backgroundImage.speed = 0;
  } else if (enemies.length < canvasGame.maxEnemies) {
    if (canvasGame.frames % 250 === 0) {
      enemies.push(new Enemy(900, 200, 'right'));
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
    laserArr.some((dmg, idx) => {
      if (item.crashWith(dmg)) {
        item.takeDamage(laserArr[idx].charge);
        laserArr.splice(idx, 1);
      }
    });
  });
}

class Shot {
  constructor(side) {
    this.x = player.x + 54;
    this.y = player.y + 3;
    this.trajectorie = side;
    this.charge = 1;
    this.width = 32;
    this.height = 27;
    this.frames = 0;
    this.shotScale = this.width * 1;
    this.ShotWidth = this.height * 1;
  }

  update() {
    const attackPattern = new Image();
    if (this.trajectorie === true) {
      attackPattern.src = 'images/hadouken.png';
      canvasGame.ctx.drawImage(
        attackPattern,
        this.width * this.frames,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.shotScale,
        this.ShotWidth,
      );
    } else {
      attackPattern.src = 'images/hadouken-left.png';
      canvasGame.ctx.drawImage(
        attackPattern,
        this.width * this.frames,
        0,
        this.width,
        this.height,
        this.x - 64,
        this.y,
        this.shotScale,
        this.ShotWidth,
      );
    }

    if (this.frames >= 3) {
      this.frames = 0;
    }
  }

  shotPositionRight() {
    return this.x;
  }

  shotPositionLeft() {
    return this.x;
  }

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
}

class BigShot extends Shot {
  constructor(side) {
    super(side)
    this.x = player.x + 54;
    this.y = player.y - 25;
    this.trajectorie = side;
    this.charge = 4;
    this.width = 32;
    this.height = 27;
    this.frames = 0;
    this.shotScale = this.width * 3;
    this.ShotWidth = this.height * 3;
  }
}

function updateShot() {
  laserArr.forEach((shot, idx) => {
    shot.update();
    shot.frames += 1;
    if (shot.charge <= 0) {
      laserArr.splice(idx, 1);
    }
    if (shot.trajectorie === true) {
      shot.x += 4;
    } else {
      shot.x -= 4;
    }

    if (shot.x > player.x + 300 || shot.x < player.x - 300) {
      laserArr.splice(idx, 1);
    }
  });
}


function gameLoop() {
  canvasGame.clear();
  backgroundImage.draw();
  backgroundImage.move();
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
      player.x -= player.vx;
      player.left = true;
      player.right = false;
      player.down = false;
      player.attack = false;
      break;
    case 38: // up arrow - jump
      if (!player.jumping) {
        player.vy = -20;
        player.x += player.vx;
        player.jumping = true;
      }
    case 39: // right arrow
      player.x += player.vx;
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
      if (player.chargedShot && player.gunReload) {
        player.chargedShot = false;
        laserArr.push(new BigShot(player.right));
        setTimeout(() => player.chargedShot = false, 1500);
      } else if (player.gunReload) {
        laserArr.push(new Shot(player.right));
        player.gunReload = false;
        setTimeout(() => player.gunReload = true, 800);
        player.charge += 1;
      }
      break;
    case 13: // pause;
      if (canvasGame.pause === false) {
        canvasGame.stop();
        canvasGame.pause = true
      } else {
        canvasGame.start();
        canvasGame.pause = false;
      }
  }
};

document.onkeyup = function (e) {
  player.speedX = 0;
  player.frames = 0;
  player.update();
};

let player = new Player(50, 202, 100, 50);

// will start the game
const btn = document.querySelector('#primary');
const gameStart = document.querySelector('.initial');
btn.addEventListener('click', () => {
  canvasGame.start();
  player.render();
  gameStart.setAttribute("style", "display: none");
}, true);

(function reset() {
  const modalRestart = document.querySelector('#myModal');
  const resetBtn = document.querySelector('.reset');
  canvasGame.canvasBox.innerHTML = '';
  resetBtn.addEventListener('click', () => {
    modalRestart.setAttribute('style', 'display: none');
    canvasGame.start();
    player.render();
    enemies = [];
    player = new Player(50, 202, 100, 50);
    laserArr = [];
  }, true);
}());

const restart = () => {
  canvasGame.stop();
  canvasGame.clear();
  const modalRestart = document.querySelector('#myModal');
  const modaltext = document.querySelector('.modal-text');
  modaltext.textContent = `your score is: ${player.score}`;
  modalRestart.setAttribute("style", "display: flex");
};
