var DEFAULT_BRICK_COLUMN_COUNT = 8;
var DEFAULT_BRICK_ROW_COUNT = 4;
var DEFAULT_BRICK_PADDING = 10;
var DEFAULT_BRICK_HEIGHT = 40;
var DEFAULT_BRICK_OFFSET_TOP = 40;
var DEFAULT_BRICK_HEALTH = 1;
var DEFAULT_PADDLE_WIDTH = 100;
var DEFAULT_PADDLE_HEIGHT = 10;
var DEFAULT_PADDLE_SPEED = 7;
var DEFAULT_BALL_RADIUS = 10;
var DEFAULT_BALL_COLOUR = '#ff0000';
var DEFAULT_BALL_VELOCITY = 7;

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
  this.radius = options.radius || DEFAULT_BALL_RADIUS;
  this.colour = options.colour || DEFAULT_BALL_COLOUR;
  this.initialVelocity = options.initialVelocity || DEFAULT_BALL_VELOCITY;
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

function Paddle(options) {
  options = options || {};
  this.position = options.position || new Vector2d();
  this.width = options.width || DEFAULT_PADDLE_WIDTH;
  this.height = options.height || DEFAULT_PADDLE_HEIGHT;
  this.speed = options.speed || DEFAULT_PADDLE_SPEED;
  this.colour = options.colour || '#1d70b8';
}

Paddle.prototype.setPosition = function (v) {
  this.position = v;
}

Paddle.prototype.moveLeft = function () {
  this.position.x = this.position.x - this.speed;
}

Paddle.prototype.moveRight = function () {
  this.position.x = this.position.x + this.speed;
}

Paddle.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.rect(
    this.position.x,
    this.position.y,
    this.width,
    this.height
  );
  ctx.fillStyle = this.colour;
  ctx.fill();
  ctx.closePath();
}

function Grid(options) {
  options = options || {};
  this.rows = options.rows || DEFAULT_BRICK_ROW_COUNT;
  this.columns = options.columns || DEFAULT_BRICK_COLUMN_COUNT;
  this.padding = options.padding || DEFAULT_BRICK_PADDING;
  this.width = options.width || 0;
  this.brickHeight = options.brickHeight || DEFAULT_BRICK_HEIGHT;
  this.initialBrickHealth = options.initialBrickHealth || DEFAULT_BRICK_HEALTH;
  this.bricks = [];
  this.yOffset = options.yOffset || DEFAULT_BRICK_OFFSET_TOP;
  var totalPadding = (this.columns * this.padding) + this.padding;
  this.brickWidth = (this.width - totalPadding) / this.columns;

  for (var r = 0; r < this.rows; r++) {
    var yOffset = (r * (this.padding + this.brickHeight)) + this.yOffset;
    var xOffset = this.padding;
    for (var c = 0; c < this.columns; c++) {
      var position = new Vector2d(xOffset, yOffset);
      this.bricks.push(new Brick({ position: position, initialHealth: this.initialBrickHealth }));
      xOffset = xOffset + this.brickWidth + this.padding;
    }
  }
}

Grid.prototype.draw = function (ctx) {
  for (var i = 0; i < this.bricks.length; i++) {
    var brick = this.bricks[i];
    if (brick.health > 0) {
      ctx.beginPath();
      ctx.rect(brick.position.x, brick.position.y, grid.brickWidth, grid.brickHeight);
      ctx.fillStyle = brick.colour;
      ctx.fill();
      ctx.closePath();
    }
  }
}

Grid.prototype.checkCollisions = function (ball) {
  for (var i = 0; i < this.bricks.length; i++) {
    var brick = this.bricks[i];
    if (brick.health > 0) {
      if (
        ball.position.x + ball.radius > brick.position.x &&
        ball.position.x - ball.radius < brick.position.x + this.brickWidth &&
        ball.position.y + ball.radius > brick.position.y &&
        ball.position.y - ball.radius < brick.position.y + this.brickHeight
      ) {
        ball.velocity.y = -ball.velocity.y;
        brick.hit();
        score++;
        gameScore++;
      }
    }
  }
}

function Brick(options) {
  options = options || {};
  this.position = options.position || new Vector2d();
  this.health = options.initialHealth || 1;
  this.colour = options.colour || Brick.colours[this.health];
}

Brick.colours = [
  '#d4351c',
  '#ffdd00',
  '#00703c',
  '#1d70b8',
  '#003078',
  '#5694ca',
  '#4c2c92',
];

Brick.prototype.setPosition = function (v) {
  this.position = v;
}

