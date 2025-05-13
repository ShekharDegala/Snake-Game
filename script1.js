var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var scoreEl = document.getElementById('score');
var highScoreEl = document.getElementById('highScore');
var statusEl = document.getElementById('status');

var grid = 16;
var count = 0;
var paused = false;

var score = 0;
var highScore = localStorage.getItem("highScore") || 0;
highScoreEl.textContent = highScore;

var snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

var apple = {
  x: 320,
  y: 320
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreEl.textContent = highScore;
  }
  score = 0;
  scoreEl.textContent = score;
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;
  apple.x = getRandomInt(0, 25) * grid;
  apple.y = getRandomInt(0, 25) * grid;
}

function loop() {
  requestAnimationFrame(loop);

  if (paused) return;

  if (++count < 4) return;
  count = 0;

  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) snake.x = canvas.width - grid;
  else if (snake.x >= canvas.width) snake.x = 0;
  if (snake.y < 0) snake.y = canvas.height - grid;
  else if (snake.y >= canvas.height) snake.y = 0;

  snake.cells.unshift({x: snake.x, y: snake.y});
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      scoreEl.textContent = score;
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        resetGame();
        return;
      }
    }
  });
}

document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') {
    paused = !paused;
    statusEl.textContent = paused ? "Paused" : "Playing";
    return;
  }

  if (paused) return;

  // Handle directional input
  if (e.which === 37 && snake.dx === 0) { // Left
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dy === 0) { // Up
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) { // Right
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dy === 0) { // Down
    snake.dy = grid;
    snake.dx = 0;
  }
});

requestAnimationFrame(loop);

document.getElementById("resetBtn").addEventListener("click", function () {
  if (confirm("Are you sure you want to reset the high score?")) {
    localStorage.removeItem("highScore");
    highScore = 0;
    highScoreEl.textContent = highScore;
  }
});
