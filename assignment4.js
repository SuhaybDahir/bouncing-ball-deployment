document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault());

let gameArea, ball, walls = [], score = 0, gameInterval = null, ballSpeedY = 0;
const wallWidth = 20, wallGapHeight = 100, initialWallGap = 200, ballRadius = 10;
let wallGap = initialWallGap, wallSpeed = 2;

document.addEventListener("DOMContentLoaded", () => {
  gameArea = document.getElementById('gameArea');
  const windowArea = document.getElementById('interactionWindow');

  // Desktop: W key
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'w') ballSpeedY = -3;
  });
  document.addEventListener('keyup', e => {
    if (e.key.toLowerCase() === 'w') ballSpeedY = 3;
  });

  // ✅ Pointer (works on all phones)
  const startFly = e => { e.preventDefault(); ballSpeedY = -3; };
  const stopFly  = e => { e.preventDefault(); ballSpeedY = 3; };

  windowArea.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (!gameInterval) startGame();
    startFly(e);
  });
  windowArea.addEventListener('pointerup', stopFly);
  windowArea.addEventListener('pointercancel', stopFly);
  windowArea.addEventListener('pointerleave', stopFly);
});

function startGame() {
  resetGame();

  const iw = document.getElementById('interactionWindow');
  iw.style.opacity = '0';
  iw.style.pointerEvents = 'none';
  iw.querySelector('p').textContent = ''; // hide tap message during play

  gameInterval = setInterval(updateGame, 20);
}

function resetGame() {
  while (gameArea.firstChild) gameArea.removeChild(gameArea.firstChild);
  ball = createBall();
  gameArea.appendChild(ball);
  walls = [];
  score = 0;
  wallGap = initialWallGap;
  wallSpeed = 2;
  updateScore();
}

function createBall() {
  const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("cx", "50");
  c.setAttribute("cy", "200");
  c.setAttribute("r", ballRadius);
  c.setAttribute("fill", "red");
  return c;
}

let isDay = true;
let lastToggleScore = 0;

function updateGame() {
  moveBall();
  generateWalls();
  moveWalls();
  checkCollisions();
  updateScore();
  increaseDifficulty();
  toggleBackground();
}

function toggleBackground() {
  const wrap = document.getElementById('gameWrapper');
  if (score >= lastToggleScore + 20) {
    lastToggleScore = score;
    isDay = !isDay;
    wrap.style.backgroundImage = isDay
      ? "url('backgroundDay.png')"
      : "url('backgroundNight.png')";
  }
}

function moveBall() {
  let y = ball.cy.baseVal.value + ballSpeedY;
  if (y < ballRadius) y = ballRadius;
  if (y > 400 - ballRadius) y = 400 - ballRadius;
  ball.setAttribute("cy", y);
}

function generateWalls() {
  if (!walls.length || walls[walls.length - 1].topWall.x.baseVal.value < wallGap) {
    const gapY = Math.random() * (300 - wallGapHeight) + 50;
    createWallPair(gapY);
  }
}

function createWallPair(gapY) {
  const topH = gapY, bottomH = 400 - gapY - wallGapHeight;
  const top = createWall(500, 0, topH);
  const bottom = createWall(500, gapY + wallGapHeight, bottomH);
  walls.push({ topWall: top, bottomWall: bottom });
}

function createWall(x, y, h) {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  r.setAttribute("x", x);
  r.setAttribute("y", y);
  r.setAttribute("width", wallWidth);
  r.setAttribute("height", h);
  r.setAttribute("fill", "green");
  gameArea.appendChild(r);
  return r;
}

function moveWalls() {
  for (let i = 0; i < walls.length; i++) {
    const w = walls[i];
    w.topWall.setAttribute("x", w.topWall.x.baseVal.value - wallSpeed);
    w.bottomWall.setAttribute("x", w.bottomWall.x.baseVal.value - wallSpeed);
    if (w.topWall.x.baseVal.value < -wallWidth) {
      gameArea.removeChild(w.topWall);
      gameArea.removeChild(w.bottomWall);
      walls.splice(i, 1);
      i--;
      score++;
    }
  }
}

function checkCollisions() {
  const bx = ball.cx.baseVal.value, by = ball.cy.baseVal.value;
  for (const w of walls) {
    if (hit(w.topWall,bx,by) || hit(w.bottomWall,bx,by)) {
      clearInterval(gameInterval);
      gameInterval = null;

      const iw = document.getElementById('interactionWindow');
      iw.style.opacity = '1';
      iw.style.pointerEvents = 'auto';
      iw.querySelector('p').textContent = '🎮 Tap here to play again';

      alert("Game Over! Score: " + score);
      resetGame();
      break;
    }
  }
}

function hit(w, bx, by) {
  const wx = w.x.baseVal.value, wy = w.y.baseVal.value;
  return bx + ballRadius > wx && bx - ballRadius < wx + wallWidth &&
         by + ballRadius > wy && by - ballRadius < wy + w.height.baseVal.value;
}

function increaseDifficulty() {
  if (score % 10 === 0 && score !== 0) {
    wallGap -= 10;
    wallSpeed += 1;
    score++;
  }
}

function updateScore() {
  document.getElementById('score').innerText = score;
}
