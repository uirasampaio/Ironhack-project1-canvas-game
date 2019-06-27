let enemies = [];
let bossArr = [];
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
    this.x = x;
    this.y = y;
    this.vx = 2;
    this.health = 1000;
    this.width = 140;
    this.height = 143;
    this.direction = directionOfMov;
    this.widthScale = this.width * 1.1;
    this.heightScale = this.height * 1.1;
    this.bullet = bullet;
    this.maxShots = 1;
    this.type = 'normal';
    this.reloadShot = true;
    this.moveUpCooldown = false;
    this.attackOneCooldown = false;
  }

  takeDamage(dmgOutput) {
    this.health -= 25 * dmgOutput;
    const dmgImg = new Image();
    dmgImg.src = './images/visual-dmg.png';

    canvasGame.ctx.drawImage(
      dmgImg,
      this.width * 0,
      0,
      this.width,
      this.height,
      this.x - 10,
      this.y - 20,
      this.width * 3,
      this.height * 3,
    );
  }

  updateEnemy() {
    canvasGame.ctx.beginPath();
    canvasGame.ctx.fillStyle = 'black';
    canvasGame.ctx.arc(this.x, this.y, 50, 0, 2 * Math.PI);
    canvasGame.ctx.fill();
  }

  positionX() {
    return this.x;
  }

  attackOne() {
    if (this.attackOneCooldown === true) return;

    if (darkBullet.x > 100) {
      this.x -= this.vx;
    }
  }

  attackReturn() {
    if (darkBullet.x < 530) {
      this.x += this.vx;
    }
  }

  crashWith(shot) {
    const getDistance = () => {
      const xDistance = (shot.positionX() - this.x);
      const yDistance = (shot.positionY() - this.y);
      return Math.sqrt((xDistance ** 2) + (yDistance ** 2));
    };
    if (getDistance() < this.width || getDistance() < this.scaleHeight) {
      return true;
    }
    return false;
  }
}

let darkBullet = new Boss(650, 200, 'right', true);

const controlBoss = () => {
  if (canvasGame.boss === false) return;
  darkBullet.updateEnemy();
  bossArr.push(darkBullet);
  if (darkBullet.health > 750) {
    if (darkBullet.attackOneCooldown === false) {
      darkBullet.attackOne();
      setTimeout(() => darkBullet.attackOneCooldown = true, 4000);
    } else if (darkBullet.attackOneCooldown === true) {
      darkBullet.attackReturn();
      setTimeout(() => darkBullet.attackOneCooldown = false, 7000);
    }
  }
};

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

  if (player.score >= 2000) {
    setTimeout(() => canvasGame.boss === true, 1500);

  } else if (canvasGame.boss === false && enemies.length < canvasGame.maxEnemies) {
    if (canvasGame.frames % 300 === 0) {
      /* enemies.push(new Enemy(900, 210, 'right', false));
       enemies.push(new Enemy(-200, 210, 'left', false));
       enemies.push(new Enemy(-200, 130, 'left', true)); */
    }
  }
}

function checkGameOver() {
  enemies.some(dmg => player.crashWith(dmg));
  bossArr.some(dmg => player.crashWith(dmg));
}


const enemiesUpdate = () => {
  enemiesMovement();
  checkGameOver();
  createBullet();
  updateBullet();
  playerHit();
  controlBoss();
};
