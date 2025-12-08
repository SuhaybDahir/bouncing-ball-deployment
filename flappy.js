//  SECURITY HARDENING


// Prevent gesture zoom & accidental double taps
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault());

// Freeze critical configuration values so they can't be changed in console
const CONFIG = Object.freeze({
  ballSpeedUp: -3,
  ballSpeedDown: 3,
  initialWallSpeed: 2,
  initialWallGap: 200,
  wallWidth: 20,
  wallGapHeight: 100,
  ballRadius: 10
});

// Protect score from DevTools manipulation
let _score = 0;
Object.defineProperty(window, "score", {
  get() {
    return _score;
  },
  set() {
    console.warn("Score modification blocked (security).");
  }
});

//  GAME STATE VARIABLES
let gameArea, ball, walls = [];
let ballSpeedY = CONFIG.ballSpeedDown;
let wallGap = CONFIG.initialWallGap;
let wallSpeed = CONFIG.initialWallSpeed;
let gameInterval = null;
let gameActive = false;

//  DOM READY
document.addEventListener("DOMContentLoaded", () => {
  gameArea = document.getElementById('gameArea');
  const windowArea = document.getElementById('interactionWindow');

  // Desktop Controls
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'w') ballSpeedY = CONFIG.ballSpeedUp;
  });
  document.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'w') ballSpeedY = CONFIG.ballSpeedDown;
  });

  //  Pointer Controls 
  const applyPointer = () => {
    if (!gameActive) startGame();
    ballSpeedY = CONFIG.ballSpeedUp;
  };

  windowArea.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    applyPointer();
  });

  windowArea.addEventListener('pointerup', (e) => {
    e.preventDefault();
    ballSpeedY = CONFIG.ballSpeedDown;
  });

  windowArea.addEventListener('pointercancel', (e) => {
    e.preventDefault();
    ballSpeedY = CONFIG.ballSpeedDown;
  });
});


//  START GAME

function startGame() {
  resetGame();
  gameActive = true;

  const iw = document.getElementById('interactionWindow');
  iw.style.opacity = "0";
  iw.style.pointerEvents = "none";
  iw.querySelector('p').textContent = "";

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(updateGameSecure, 20);
}


//  RESET GAME

function resetGame() {
  while (gameArea.firstChild) gameArea.removeChild(gameArea.firstChild);

  ball = createBall();
  gameArea.appendChild(ball);

  walls = [];
  _score = 0;
  wallGap = CONFIG.initialWallGap;
  wallSpeed = CONFIG.initialWallSpeed;

  updateScore();
}


//  CREATE BALL

function createBall() {
  const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("cx", "50");
  c.setAttribute("cy", "200");
  c.setAttribute("r", CONFIG.ballRadius);
  c.setAttribute("fill", "red");
  return c;
}


//  MAIN GAME LOOP (SECURE)

function updateGameSecure() {
  try {
    moveBall();
    generateWalls();
    moveWalls();
    checkCollisions();
    updateScore();
    increaseDifficulty();
    toggleBackground();
  } catch (err) {
    console.error("Game error prevented:", err);
  }
}


//  MOVE BALL

function moveBall() {
  let y = ball.cy.baseVal.value + ballSpeedY;

  if (y < CONFIG.ballRadius) y = CONFIG.ballRadius;
  if (y > 400 - CONFIG.ballRadius) {
    y = 400 - CONFIG.ballRadius;
    ballSpeedY = CONFIG.ballSpeedDown;
  }

  ball.setAttribute("cy", y);
}


//  WALL GENERATION

function generateWalls() {
  if (!walls.length || walls[walls.length - 1].topWall.x.baseVal.value < wallGap) {
    const gapY = Math.random() * (300 - CONFIG.wallGapHeight) + 50;
    createWallPair(gapY);
  }
}

function createWallPair(gapY) {
  const topH = gapY;
  const bottomH = 400 - gapY - CONFIG.wallGapHeight;

  const top = createWall(500, 0, topH);
  const bottom = createWall(500, gapY + CONFIG.wallGapHeight, bottomH);

  walls.push({ topWall: top, bottomWall: bottom });
}

function createWall(x, y, h) {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  r.setAttribute("x", x);
  r.setAttribute("y", y);
  r.setAttribute("width", CONFIG.wallWidth);
  r.setAttribute("height", h);
  r.setAttribute("fill", "green");
  gameArea.appendChild(r);
  return r;
}


//  MOVE WALLS
function moveWalls() {
  for (let i = 0; i < walls.length; i++) {
    const w = walls[i];
    w.topWall.setAttribute("x", w.topWall.x.baseVal.value - wallSpeed);
    w.bottomWall.setAttribute("x", w.bottomWall.x.baseVal.value - wallSpeed);

    if (w.topWall.x.baseVal.value < -CONFIG.wallWidth) {
      gameArea.removeChild(w.topWall);
      gameArea.removeChild(w.bottomWall);
      walls.splice(i, 1);
      i--;
      _score++;
    }
  }
}

//  COLLISION
function checkCollisions() {
  const bx = ball.cx.baseVal.value;
  const by = ball.cy.baseVal.value;

  for (const w of walls) {
    if (hit(w.topWall, bx, by) || hit(w.bottomWall, bx, by)) {
      endGame();
      break;
    }
  }
}

function hit(w, bx, by) {
  const wx = w.x.baseVal.value;
  const wy = w.y.baseVal.value;

  return (
    bx + CONFIG.ballRadius > wx &&
    bx - CONFIG.ballRadius < wx + CONFIG.wallWidth &&
    by + CONFIG.ballRadius > wy &&
    by - CONFIG.ballRadius < wy + w.height.baseVal.value
  );
}

//  DIFFICULTY RAMP
function increaseDifficulty() {
  if (_score % 10 === 0 && _score !== 0) {
    wallGap -= 10;
    wallSpeed += 1;
    _score++;
  }
}

//  UPDATE SCORE
function updateScore() {
  const s = document.getElementById('score');
  s.textContent = _score.toString();
}

//  END GAME
function endGame() {
  clearInterval(gameInterval);
  gameActive = false;

  const iw = document.getElementById('interactionWindow');
  iw.style.opacity = "1";
  iw.style.pointerEvents = "auto";
  iw.querySelector('p').textContent = "🎮 Tap here to play again";

  alert("Game Over! Score: " + _score);
  resetGame();
}

//  BACKGROUND TOGGLE
let isDay = true;
let lastToggleScore = 0;

function toggleBackground() {
  const wrap = document.getElementById('gameWrapper');
  if (_score >= lastToggleScore + 20) {
    lastToggleScore = _score;
    isDay = !isDay;
    wrap.style.backgroundImage = isDay
      ? "url('backgroundDay.png')"
      : "url('backgroundNight.png')";
  }
}
