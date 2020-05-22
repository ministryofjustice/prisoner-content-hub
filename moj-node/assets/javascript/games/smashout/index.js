var DEFAULT_LIVES = 3;
var DEFAULT_BRICK_COLUMN_COUNT = 8;
var DEFAULT_BRICK_ROW_COUNT = 4;
var DEFAULT_BRICK_PADDING = 7;
var DEFAULT_BRICK_HEIGHT = 35;
var DEFAULT_BRICK_OFFSET_TOP = 40;
var DEFAULT_BRICK_HEALTH = 1;
var DEFAULT_PADDLE_WIDTH = 100;
var DEFAULT_PADDLE_HEIGHT = 15;
var DEFAULT_PADDLE_SPEED = 7;
var DEFAULT_PADDLE_COLOUR = '#803cb5';
var DEFAULT_BALL_RADIUS = 10;
var DEFAULT_BALL_COLOUR = '#e32b6e';
var DEFAULT_BALL_VELOCITY = 7;
var SCORE_MULTIPLIER = 50;
var SCORE_BAR_HEIGHT = 40;

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
    initialVelocity: 6,
    initialBrickHealth: 3
  },
  {
    ballRadius: 10,
    rows: 4,
    initialVelocity: 6,
    initialBrickHealth: 4
  },
  {
    ballRadius: 10,
    rows: 5,
    initialVelocity: 6,
    initialBrickHealth: 4
  },
  {
    ballRadius: 10,
    rows: 6,
    initialVelocity: 6,
    initialBrickHealth: 5
  },
  {
    ballRadius: 10,
    rows: 4,
    initialVelocity: 7,
    initialBrickHealth: 3
  },
  {
    start: function() {this.lives += 1;},
    ballRadius: 10,
    rows: 5,
    initialVelocity: 7,
    initialBrickHealth: 4
  },
  {
    ballRadius: 10,
    rows: 5,
    initialVelocity: 7,
    initialBrickHealth: 6
  },
  {
    ballRadius: 10,
    rows: 6,
    initialVelocity: 7,
    initialBrickHealth: 7,
  }
];

