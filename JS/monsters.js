let enemies = [];

class Enemy {
  constructor(x, y, directionOfMov) {
    this.x = x;
    this.y = y;
    this.health = 100;
    this.width = 55;
    this.height = 57;
    this.direction = directionOfMov;
    this.widthScale = this.width * 0.8;
    this.heightScale = this.height * 0.8;
  }

  updateEnemy() {
    let monster = new Image();
    if (this.direction === 'right') {
      monster.src = './images/monter1.png';
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
      monster.src = './images/monter2.png';
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

  takeDamage(dmgOutput) {
    if (this.direction === 'right') {
      this.health -= 25 * dmgOutput;
      this.x += 20;
    } else if (this.direction === 'left') {
      this.health -= 25 * dmgOutput;
      this.x -= 20;
    }
  }

  enemyPositionRight() {
    return this.x;
  }

  enemyHeight() {
    return this.height;
  }

  enemyPositionY() {
    return this.y;
  }

  crashWith(shot) {
    const getDistance = () => {
      const xDistance = (shot.shotPositionX() - this.x);
      const yDistance = (shot.shotPositionY() - this.y);
      return Math.sqrt((xDistance ** 2) + (yDistance ** 2));
    };
    if (getDistance() < this.widthScale || getDistance() < this.scaleHeight) {
      return true;
    }
    return false;
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
      enemies.push(new Enemy(-100, 200, 'left'));
    }
  }
}

function checkGameOver() {
  enemies.some(dmg => player.crashWith(dmg));
}