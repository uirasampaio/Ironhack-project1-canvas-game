const canvasGame = {
  canvasBox: document.getElementById('canvas'),
  canvas: document.createElement('canvas'),
  frames: 0,
  maxEnemies: 1,
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
bgTest.src = './images/super-mario-background-images-5632345.jpg';

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
        shotsArray.push(new BigShot(player.right));
        setTimeout(() => player.chargedShot = false, 1500);
      } else if (player.gunReload) {
        shotsArray.push(new Shot(player.right));
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
    shotsArray = [];
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