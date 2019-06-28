const canvasGame = {
  canvasBox: document.getElementById('canvas'),
  canvas: document.createElement('canvas'),
  frames: 0,
  maxEnemies: 2,
  pause: false,
  boss: false,
  backgroundMusic: new SoundFactory('./sounds/Mega-Man-X-(SNES)-Music-Spark-Mandrill.mp3'),
  start() {
    this.canvas.width = 600;
    this.canvas.height = 300;
    this.ctx = this.canvas.getContext('2d');
    canvas.insertBefore(this.canvas, this.canvasBox.childNodes[0]);
    interval = setInterval(gameLoop, 20);
    this.backgroundMusic.play();
  },
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop() {
    clearInterval(interval);
    this.backgroundMusic.stop();
  },
};

let bgTest = new Image();
bgTest.src = './images/super-mario-background-images-5632345.jpg';

const backgroundImage = {
  img: bgTest,
  x: 0,
  speed: 0,

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
function updateMap() {
  canvasGame.frames += 1;
  if (canvasGame.frames > 800 && canvasGame.frames < 1200) {
    backgroundImage.speed = -0.5;
  } else if (canvasGame.frames >= 2200) {
    backgroundImage.speed = 0;
  }
}

function gameLoop() {
  canvasGame.clear();
  backgroundImage.draw();
  backgroundImage.move();
  player.render();
  player.update();
  enemiesUpdate();
  playerElements();
  updateMap();
}


document.onkeydown = function coder(e) {
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
        player.jumping = true;
        if (player.right) {
          player.x += player.vx;
          player.tickCount += 1;
          player.right = true;
          player.left = false;
          player.down = false;
          player.attack = false
        }
      }
      break;
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
        const mySound = new SoundFactory('./sounds/buster-shot.mp3')
        mySound.play();
        shotsArray.push(new BigShot(player.right));
        setTimeout(() => player.chargedShot = false, 1500);
      } else if (player.gunReload) {
        const mySound = new SoundFactory('./sounds/mega-man-2-SFX-(shot).wav');
        mySound.play();
        shotsArray.push(new Shot(player.right));
        player.gunReload = false;
        setTimeout(() => player.gunReload = true, 800);
        player.charge += 1;
      }
      break;
    case 13: // pause;
      if (canvasGame.pause === false) {
        canvasGame.stop();
        canvasGame.pause = true;
      } else {
        canvasGame.start();
        canvasGame.pause = false;
      }
      break;
    default:
  }
};

document.onkeyup = function ofCoder(e) {
  player.speedX = 0;
  player.frames = 0;
  player.update();
};
// start game
const controls = document.querySelector('.controls');
const btn = document.querySelector('#primary');
const gameStart = document.querySelector('.initial');
btn.addEventListener('click', () => {
  canvasGame.start();
  player.render();
  gameStart.setAttribute("style", "display: none");
  controls.setAttribute("style", "display: flex");
}, true);


const modalRestart = document.querySelector('#myModal');
const resetBtn = document.querySelector('.reset');
canvasGame.canvasBox.innerHTML = '';
resetBtn.addEventListener('click', () => {
  modalRestart.setAttribute('style', 'display: none');
  canvasGame.boss = false;
  canvasGame.start();
  player.render();
  enemies = [];
  enemiesProjectiles = [];
  player = new Player(50, 202, 100, 50);
  shotsArray = [];
  canvasGame.frames = 0;
}, true);


const restart = () => {
  canvasGame.stop();
  canvasGame.clear();
  const modalRestart = document.querySelector('#myModal');
  const modaltext = document.querySelector('.modal-text');
  modaltext.textContent = `your score is: ${player.score}`;
  modalRestart.setAttribute("style", "display: flex");
};

const stageClear = () => {
  const resetBtn = document.querySelector('.reset');
  const img = document.querySelector('#game-over-img');
  img.setAttribute('src', './images/stage-clear.png');
  resetBtn.textContent = 'Next Stage';
  canvasGame.canvasBox.innerHTML = '';
};
