function Vector2d(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector2d.prototype.add = function (v) {
  this.x = this.x + v.x;
  this.y = this.y + v.y;
}

Vector2d.prototype.subtract = function (v) {
  this.x = this.x - v.x;
  this.y = this.y - v.y;
}

Vector2d.prototype.multiply = function (s) {
  this.x = this.x * s;
  this.y = this.y * s;
}

Vector2d.prototype.magnitude = function () {
  return Math.sqrt((this.x * this.x) + (this.y * this.y));
}

Vector2d.prototype.normalize = function () {
  return this.multiply(1 / this.magnitude());
}

Vector2d.prototype.dot = function (v) {
  return (this.x * v.x) + (this.y * v.y);
}

function Ball(options) {
  options = options || {};
  this.position = options.position || new Vector2d();
  this.velocity = options.velocity || new Vector2d();
  this.acceleration = options.acceleration || new Vector2d();
  this.radius = options.radius || 10;
  this.colour = options.colour || '#000000';
}

Ball.prototype.update = function () {
  this.position.add(this.velocity);
}

Ball.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
  ctx.fillStyle = this.colour;
  ctx.fill();
  ctx.closePath();
}

Ball.prototype.setPosition = function (v) {
  this.position = v;
}

Ball.prototype.setVelocity = function (v) {
  this.velocity = v;
}

Ball.prototype.stop = function () {
  this.velocity = new Vector2d();
}

Ball.prototype.setAcceleration = function (v) {
  this.position = v;
}

Ball.prototype.isStatic = function () {
  return this.velocity.x === 0 && this.velocity.y === 0;
}

var ball = new Ball();

var blockColor = [
  '#d4351c',
  '#ffdd00',
  '#00703c',
  '#1d70b8',
  '#003078',
  '#5694ca',
  '#4c2c92',
];
var brickPadding = 50;
var brickOffsetTop = 60;
var brickOffsetLeft = 155;
var score = 0;
var gameScore = 0;
var lives = 3;
var level = 1;
var paddleSpeed;
var gameCanvas;
var gameContainer;
var ctx;
var paddleWidth;
var paddleX;
var ballRadius;
var paddleHeight;
var rightPressed;
var leftPressed;
var spaceBarPressed;
var brickRowCount;
var brickColumnCount;
var brickWidth;
var brickHeight;
var winningScore;
var bricks;
var initialVelocity;
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
    bricks: initializeBricks(4, 4),
    initialVelocity: new Vector2d(-5, 5),
    paddleSpeed: 7
  },
  {
    ballRadius: 10,
    paddleHeight: 10,
    paddleWidth: 90,
    brickRowCount: 4,
    brickColumnCount: 4,
    brickWidth: 70,
    brickHeight: 40,
    winningScore: 16,
    brickOffsetLeft: 175,
    bricks: initializeBricks(4, 4),
    initialVelocity: new Vector2d(-6, 6),
    paddleSpeed: 7
  },
  {
    ballRadius: 10,
    paddleHeight: 10,
    paddleWidth: 80,
    brickRowCount: 4,
    brickColumnCount: 4,
    brickWidth: 60,
    brickHeight: 40,
    winningScore: 16,
    brickOffsetLeft: 195,
    bricks: initializeBricks(4, 4),
    initialVelocity: new Vector2d(-6, 6),
    paddleSpeed: 7
  },
  {
    ballRadius: 10,
    paddleHeight: 10,
    paddleWidth: 70,
    brickRowCount: 4,
    brickColumnCount: 4,
    brickWidth: 60,
    brickHeight: 40,
    winningScore: 16,
    brickOffsetLeft: 195,
    bricks: initializeBricks(4, 4),
    initialVelocity: new Vector2d(-6, 6),
    paddleSpeed: 7
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
    bricks: initializeBricks(4, 4),
    initialVelocity: new Vector2d(-7, 7),
    paddleSpeed: 7
  }

];
var scoreToWin = levels.reduce(function (total, levelData) {
  return levelData.winningScore + total;
}, 0);

