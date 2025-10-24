// Ahmed Elshiekh, 000854877

let gameArea, ball, walls = [], score = 0, gameInterval, ballSpeedY = 0;
const wallWidth = 20, wallGapHeight = 100, initialWallGap = 200, ballRadius = 10;
let wallGap = initialWallGap, wallSpeed = 2;

document.addEventListener("DOMContentLoaded", () => {
  gameArea = document.getElementById('gameArea');
  document.getElementById('startButton').addEventListener('click', startGame);

  // ✅ Control with W key
  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'w') {
      ballSpeedY = -3; // move up
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.key.toLowerCase() === 'w') {
      ballSpeedY = 3; // fall down
    }
  });
});

function startGame() {
  resetGame();
  gameInterval = setInterval(updateGame, 20);
}

function resetGame() {
  while (gameArea.firstChild) {
    gameArea.removeChild(gameArea.firstChild);
  }
  ball = createBall();
  gameArea.appendChild(ball);
  walls = [];
  score = 0;
  wallGap = initialWallGap;
  wallSpeed = 2;
  updateScore();
}

function createBall() {
  let ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  ball.setAttribute("cx", "50");
  ball.setAttribute("cy", "200");
  ball.setAttribute("r", ballRadius.toString());
  ball.setAttribute("fill", "red");
  return ball;
}

let isDayBackground = true;
let lastBackgroundToggleScore = 0;

function updateGame() {
  moveBall();
  generateWalls();
  moveWalls();
  checkCollisions();
  updateScore();
  increaseDifficulty();
  toggleBackgroundIfNeeded();
}

function toggleBackgroundIfNeeded() {
  const wrapper = document.getElementById('gameWrapper');
  if (score >= lastBackgroundToggleScore + 20) {
    lastBackgroundToggleScore = score;
    isDayBackground = !isDayBackground;
    wrapper.style.backgroundImage = isDayBackground
      ? "url('backgroundDay.png')"
      : "url('backgroundNight.png')";
  }
}

function moveBall() {
  let currentY = ball.cy.baseVal.value;
  currentY += ballSpeedY;
  if (currentY < ballRadius) currentY = ballRadius;
  if (currentY > 400 - ballRadius) currentY = 400 - ballRadius;
  ball.setAttribute("cy", currentY);
}

function generateWalls() {
  if (walls.length === 0 || walls[walls.length - 1].topWall.x.baseVal.value < wallGap) {
    let gapY = Math.random() * (300 - wallGapHeight) + 50;
    createWallPair(gapY);
  }
}

function createWallPair(gapY) {
  let topWallHeight = gapY;
  let bottomWallHeight = 400 - gapY - wallGapHeight;
  let topWall = createWall(500, 0, topWallHeight);
  let bottomWall = createWall(500, gapY + wallGapHeight, bottomWallHeight);
  walls.push({ topWall, bottomWall });
}

function createWall(x, y, height) {
  let wall = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  wall.setAttribute("x", x.toString());
  wall.setAttribute("y", y.toString());
  wall.setAttribute("width", wallWidth.toString());
  wall.setAttribute("height", height.toString());
  wall.setAttribute("fill", "green");
  gameArea.appendChild(wall);
  return wall;
}

function moveWalls() {
  for (let i = 0; i < walls.length; i++) {
    let wallPair = walls[i];
    wallPair.topWall.setAttribute("x", wallPair.topWall.x.baseVal.value - wallSpeed);
    wallPair.bottomWall.setAttribute("x", wallPair.bottomWall.x.baseVal.value - wallSpeed);

    if (wallPair.topWall.x.baseVal.value < -wallWidth) {
      gameArea.removeChild(wallPair.topWall);
      gameArea.removeChild(wallPair.bottomWall);
      walls.splice(i, 1);
      i--;
      score++;
    }
  }
}

function checkCollisions() {
  let ballX = ball.cx.baseVal.value, ballY = ball.cy.baseVal.value;
  for (let wallPair of walls) {
    if (checkWallCollision(wallPair.topWall, ballX, ballY) ||
        checkWallCollision(wallPair.bottomWall, ballX, ballY)) {
      clearInterval(gameInterval);
      alert("Game Over! Score: " + score);
      resetGame();
      break;
    }
  }
}

function checkWallCollision(wall, ballX, ballY) {
  let wallX = wall.x.baseVal.value, wallY = wall.y.baseVal.value;
  return ballX + ballRadius > wallX && ballX - ballRadius < wallX + wallWidth &&
         ballY + ballRadius > wallY && ballY - ballRadius < wallY + wall.height.baseVal.value;
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