function Vector2d(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector2d.prototype.add = function (v) {
  this.x = this.x + v.x;
  this.y = this.y + v.y;
  return this;
}

Vector2d.prototype.subtract = function (v) {
  this.x = this.x - v.x;
  this.y = this.y - v.y;
  return this;
}

Vector2d.prototype.multiply = function (s) {
  this.x = this.x * s;
  this.y = this.y * s;
  return this;
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

Vector2d.from = function (v) {
  return new Vector2d(v.x, v.y);
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

Ball.prototype.bounce = function (n, s) {
  s = s || 1;
  this.velocity = n.multiply(this.velocity.dot(n) * -2).add(this.velocity).multiply(s);
}

Ball.prototype.stop = function () {
  this.velocity = new Vector2d();
}

Ball.prototype.setAcceleration = function (v) {
  this.acceleration = v;
}

Ball.prototype.isStatic = function () {
  return this.velocity.x === 0 && this.velocity.y === 0;
}

Ball.prototype.hasCollidedWith = function (entity) {
  return this.position.x + this.radius > entity.position.x &&
    this.position.x - this.radius < entity.position.x + entity.width &&
    this.position.y + this.radius > entity.position.y &&
    this.position.y - this.radius < entity.position.y + entity.height
}

function Paddle(options) {
  options = options || {};
  this.position = options.position || new Vector2d();
  this.velocity = new Vector2d();
  this.acceleration = new Vector2d();
  this.width = options.width || DEFAULT_PADDLE_WIDTH;
  this.height = options.height || DEFAULT_PADDLE_HEIGHT;
  this.range = options.range;
  this.speed = options.speed || DEFAULT_PADDLE_SPEED;
  this.colour = options.colour || DEFAULT_PADDLE_COLOUR;
  this.normal = new Vector2d(0, 1);
}

Paddle.prototype.setPosition = function (v) {
  this.position = v;
}

Paddle.prototype.moveLeft = function () {
  this.acceleration = this.acceleration.add(new Vector2d(-this.speed / 5, 0));
}

Paddle.prototype.moveRight = function () {
  this.acceleration = this.acceleration.add(new Vector2d(this.speed / 5, 0));
}

Paddle.prototype.update = function () {
  this.velocity.add(this.acceleration);
  if (this.velocity.magnitude() > 0) {
    var friction = Vector2d.from(this.velocity).multiply(-0.1);
    this.velocity.add(friction);
    this.position.add(this.velocity);
  }
  this.acceleration = new Vector2d();
  if (this.position.x <= 0) {
    this.position.x = 0;
  }
  if (this.position.x >= this.range - this.width) {
    this.position.x = this.range - this.width;
  }
  if (this.ball) {
    this.ball.setPosition(new Vector2d(this.position.x + (this.width / 2), this.position.y - this.ball.radius));
  }
}

Paddle.prototype.attachBall = function (ball) {
  ball.setVelocity(new Vector2d());
  ball.setPosition(new Vector2d(this.position.x + (this.width / 2), this.position.y - ball.radius));
  this.ball = ball;
}

Paddle.prototype.launchBall = function () {
  if (this.ball) {
    var launchVelocity = this.position.x < this.range / 2 ? new Vector2d(1, -1) : new Vector2d(-1, -1);
    launchVelocity.multiply(this.ball.initialVelocity);
    this.ball.setVelocity(launchVelocity);
    this.ball = null;
  }
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

Paddle.prototype.checkCollisions = function (ball) {
  if (ball.hasCollidedWith(this)) {
    ball.setPosition(new Vector2d(ball.position.x, this.position.y - ball.radius));
    ball.bounce(new Vector2d(0, 1));
  }
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
  this.yOffset = options.yOffset || DEFAULT_BRICK_OFFSET_TOP + SCORE_BAR_HEIGHT;
  var totalPadding = (this.columns * this.padding) + this.padding;
  this.brickWidth = (this.width - totalPadding) / this.columns;

  for (var r = 0; r < this.rows; r++) {
    var yOffset = (r * (this.padding + this.brickHeight)) + this.yOffset;
    var xOffset = this.padding;
    for (var c = 0; c < this.columns; c++) {
      var position = new Vector2d(xOffset, yOffset);
      this.bricks.push(new Brick({ position: position, initialHealth: this.initialBrickHealth, width: this.brickWidth, height: this.brickHeight }));
      xOffset = xOffset + this.brickWidth + this.padding;
    }
  }
}

Grid.prototype.draw = function (ctx) {
  for (var i = 0; i < this.bricks.length; i++) {
    var brick = this.bricks[i];
    if (brick.health > 0) {
      ctx.beginPath();
      ctx.rect(brick.position.x, brick.position.y, this.brickWidth, this.brickHeight);
      ctx.fillStyle = brick.colour;
      ctx.fill();
      ctx.closePath();
    }
  }
}

Grid.prototype.checkCollisions = function (ball) {
  var remainingBricks = [];
  var score = 0;
  for (var i = 0; i < this.bricks.length; i++) {
    var brick = this.bricks[i];
    if (brick.health > 0) {
      if (ball.hasCollidedWith(brick)) {
        ball.bounce(new Vector2d(0, 1));
        brick.hit();
        score = score + ((this.initialBrickHealth - brick.health) * SCORE_MULTIPLIER);
      }
      remainingBricks.push(brick);
    }
  }
  this.bricks = remainingBricks;
  return score;
}

function Brick(options) {
  options = options || {};
  this.position = options.position || new Vector2d();
  this.health = options.initialHealth || 1;
  this.colour = options.colour || Brick.colours[this.health - 1];
  this.width = options.width;
  this.height = options.height;
}

Brick.colours = [
  '#c72626',
  '#d46515',
  '#edcd1a',
  '#1aed67',
  '#1ac3ed',
  '#801aed',
  '#c31aed',
];

Brick.prototype.setPosition = function (v) {
  this.position = v;
}

Brick.prototype.hit = function () {
  this.health = this.health > 0 ? this.health - 1 : 0;
  this.colour = Brick.colours[this.health - 1];
}

function InputHandler(context) {
  this.defaultHandler = function () { };
  this.handleSpace = this.defaultHandler;
  this.handleLeft = this.defaultHandler;
  this.handleRight = this.defaultHandler;
  this.handleEnter = this.defaultHandler;
  this.keys = [];
  this.konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  this.konamiCodeIndex = 0;
  this.cheats = { lives: function () { } };
  var _this = this;


  context.addEventListener('keyup', function (e) {
    _this.keys[e.keyCode] = false;
  });

  context.addEventListener('keydown', function (e) {
    if (e.target.matches('textarea') || e.target.matches('input') || e.target.matches('button')) {
      return;
    }
    if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 65 || e.keyCode === 66) {
      e.preventDefault();
      if (_this.konamiCode[_this.konamiCodeIndex] === e.keyCode) {
        _this.konamiCodeIndex++;
      } else {
        _this.konamiCodeIndex = 0;
      }
      if (_this.konamiCodeIndex === _this.konamiCode.length) {
        _this.cheats.lives(9999);
        _this.konamiCodeIndex = 0
      }
    }
    if (e.keyCode === 32) {
      e.preventDefault();
    }
    _this.keys[e.keyCode] = true;
  });
}

InputHandler.prototype.addHandler = function (button, handler) {
  switch (button) {
    case 'left': this.handleLeft = handler; break;
    case 'right': this.handleRight = handler; break;
    case 'space': this.handleSpace = handler; break;
    case 'enter': this.handleEnter = handler; break;
    default: console.warn('Unsupported button');
  }
}

InputHandler.prototype.removeHandler = function (button) {
  switch (button) {
    case 'left': this.handleLeft = this.defaultHandler; break;
    case 'right': this.handleRight = this.defaultHandler; break;
    case 'space': this.handleSpace = this.defaultHandler; break;
    case 'enter': this.handleEnter = this.defaultHandler; break;
    default: console.warn('Unsupported button');
  }
}

InputHandler.prototype.listen = function () {
  if (this.keys[37]) {
    this.handleLeft();
  }
  if (this.keys[39]) {
    this.handleRight();
  }
  if (this.keys[13]) {
    this.handleEnter();
  }
  if (this.keys[32]) {
    this.handleSpace();
  }
}

function Game(options) {
  options = options || {};
  this.levels = options.levels || [];
  this.level = 0;
  this.score = 0;
  this.lives = DEFAULT_LIVES;
  this.canvas = options.canvas;
  this.ctx = this.canvas.getContext('2d');
  this.paddle = null;
  this.ball = null;
  this.grid = null;
  this.inputHandler = options.inputHandler;
  this.inputHandler.cheats.lives = this.setLives.bind(this);
  this.loadLevel();
}

Game.prototype.loadLevel = function () {
  var level = this.levels[this.level];
  var levelStart = level.start || function() {};
    levelStart.call(this);
  this.paddle = new Paddle({
    height: level.paddleHeight,
    width: level.paddleWidth,
    speed: level.paddleSpeed,
    range: this.canvas.width,
  });
  this.paddle.setPosition(new Vector2d((this.canvas.width - this.paddle.width) / 2, this.canvas.height - this.paddle.height));
  this.ball = new Ball({
    initialVelocity: level.initialVelocity
  });
  this.paddle.attachBall(this.ball);
  this.grid = new Grid({
    rows: level.rows,
    columns: level.columns,
    brickHeight: level.brickHeight,
    padding: level.padding,
    width: this.canvas.width,
    initialBrickHealth: level.initialBrickHealth
  });
  winningScore = this.grid.rows * this.grid.columns;

  this.inputHandler.addHandler('left', this.paddle.moveLeft.bind(this.paddle));
  this.inputHandler.addHandler('right', this.paddle.moveRight.bind(this.paddle));
  this.inputHandler.addHandler('space', this.paddle.launchBall.bind(this.paddle));
}

Game.prototype.reset = function () {
  this.level = 0;
  this.score = 0;
  this.lives = DEFAULT_LIVES;
  this.inputHandler.removeHandler('enter');
  this.loadLevel();
}

Game.prototype.checkWallCollisions = function () {
  if (this.ball.position.x + this.ball.radius <= 0) {
    this.ball.position.x = this.ball.radius;
    this.ball.bounce(new Vector2d(1, 0));
  } else if (this.ball.position.x - this.ball.radius >= this.canvas.width) {
    this.ball.position.x = this.canvas.width - this.ball.radius;
    this.ball.bounce(new Vector2d(1, 0));
  } else if (this.ball.position.y + this.ball.radius <= SCORE_BAR_HEIGHT) {
    this.ball.position.y = SCORE_BAR_HEIGHT + this.ball.radius;
    this.ball.bounce(new Vector2d(0, 1));
  } else if (this.ball.position.y - this.ball.radius >= this.canvas.height - this.paddle.height) {
    this.paddle.attachBall(this.ball);
    this.lives = this.lives - 1;
  }
}

Game.prototype.drawScore = function () {
  this.ctx.font = '19px GDS Transport';
  this.ctx.fillStyle = '#0b0c0c';
  this.ctx.fillText('Score: ' + this.score, 350, 20);
}

Game.prototype.drawLevel = function () {
  this.ctx.font = '19px GDS Transport';
  this.ctx.fillStyle = '#0b0c0c';
  this.ctx.fillText('Level: ' + (this.level + 1), 8, 20);
}

Game.prototype.drawLives = function () {
  this.ctx.font = '19px GDS Transport';
  this.ctx.fillStyle = '#0b0c0c';
  this.ctx.fillText('Lives: ' + this.lives, this.canvas.width - 100, 20);
}

Game.prototype.drawWinScreen = function () {
  this.ctx.fillStyle = '#1d70b8';
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.fillStyle = 'white';
  this.ctx.font = '30px GDS Transport';
  this.ctx.fillText('Smashed it!', 320, 250);
  this.ctx.fillText('YOU WIN   :)', 315, 290);
  this.ctx.fillText('More levels coming soon', 240, 330);
  this.ctx.fillText('Press ENTER to start a new game', 180, 370);
}

Game.prototype.drawLoseScreen = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.fillStyle = '#1d70b8';
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.fillStyle = 'white';
  this.ctx.font = '30px GDS Transport';
  this.ctx.fillText('Game over', 310, 250);
  this.ctx.fillText('You scored ' + this.score + ' points', 260, 290);
  this.ctx.fillText('Press ENTER to restart the game', 180, 330);
}

Game.prototype.update = function () {
  if (this.grid.bricks.length === 0 && this.level < this.levels.length) {
    var nextLevel = this.level + 1;
    this.loadLevel(nextLevel);
    this.level = nextLevel;
  }

  this.inputHandler.listen();
  this.paddle.update();
  this.score = this.score + this.grid.checkCollisions(this.ball);
  this.paddle.checkCollisions(this.ball);
  this.ball.update();
  this.checkWallCollisions();
}

Game.prototype.setLives = function (lives) {
  this.lives = lives;
}

Game.prototype.draw = function () {
  if (this.level === this.levels.length) {
    this.inputHandler.addHandler('enter', this.reset.bind(this));
    return this.drawWinScreen();
  }

  if (this.lives === 0) {
    this.inputHandler.addHandler('enter', this.reset.bind(this));
    return this.drawLoseScreen();
  }

  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ball.draw(this.ctx);
  this.paddle.draw(this.ctx);
  this.grid.draw(this.ctx);
  this.drawScore();
  this.drawLevel();
  this.drawLives();
}

window.onload = function () {
  var gameCanvas = document.getElementById('gameCanvas');
  var inputHandler = new InputHandler(document);
  var game = new Game({ canvas: gameCanvas, levels: levels, inputHandler: inputHandler });
  var gameLoop = function () {
    game.update();
    game.draw();
    window.requestAnimationFrame(gameLoop);
  };
  window.requestAnimationFrame(gameLoop);
};
