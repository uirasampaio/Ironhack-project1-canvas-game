let damageSound = new SoundFactory('./sounds/mega-man-dmg.wav');

class Player {
  constructor(x, y, health, dmg) {
    this.x = x;
    this.y = y;
    this.vx = 4;
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

  // draw the player based on his position, draw the hp and shot bar
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
      canvasGame.ctx.shadowColor = 'yellow';
      canvasGame.ctx.shadowOffsetX = 0;
      canvasGame.ctx.shadowOffsetY = 0;
      canvasGame.ctx.shadowBlur = 15;
      canvasGame.ctx.fillStyle = 'rgb(30,107,206)';
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
    canvasGame.ctx.rect(20, 9, 100 * 1.20, 17);
    canvasGame.ctx.stroke();
    canvasGame.ctx.closePath();

    if (this.health >= 30) {
      canvasGame.ctx.beginPath();
      canvasGame.ctx.fillStyle = 'darkgreen';
      canvasGame.ctx.rect(20, 9, this.health * 1.20, 16);
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
      canvasGame.ctx.rect(20, 9, this.health * 1.20, 16);
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

    if (this.jumping === true) {
      const jumping = new Image();
      jumping.src = './images/jumping.png';
      this.characterAnimation(jumping);
    } else if (this.right === true && this.down === true) {
      const characterDown = new Image();
      characterDown.src = './images/knee.png';
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
      downLeft.src = './images/knee-left.png';
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
      attackImgLeft.src = './images/attack-position-left.png';
      this.characterAnimation(attackImgLeft);
    } else if (this.right === true && this.attack === true) {
      const attackImg = new Image();
      attackImg.src = './images/attack-position.png';
      this.characterAnimation(attackImg);
    } else if (this.left === true) {
      const characterLeft = new Image();
      characterLeft.src = './images/left-side.png';
      this.characterAnimation(characterLeft);
    } else if (this.right === true) {
      const characterRight = new Image();
      characterRight.src = './images/right-side.png';
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

  receiveDamage(dmgTrajectory) {
    if (this.checkGameOver()) {
      restart();
    }

    if (!this.damageInterval) {
      damageSound.play();
      if (dmgTrajectory === 'right') {
        this.x -= 30;
        this.health = this.health - 25;
        this.damageInterval = true;
        setTimeout(() => this.damageInterval = false, 1200);
      } else if (dmgTrajectory === 'left') {
        this.x += 30;
        this.health = this.health - 25;
        this.damageInterval = true;
        setTimeout(() => this.damageInterval = false, 1200);
      }
    }
  }

  checkGameOver() {
    return (this.health <= 0);
  }

  positionX() {
    return this.x;
  }

  positionY() {
    return this.scaleHeight;
  }

  crashWith(enemies) {
    const getDistance = () => {
      let xDistance = (enemies.positionX() - this.x);
      let yDistance = (enemies.positionY() - this.y);
      return Math.sqrt((xDistance ** 2) + (yDistance ** 2));
    };

    if (getDistance() < this.scaleWidth || getDistance() < this.scaleHeight) {
      this.receiveDamage(enemies.direction);
      return true;
    }
    return false;
  }

  crashWithBoss(boss) {
    const getDistance = () => {
      let xDistance = (boss.positionX() - this.x);
      let yDistance = (boss.positionY() - this.y);
      return Math.sqrt((xDistance ** 2) + (yDistance ** 2));
    };
    if (getDistance() < this.scaleWidth || getDistance() < this.scaleHeight) {
      this.receiveDamage(boss.direction);
      return true;
    }
    return false;
  }
}

let player = new Player(50, 202, 100, 50);

let shotsArray = [];

function checkCrash() {
  enemies.forEach((item) => {
    shotsArray.some((dmg, idx) => {
      if (item.crashWith(dmg)) {
        item.takeDamage(shotsArray[idx].charge);
        shotsArray.splice(idx, 1);
      }
    });
  });
}

function checkBossCrash() {
  shotsArray.forEach((dmg, idx) => {
    if (eggMan.crashWith(dmg)) {
      eggMan.takeDamage(shotsArray[idx].charge);
      shotsArray.splice(idx, 1);
    }
  });
}

class Shot {
  constructor(side) {
    this.x = player.x;
    this.y = player.y;
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
      attackPattern.src = './images/hadouken.png';
      canvasGame.ctx.drawImage(
        attackPattern,
        this.width * this.frames,
        0,
        this.width,
        this.height,
        this.x + 20,
        this.y + 5,
        this.shotScale,
        this.ShotWidth,
      );
    } else {
      attackPattern.src = './images/hadouken-left.png';
      canvasGame.ctx.drawImage(
        attackPattern,
        this.width * this.frames,
        0,
        this.width,
        this.height,
        this.x,
        this.y + 5,
        this.shotScale,
        this.ShotWidth,
      );
    }

    if (this.frames >= 3) {
      this.frames = 0;
    }
  }

  positionX() {
    return this.x;
  }

  shotWidth() {
    return this.width;
  }

  positionY() {
    return this.y;
  }
}

class BigShot extends Shot {
  constructor(side) {
    super(side);
    this.x = player.x;
    this.y = player.y;
    this.trajectorie = side;
    this.charge = 4;
    this.width = 32;
    this.height = 27;
    this.frames = 0;
    this.shotScale = this.width * 3;
    this.ShotWidth = this.height * 3;
  }

  update() {
    const attackPattern = new Image();
    if (this.trajectorie === true) {
      attackPattern.src = './images/hadouken.png';
      canvasGame.ctx.drawImage(
        attackPattern,
        this.width * this.frames,
        0,
        this.width,
        this.height,
        this.x + 20,
        this.y - 28,
        this.shotScale,
        this.ShotWidth,
      );
    } else {
      attackPattern.src = './images/hadouken-left.png';
      canvasGame.ctx.drawImage(
        attackPattern,
        this.width * this.frames,
        0,
        this.width,
        this.height,
        this.x - player.scaleWidth,
        this.y - 28,
        this.shotScale,
        this.ShotWidth,
      );
    }

    if (this.frames >= 3) {
      this.frames = 0;
    }
  }
}

function updateShot() {
  shotsArray.forEach((shot, idx) => {
    shot.update();
    shot.frames += 1;
    if (shot.trajectorie === true) {
      shot.x += 4;
    } else {
      shot.x -= 4;
    }

    if (shot.x > player.x + 300 || shot.x < player.x - 300) {
      shotsArray.splice(idx, 1);
    }
  });
}

const playerElements = () => {
  updateShot();
  checkBossCrash();
  checkCrash();
};
