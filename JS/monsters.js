let enemies = [];
let enemiesProjectiles = [];

class Enemy {
  constructor(x, y, directionOfMov, bullet) {
    this.x = x;
    this.y = y;
    this.health = 100;
    this.width = 31;
    this.height = 31;
    this.direction = directionOfMov;
    this.widthScale = this.width * 1.1;
    this.heightScale = this.height * 1.1;
    this.bullet = bullet;
    this.maxShots = 1;
    this.type = 'normal';
    this.reloadShot = true;
  }

  updateEnemy() {
    let monster = new Image();
    if (this.bullet === true && this.direction === 'left') {
      monster.src = './images/monter2.png';
      canvasGame.ctx.drawImage(
        monster,
        this.width * 0,
        0,
        55,
        55,
        this.x,
        this.y,
        55 * 0.8,
        52 * 0.8,
      );
    } else if (this.direction === 'right') {
      monster.src = './images/turtle2.png';
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
      monster.src = './images/turtle1.png';
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

  positionX() {
    return this.x;
  }

  enemyHeight() {
    return this.heightScale;
  }

  positionY() {
    return this.y;
  }

  crashWith(shot) {
    const getDistance = () => {
      const xDistance = (shot.positionX() - this.x);
      const yDistance = (shot.positionY() - this.y);
      return Math.sqrt((xDistance ** 2) + (yDistance ** 2));
    };
    if (getDistance() < this.widthScale || getDistance() < this.scaleHeight) {
      return true;
    }
    return false;
  }
}

class Boss extends Enemy {
  constructor(x, y, directionOfMov, bullet) {
    super(x, y, directionOfMov, bullet);
    this.health = 1000;
    this.width = 55;
    this.height = 57;
    this.frames = 0;
  }

  update() {
    const boss = new Image();
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
  }
}

class EnemyShot {
  constructor(x, y, directionOfMov) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 27;
    this.frames = 0;
    this.shotScale = this.width * 1;
    this.ShotWidth = this.height * 1;
    this.direction = directionOfMov;
  }

  update() {
    this.y += 1;
    const attackPattern = new Image();
    attackPattern.src = './images/monster-attack-pattern.png';
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

function createBullet() {
  enemies.forEach((monster) => {
    const getDistance = () => {
      const xDistance = (monster.positionX() - player.positionX());
      const yDistance = (monster.positionY() - player.positionY());
      return Math.sqrt((xDistance ** 2) + (yDistance ** 2));
    };
    if (monster.bullet === true && getDistance() < monster.y + player.positionY()) {
      if (monster.reloadShot) {
        enemiesProjectiles.push(new EnemyShot(monster.x, monster.y, monster.direction));
        monster.reloadShot = false;
        setTimeout(() => monster.reloadShot = true, 3000);
      }
    }
  });
}


function playerHit() {
  enemiesProjectiles.forEach((dmg, idx) => {
    if (player.crashWith(dmg)) {
      enemiesProjectiles.splice(idx, 1);
    }
  });
}


function updateBullet() {
  enemiesProjectiles.forEach((projectile, idx) => {
    projectile.update();

    if (projectile.y >= 220) {
      enemiesProjectiles.splice(idx, 1);
    }
  });
}

function enemiesMovement() {
  enemies.forEach((enemy, idx) => {
    if (enemy.health <= 0) {
      enemies.splice(idx, 1);
      player.score += 200;
    }
  });


  for (let i = 0; i < enemies.length; i += 1) {
    if (enemies[i].bullet === true) {
      if (enemies[i].x < player.x) {
        enemies[i].x += 0.4;
      } else if (enemies[i].x > player.x) {
        enemies[i].x -= 0.4;
      }
    } else if (enemies[i].bullet === false) {
      if (enemies[i].x < player.x) {
        enemies[i].x += 1;
      } else if (enemies[i].x > player.x) {
        enemies[i].x -= 1;
      }
    }

    enemies[i].updateEnemy();
  }

  if (canvasGame.boss === false && enemies.length < canvasGame.maxEnemies) {
    if (canvasGame.frames % 100 === 0) {
      enemies.push(new Enemy(900, 210, 'right', false));
      enemies.push(new Enemy(-200, 210, 'left', false));
      enemies.push(new Enemy(-200, 130, 'left', true));
    }
  }
}

function checkGameOver() {
  enemies.some(dmg => player.crashWith(dmg));
}

const enemiesUpdate = () => {
  enemiesMovement();
  checkGameOver();
  createBullet();
  updateBullet();
  playerHit();
};