Brick.prototype.hit = function () {
  this.health = this.health > 0 ? this.health - 1 : 0;
  this.colour = Brick.colours[this.health];
}

var ball;
var paddle;
var grid;

var score = 0;
var gameScore = 0;
var lives = 3;
var level = 1;
var gameCanvas;
var gameContainer;
var ctx;
var rightPressed;
var leftPressed;
var spaceBarPressed;
var winningScore;
var levels = [
  {
    ballRadius: 10,
    rows: 2,
    initialVelocity: 5,
    initialBrickHealth: 1
  },
  {
    ballRadius: 10,
    rows: 3,
    initialVelocity: 6,
    initialBrickHealth: 2
  },
  {
    ballRadius: 10,
    rows: 5,
    initialVelocity: 6,
    initialBrickHealth: 2
  },
  {
    ballRadius: 10,
    rows: 5,
    initialVelocity: 6,
    initialBrickHealth: 3
  },
  {
    ballRadius: 10,
    rows: 6,
    initialVelocity: 7,
    initialBrickHealthL: 3
  }
];
var scoreToWin = levels.reduce(function (total, levelData) {
  return levelData.winningScore + total;
}, 0);

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += '' + letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function draw() {
  if (score === winningScore) {
    ball.stop();
    loadLevel(level + 1);
  }

  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  ball.draw(ctx);
  paddle.draw(ctx);
  grid.draw(ctx);
  drawScore();
  drawLevel();
  drawLives();
  grid.checkCollisions(ball);

  if (gameScore === scoreToWin) {
    winGame();
    return;
  }

  if (ball.position.x + ball.velocity.x > gameCanvas.width - ball.radius || ball.position.x + ball.velocity.x < ball.radius) {
    ball.velocity.x = -ball.velocity.x;
  }

  if (ball.position.y + ball.velocity.y < ball.radius) {
    ball.velocity.y = -ball.velocity.y;
  } else if (ball.position.y + ball.velocity.y > gameCanvas.height - ball.radius - paddle.height) {
    if (ball.position.x > paddle.position.x - ball.radius && ball.position.x < paddle.position.x + paddle.width + ball.radius) {
      ball.velocity.y = -ball.velocity.y;
    } else {
      lives--;

      if (!lives) {
        loseGame();
        return;
      }

      ball.position.x = paddle.position.x + paddle.width / 2;
      ball.position.y = gameCanvas.height - paddle.height - ball.radius;
      ball.stop();
      ball.setPosition(new Vector2d(paddle.position.x + paddle.width / 2, gameCanvas.height - ball.radius - paddle.height));
    }
  }

  if (rightPressed && ball.isStatic()) {
    paddle.moveRight();
    ball.position.x = paddle.position.x + paddle.width / 2;
  }

  if (rightPressed && !ball.isStatic()) {
    paddle.moveRight();
  }

  if (paddle.position.x + paddle.width > gameCanvas.width) {
    paddle.position.x = gameCanvas.width - paddle.width;
  } else if (leftPressed && ball.isStatic()) {
    paddle.moveLeft();
    ball.position.x = paddle.position.x + paddle.width / 2;
  }

  if (leftPressed && !ball.isStatic()) {
    paddle.moveLeft();
  }

  if (paddle.position.x < 0) {
    paddle.position.x = 0;
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
      var velocity = paddle.position.x < gameCanvas.width / 2 ? new Vector2d(1, 1) : new Vector2d(-1, 1);
      velocity.multiply(ball.initialVelocity);
      ball.setVelocity(velocity);
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
  paddle = new Paddle({
    height: levelData.paddleHeight,
    width: levelData.paddleWidth,
    speed: levelData.paddleSpeed
  });
  paddle.setPosition(new Vector2d((gameCanvas.width - paddle.width) / 2, gameCanvas.height - paddle.height));
  ball = new Ball({
    initialVelocity: levelData.initialVelocity
  });
  ball.setPosition(new Vector2d(gameCanvas.width / 2, gameCanvas.height - paddle.height - ball.radius));
  grid = new Grid({
    rows: levelData.rows,
    width: gameCanvas.width,
    initialBrickHealth: levelData.initialBrickHealth
  });
  rightPressed = false;
  leftPressed = false;
  spaceBarPressed = false;
  score = 0;
  level = levelToLoad;
  winningScore = grid.rows * grid.columns;
}

window.onload = function () {
  gameCanvas = document.getElementById('gameCanvas');
  ctx = gameCanvas.getContext('2d');
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);

  loadLevel(1);
  window.requestAnimationFrame(draw);
};