function initializeBricks(columns, rows) {
  var bricks = [];

  for (var c = 0; c < columns; c++) {
    bricks[c] = [];

    for (var r = 0; r < rows; r++) {
      bricks[c].push({ x: 0, y: 0, visible: true });
    }
  }

  return bricks;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += '' + letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.colour;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(
    paddleX,
    gameCanvas.height - paddleHeight,
    paddleWidth,
    paddleHeight
  );
  ctx.fillStyle = '#1d70b8';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].visible) {
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
    ball.stop();
    loadLevel(level + 1);
  }

  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  ball.draw(ctx);
  drawBricks();
  drawPaddle();
  drawScore();
  drawLevel();
  drawLives();
  collisionDetection();

  if (gameScore === scoreToWin) {
    winGame();
    return;
  }

  if (ball.position.x + ball.velocity.x > gameCanvas.width - ball.radius || ball.position.x + ball.velocity.x < ball.radius) {
    ball.velocity.x = -ball.velocity.x;
  }

  if (ball.position.y + ball.velocity.y < ball.radius) {
    ball.velocity.y = -ball.velocity.y;
  } else if (ball.position.y + ball.velocity.y > gameCanvas.height - ball.radius - paddleHeight) {
    if (ball.position.x > paddleX - ball.radius && ball.position.x < paddleX + paddleWidth + ball.radius) {
      ball.velocity.y = -ball.velocity.y;
    } else {
      lives--;

      if (!lives) {
        loseGame();
        return;
      }

      ball.position.x = paddleX + paddleWidth / 2;
      ball.position.y = gameCanvas.height - paddleHeight - ballRadius;
      ball.stop();
      ball.setPosition(new Vector2d(paddleX + paddleWidth / 2, gameCanvas.height - ball.radius - paddleHeight));
    }
  }

  if (rightPressed && ball.isStatic()) {
    paddleX += paddleSpeed;
    ball.position.x = paddleX + paddleWidth / 2;
  }

  if (rightPressed && !ball.isStatic()) {
    paddleX += paddleSpeed;
  }

  if (paddleX + paddleWidth > gameCanvas.width) {
    paddleX = gameCanvas.width - paddleWidth;
  } else if (leftPressed && ball.isStatic()) {
    paddleX -= paddleSpeed;
    ball.position.x = paddleX + paddleWidth / 2;
  }

  if (leftPressed && !ball.isStatic()) {
    paddleX -= paddleSpeed;
  }

  if (paddleX < 0) {
    paddleX = 0;
  }

  ball.update();

  window.requestAnimationFrame(draw);
}

function keyDownHandler(e) {
  var key = e.key;

  if (key == 'Right' || key == 'ArrowRight') {
    e.preventDefault();
    rightPressed = true;
  } else if (key == 'Left' || key == 'ArrowLeft') {
    e.preventDefault();
    leftPressed = true;
  } else if (key == ' ' || key == 'Spacebar') {
    e.preventDefault();

    if (ball.isStatic()) {
      ball.setVelocity(initialVelocity);
    }
  }
}

function keyUpHandler(e) {
  var key = e.key;

  if (key == 'Right' || key == 'ArrowRight') {
    e.preventDefault();
    rightPressed = false;
  } else if (key == 'Left' || key == 'ArrowLeft') {
    e.preventDefault();
    leftPressed = false;
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var brick = bricks[c][r];
      if (brick.visible) {
        if (
          ball.position.x > brick.x &&
          ball.position.x < brick.x + brickWidth &&
          ball.position.y > brick.y &&
          ball.position.y < brick.y + brickHeight
        ) {
          ball.velocity.y = -ball.velocity.y;
          brick.visible = false;
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
  ball.setPosition(new Vector2d(gameCanvas.width / 2, gameCanvas.height - 20));
  initialVelocity = levelData.initialVelocity;
  x = gameCanvas.width / 2;
  y = gameCanvas.height - 20;
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
  paddleSpeed = levelData.paddleSpeed;
}

window.onload = function () {
  gameCanvas = document.getElementById('gameCanvas');
  ctx = gameCanvas.getContext('2d');
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);

  loadLevel(1);
  window.requestAnimationFrame(draw);
};
