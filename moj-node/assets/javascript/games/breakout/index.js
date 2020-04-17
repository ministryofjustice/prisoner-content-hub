var gameCanvas;
var gameContainer;
var ctx;
var x;
var y;
var paddleWidth;
var paddleX;
var dx = 0;
var dy = 0;
var ballStatic = true;
var ballRadius = 10;
var randomColor = getRandomColor();
var blockColor = [
  '#d4351c',
  '#ffdd00',
  '#00703c',
  '#1d70b8',
  '#003078',
  '#5694ca',
  '#4c2c92',
];
var paddleHeight = 10;
var rightPressed = false;
var leftPressed = false;
var spaceBarPressed = false;
var brickRowCount = 4;
var brickColumnCount = 4;
var brickWidth = 80;
var brickHeight = 40;
var brickPadding = 50;
var brickOffsetTop = 60;
var brickOffsetLeft = 155;
var score = 0;
var gameScore = 0;
var lives = 3;
var level = 1;
var winningScore = 16;
var bricks = initializeBricks(brickColumnCount, brickRowCount);

var levels = [
  {
    ballRadius: 10,
    paddleHeight: 10,
    paddleWidth: 100,
    brickRowCount: 4,
    brickColumnCount: 4,
    brickWidth: 80,
    brickHeight: 40,
    winningScore: 16,
    brickOffsetLeft: 155,
    bricks: initializeBricks(4, 4)
  },
  {
    ballRadius: 10,
    paddleHeight: 10,
    paddleWidth: 80,
    brickRowCount: 4,
    brickColumnCount: 4,
    brickWidth: 70,
    brickHeight: 40,
    winningScore: 16,
    brickOffsetLeft: 175,
    bricks: initializeBricks(4, 4)
  },
  {
    ballRadius: 10,
    paddleHeight: 10,
    paddleWidth: 60,
    brickRowCount: 4,
    brickColumnCount: 4,
    brickWidth: 60,
    brickHeight: 40,
    winningScore: 16,
    brickOffsetLeft: 195,
    bricks: initializeBricks(4, 4)
  }
];

function initializeBricks(columns, rows) {
  var bricks = [];

  for (var c = 0; c < columns; c++) {
    bricks[c] = [];
    for (var r = 0; r < rows; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  return bricks;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = randomColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(
    paddleX,
    gameCanvas.height - paddleHeight,
    paddleWidth,
    paddleHeight,
  );
  ctx.fillStyle = '#1d70b8';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = blockColor[c];
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  if (score === winningScore) {
    loadLevel(level + 1);
  }

  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLevel();
  drawLives();
  collisionDetection();

  if (gameScore === 48) {
    winGame();
    return;
  }

  if (x + dx > gameCanvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    randomColor = getRandomColor();
  }

  if (y + dy < ballRadius) {
    dy = -dy;
    randomColor = getRandomColor();
  } else if (y + dy > gameCanvas.height - ballRadius - paddleHeight) {
    if (x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        loseGame();
        return;
      } else {
        x = paddleX + paddleWidth / 2;
        y = gameCanvas.height - paddleHeight - ballRadius - 0;
        dx = 0;
        dy = 0;
        ballStatic = true;
      }
    }
  }

  if (rightPressed && ballStatic) {
    paddleX += 7;
    x = paddleX + paddleWidth / 2;
  }

  if (rightPressed && !ballStatic) {
    paddleX += 7;
  }

  if (paddleX + paddleWidth > gameCanvas.width) {
    paddleX = gameCanvas.width - paddleWidth;
  } else if (leftPressed && ballStatic) {
    paddleX -= 7;
    x = paddleX + paddleWidth / 2;
  }

  if (leftPressed && !ballStatic) {
    paddleX -= 7;
  }

  if (paddleX < 0) {
    paddleX = 0;
  }

  x += dx;
  y += dy;

  window.requestAnimationFrame(draw);
}

function keyDownHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    e.preventDefault();
    rightPressed = true;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    e.preventDefault();
    leftPressed = true;
  } else if (e.key == ' ' || e.key == 'Spacebar') {
    e.preventDefault();

    if (ballStatic) {
      ballStatic = false;

      if (level === 1) {
        dx = -5;
        dy = 5;
      }

      if (level === 2) {
        dx = -6;
        dy = 6;
      }

      if (level === 3) {
        dx = -7;
        dy = 7;
      }
    }
  }
}

function keyUpHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = false;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          gameScore++;
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '19 px GDS Transport';
  ctx.fillStyle = '	#0b0c0c';
  ctx.fillText('Score: ' + gameScore, 350, 20);
}

function drawLevel() {
  ctx.font = '19 px GDS Transport';
  ctx.fillStyle = '	#0b0c0c';
  ctx.fillText('Level: ' + level, 8, 20);
}

function drawLives() {
  ctx.font = '19px GDS Transport';
  ctx.fillStyle = '	#0b0c0c';
  ctx.fillText('Lives: ' + lives, gameCanvas.width - 70, 20);
}

function loseGame() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.fillStyle = '#1d70b8';
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '30px GDS Transport';
  ctx.fillText('Game over', 310, 250);
  ctx.fillText('You scored ' + gameScore + ' points', 260, 290);
  ctx.fillText('Press ENTER to restart the game', 180, 330);

  document.addEventListener('keyup', function (e) {
    if (e.keyCode === 13 || e.key === 'Enter') document.location.reload();
  });
}

function winGame() {
  ctx.fillStyle = '#1d70b8';
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '30px GDS Transport';
  ctx.fillText('Smashed it!', 320, 250);
  ctx.fillText('YOU WIN   :)', 315, 290);
  ctx.fillText('More levels coming soon', 240, 330);
  ctx.fillText('Press ENTER to start a new game', 180, 370);

  document.addEventListener('keyup', function (e) {
    if (e.keyCode === 13 || e.key === 'Enter') document.location.reload();
  });
}

function loadLevel(levelToLoad) {
  var levelData = levels[levelToLoad - 1];

  x = gameCanvas.width / 2;
  y = gameCanvas.height - 20;
  dx = 0;
  dy = 0;
  ballStatic = true;
  ballRadius = levelData.ballRadius;
  randomColor = getRandomColor();
  paddleHeight = levelData.paddleHeight;
  paddleWidth = levelData.paddleWidth;
  paddleX = (gameCanvas.width - paddleWidth) / 2;
  rightPressed = false;
  leftPressed = false;
  spaceBarPressed = false;
  brickRowCount = levelData.brickRowCount;
  brickColumnCount = levelData.brickColumnCount;
  brickWidth = levelData.brickWidth;
  brickHeight = levelData.brickHeight;
  brickOffsetLeft = levelData.brickOffsetLeft;
  score = 0;
  level = levelToLoad;
  winningScore = levelData.winningScore;
  bricks = initializeBricks(brickColumnCount, brickRowCount);
}

window.onload = function () {
  gameCanvas = document.getElementById('gameCanvas');
  ctx = gameCanvas.getContext('2d');
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);

  loadLevel(1);
  window.requestAnimationFrame(draw);
};
