if (!Array.prototype.filter){
  Array.prototype.filter = function(func, thisArg) {
    'use strict';
    if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
        throw new TypeError();

    var len = this.length >>> 0,
        res = new Array(len), // preallocate array
        t = this, c = 0, i = -1;

    var kValue;
    if (thisArg === undefined){
      while (++i !== len){
        // checks to see if the key was set
        if (i in this){
          kValue = t[i]; // in case t is changed in callback
          if (func(t[i], i, t)){
            res[c++] = kValue;
          }
        }
      }
    }
    else{
      while (++i !== len){
        // checks to see if the key was set
        if (i in this){
          kValue = t[i];
          if (func.call(thisArg, t[i], i, t)){
            res[c++] = kValue;
          }
        }
      }
    }

    res.length = c; // shrink down array to proper size
    return res;
  };
}

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);

	document.addEventListener('DOMContentLoaded', function() {
	  const canvas = document.getElementById('game-canvas');
	  canvas.height = 600;
	  canvas.width = 900;

	  const canvasSize = [canvas.width, canvas.height];
	  const ctx        = canvas.getContext('2d');
	  const gameView   = new GameView(ctx, canvasSize);

	  gameView.welcome();

	  const mainLogo           = document.getElementById('main-logo');
	  const playGameButton     = document.getElementById('play-game');
	  const gameOverImage      = document.getElementById('game-over');
	  const finalScoreText     = document.getElementById('final-score');
	  const menuButton         = document.getElementById('menu-button');
	  const menuContainer      = document.getElementById('menu-container');
	  const aboutButton        = document.getElementById('about-button');
	  const about              = document.getElementById('about');
	  const instructionsButton = document.getElementById('instructions-button');
	  const instructions       = document.getElementById('instructions');
	  const resumeButton       = document.getElementById('resume-button');
	  const restartButton      = document.getElementById('restart-button');
	  const closeAbout         = document.getElementById('close-about');
	  const closeInstructions  = document.getElementById('close-instructions');
	  const grunt              = document.getElementById('grunt-1');
	  const soldier            = document.getElementById('soldier-1');
	  const invader            = document.getElementById('invader-1');
	  const ufo                = document.getElementById('ufo');
	  const invaderInfo        = document.getElementById('invader-info');
	  const audio              = document.getElementById('audio');
	  const mute               = document.getElementById('mute');
	  const splashInstruction  = document.getElementById('splash-instruction');

	  audio.addEventListener('click', function() {
	    if (audio.className === 'hide') {
	      audio.className   = 'show';
	      mute.className    = 'hide';
	    } else {
	      audio.className   = 'hide';
	      mute.className    = 'show';
	    }

	    gameView.toggleAudio();
	  });

	  mute.addEventListener('click', function() {
	    if (audio.className === 'hide') {
	      audio.className   = 'show';
	      mute.className    = 'hide';
	    } else {
	      audio.className   = 'hide';
	      mute.className    = 'show';
	    }

	    gameView.toggleAudio();
	  });

	  playGameButton.addEventListener("click", function() {
	    menuButton.className        =     '';
	    playGameButton.className    = 'hide';
	    mainLogo.className          = 'hide';
      gameOverImage.className     = 'hide';
      finalScoreText.className    = 'hide';
	    grunt.className             = 'hide';
	    soldier.className           = 'hide';
	    invader.className           = 'hide';
	    ufo.className               = 'hide';
	    invaderInfo.className       = 'hide';
	    splashInstruction.className = 'hide';

	    gameView.start();
	  });

	  menuButton.addEventListener("click", function() {
	    gameView.pause();

	    menuContainer.className = 'show';
	    aboutButton.className = '';
	    instructionsButton.className = '';
	    resumeButton.className = '';
	    restartButton.className = '';
	  });

	  closeAbout.addEventListener('click', function() {
	    gameView.pause();

	    about.className = 'hide';
	    instructions.className = 'hide';
	    closeAbout.className = 'hide';

	    menuContainer.className = '';
	    aboutButton.className = '';
	    instructionsButton.className = '';
	    resumeButton.className = '';
	    restartButton.className = '';
	  });

	  aboutButton.addEventListener('click', function() {
	    gameView.pause();

	    menuContainer.className = 'hide';
	    aboutButton.className = 'hide';
	    instructionsButton.className = 'hide';
	    resumeButton.className = 'hide';
	    restartButton.className = 'hide';

	    about.className = 'show';
	    closeAbout.className = 'show';
	  });

	  closeInstructions.addEventListener('click', function() {
	    gameView.pause();

	    about.className = 'hide';
	    instructions.className = 'hide';
	    closeAbout.className = 'hide';

	    menuContainer.className = 'show';
	    aboutButton.className = '';
	    instructionsButton.className = '';
	    resumeButton.className = '';
	    restartButton.className = '';
	  });

	  instructionsButton.addEventListener('click', function() {
	    gameView.pause();

	    menuContainer.className = 'hide';
	    aboutButton.className = 'hide';
	    instructionsButton.className = 'hide';
	    resumeButton.className = 'hide';
	    restartButton.className = 'hide';

	    instructions.className = '';
	    closeInstructions.className = '';
	  });

	  resumeButton.addEventListener('click', function() {
	    menuContainer.className = 'hide';
	    aboutButton.className = 'hide';
	    instructionsButton.className = 'hide';
	    resumeButton.className = 'hide';
	    restartButton.className = 'hide';

	    gameView.resume();
	  });

	  restartButton.addEventListener('click', function() {
	    menuContainer.className = 'hide';
	    aboutButton.className = 'hide';
	    instructionsButton.className = 'hide';
	    resumeButton.className = 'hide';
	    restartButton.className = 'hide';

	    gameView.restart();
	  });

	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);

	const GameView = function(ctx, canvasSize) {
	  this.ctx = ctx;
	  this.canvasSize = canvasSize;
	  this.game = new Game({
	    canvasSize: this.canvasSize,
	    ctx: this.ctx,
	    gameView: this
	  });
	  this.defender = this.game.defender;
	  this.isPaused = false;

	  this.rightPressed = false;
	  this.leftPressed = false;
	  this.spacePressed = false;

    this.isMuted = false;
    this.finalScore = 0;
	};

	GameView.prototype.toggleAudio = function() {
	  this.isMuted = this.isMuted ? false : true;
	};

	GameView.prototype.start = function() {
    var that = this;
	  this.interval = setInterval(function() {
	    if (!that.isPaused) {
	      that.game.draw(that.ctx);
	      that.addLivesText(that.ctx);
	      that.addScoreText(that.ctx);
	      that.addLevelText(that.ctx);
	      that.moveDefender();
	      that.game.moveInvaders();
	      that.game.addUfo();
	      that.game.step();
	    }
    }, 10);

	  // Animate enemy sprites
	  this.toggle = setInterval(function() {
	    if (!that.isPaused) that.game.toggleInvaders();
	  }, 500);
	};

	GameView.prototype.stop = function() {
	  clearInterval(this.interval);
	  clearInterval(this.toggle);

	  this.interval     = null;
	  this.toggle       = null;
	  this.rightPressed = false;
	  this.leftPressed  = false;
	  this.spacePressed = false;
    this.isPaused     = false;
    this.finalScore   = this.game.score;

	  this.game = new Game({
	    canvasSize: this.canvasSize,
	    gameView:   this,
	    ctx:        this.ctx
	  });
	  this.defender     = this.game.defender;
	};

	GameView.prototype.restart = function() {
	  this.stop();
	  this.start();
	};

	GameView.prototype.welcome = function() {
	  this.ctx.fillStyle = '#000';
	  this.ctx.fillRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
	};

	GameView.prototype.pause = function() {
	  this.isPaused = true;
	};

	GameView.prototype.resume = function() {
	  this.isPaused = false;
	};

	GameView.prototype.gameOver = function() {
	  this.stop();

    document.getElementById('menu-container').className='hide';
    document.getElementById('menu-button').className='hide';

    var that = this;

	  setTimeout(function() {
	    that.ctx.clearRect(0, 0, that.DIM_X, that.DIM_Y);
	    that.ctx.fillStyle = '#000';
      that.ctx.fillRect(0, 0, that.game.DIM_X, that.game.DIM_Y);

      let gameOverImage  = document.getElementById('game-over'),
          finalScoreText  = document.getElementById('final-score'),
	        playGameButton = document.getElementById('play-game');
	    playGameButton.className = '';
      gameOverImage.className = '';
      finalScoreText.innerHTML = 'Congratulations!! You scored ' + that.finalScore + ' points!';
      finalScoreText.className = '';
	  }, 600);

	};

	GameView.prototype.addLivesText = function(ctx) {
	  let x = this.game.DIM_X * .87, y = this.game.DIM_Y * .05;

	  ctx.font = "23px GDS Transport";
	  ctx.fillText('LIVES: ' + this.game.defenderLives, x, y);
	};

	GameView.prototype.addMenu = function(ctx) {
	  let x = this.game.DIM_X * .5, y = this.game.DIM_Y * .1;
	};

	GameView.prototype.addScoreText = function(ctx) {
	  let x = this.game.DIM_X * .01, y = this.game.DIM_Y * .05;
	  ctx.fillText('SCORE: ' + this.game.score, x, y);
	};

	GameView.prototype.addLevelText = function(ctx) {
	  let x = this.game.DIM_X * .01, y = this.game.DIM_Y * .95;
	  ctx.fillText('LEVEL: ' + this.game.level, x, y);
	}

	GameView.prototype.addKeyListeners = function() {
	  document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
	  document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
	};

	GameView.prototype.handleKeyDown = function(e) {
    if (e.target.matches('textarea') || e.target.matches('input') || e.target.matches('button')) {
      return;
    }
	  if (e.keyCode === 37) {
      this.leftPressed = true;
      e.preventDefault();
	  } else if (e.keyCode === 39) {
	    this.rightPressed = true;
      e.preventDefault();
	  }

	  if (e.keyCode === 32) {
      this.spacePressed = true;
      e.preventDefault();
	  }
	};

	GameView.prototype.handleKeyUp = function(e) {
    if (e.target.matches('textarea') || e.target.matches('input') || e.target.matches('button')) {
      return;
    }
	  if (e.keyCode === 37) {
	    this.leftPressed = false;
	  } else if (e.keyCode === 39) {
	    this.rightPressed = false;
	  }

	  if (e.keyCode === 32) {
	    this.spacePressed = false;
	  }
	};

	GameView.prototype.moveDefender = function() {
	  if (this.leftPressed) {
	    this.defender.power([-3,0]);
	  } else if (this.rightPressed) {
	    this.defender.power([3,0]);
	  }

	  if (this.spacePressed) {
	    this.defender.fireBullet();
	  }
	};

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Ship = __webpack_require__(3);
	const Bullet = __webpack_require__(6);
	const Shield = __webpack_require__(10);
	const ShieldPiece = __webpack_require__(7);
	const Star = __webpack_require__(11);
	const PowerUp = __webpack_require__(9);
	const Util = __webpack_require__(5);

	const Game = function(options) {
	  this.canvasSize = options.canvasSize;
	  this.ctx = options.ctx;
	  this.stars = [];
	  this.defender = null;
	  this.defenderLives = 3;
	  this.score = 0;
	  this.level = 1;
	  this.invaderShips = [];
	  this.ufo = null;
	  this.bullets = [];
	  this.bulletId = 0;
	  this.shields = [];
	  this.shieldPieces = [];
	  this.powerUps = [];
	  this.gameView = options.gameView;

	  this.DIM_X = this.canvasSize[0];
	  this.DIM_Y = this.canvasSize[1];

	  this.addStars();
	  this.addDefenderShip();
	  this.addInvaderShips();
	  this.addShields();

	  this.gameView.addKeyListeners();
	};

	Game.BG_COLOR = "#000000";
	Game.NUM_STARS = 50;

	Game.prototype.randomPosition = function() {
	  return [
	    this.DIM_X * Math.random(),
	    this.DIM_Y * Math.random()
	  ];
	};

	Game.prototype.addStars = function() {
	  for (let i = 0; i < Game.NUM_STARS; i++) {
	    this.stars.push(new Star({
	      id: i,
	      color: "#ffffff",
	      pos: this.randomPosition(),
	      vel: Util.randomVec(.1),
	      game: this
	    }));
	  }
	};

	Game.prototype.addUfo = function(ctx) {
	  // Early return if a ufo is currently spawned
	  if (this.ufo) { return; }

	  let spawnUfoChance = Math.random() * 700;
	  let spawnPosition = Math.round(Math.random() * 10);
	  let vel, spawnIdx;

	  if (spawnPosition > 5) {
	    spawnIdx = 0;
	    vel = [2, 0];
	  } else {
	    spawnIdx = 1;
	    vel = [-2, 0];
	  }

	  let spawnPositions = [-30, 930];

	  if (spawnUfoChance < 1) {
	    let ufoImage = document.getElementById('ufo');
	    let ufoShip = new Ship ({
	      name: 'ufo',
	      game: this,
	      canvasSize: this.canvasSize,
	      img: ufoImage,
	      radius: 27,
	      pos: [spawnPositions[spawnIdx], 45],
	      vel: vel,
	      side: 'invader'
	    });

	    this.ufo = ufoShip;
	  }

	};

	Game.prototype.addInvaderShips = function(inLevel) {
    let level = inLevel || 1;
	  let invaderShipName, invaderShipImage;
	  let y = 100;
	  let invaderIdx = 0;
	  let vel = [0.27, 0];
	  vel[0] += 0.05 * level;

	  for (let row = 0; row < 5; row++) {
	    if (row < 1) {
	      invaderShipName = 'invader';
	      invaderShipImage = document.getElementById('invader-1');
	    } else if (row < 3) {
	      invaderShipName = 'soldier';
	      invaderShipImage = document.getElementById('soldier-1');
	    } else if (row > 2) {
	      invaderShipName = 'grunt';
	      invaderShipImage = document.getElementById('grunt-1');
	    }

	    for (let x = 1; x < 14; x++, invaderIdx++) {
	      let invaderShip = new Ship ({
	        id: invaderIdx,
	        name: invaderShipName,
	        game: this,
	        canvasSize: this.canvasSize,
	        img: invaderShipImage,
	        radius: 12,
	        pos: [
	          x * 35,
	          y
	        ],
	        vel: vel,
	        side: 'invader'
	      });
	      this.invaderShips.push(invaderShip);
	    }
	    y += 40;
	  }

	};

	Game.prototype.addShields = function() {
	  for (let i = 0, x = .05; i < 5; i++, x += 0.2) {
	    let shieldPosX = this.canvasSize[0] * x + 14;
	    let shieldPosY = this.canvasSize[1] * .8;

	    let shield = new Shield ({
	      id: i,
	      pos: [shieldPosX, shieldPosY],
	      radius: 7,
	      color: "#a0a09b",
	      game: this
	    });

	    shield.draw(this.ctx);
	  }
	};

	Game.prototype.refreshShields = function() {
	  this.shieldPieces = [];
	  this.shields = [];
	  this.addShields();
	};

	Game.prototype.addDefenderShip = function() {
	  const defender = new Ship ({
	    name: 'defender',
	    game: this,
	    canvasSize: this.canvasSize,
	    img: document.getElementById('defender'),
	    radius: 16,
	    pos: [
	      (this.canvasSize[0] - 30) * .52,
	      this.canvasSize[1] - 70
	    ],
	    vel: [0, 0],
	    side: 'defender'
	  });
	  this.defender = defender;
	};

	Game.prototype.getAllObjects = function() {
	  return [].concat(
	    this.ufo,
	    this.shieldPieces,
	    this.bullets,
	    this.stars,
	    this.powerUps
	  );
	};

	Game.prototype.moveObjects = function() {
	  this.getAllObjects().forEach(function(object) {
      if (object == null) { return; }
	    object.move();
	  });
	};

	Game.prototype.moveInvaders = function() {
	  this.invaderShips.forEach(function(ship) {
	    ship.move();
	  });
	};

	Game.prototype.toggleInvaders = function() {
	  this.invaderShips.forEach(function(ship) {
	    ship.toggleImage();
	  });
	};

	Game.prototype.reverseAllInvaders = function() {
	  this.invaderShips.forEach(function(invader) {
	    invader.reverse();
	  });
	};

	Game.prototype.wrap = function(pos) {
	  let x = pos[0], y = pos[1];
	  let maxX = this.DIM_X, maxY = this.DIM_Y;

	  let wrappedX = Util.wrap(x, maxX);
	  let wrappedY = Util.wrap(y, maxY);

	  return [wrappedX, wrappedY];
	};

	Game.prototype.draw = function(ctx) {
	  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
	  ctx.fillStyle = Game.BG_COLOR;
	  ctx.fillRect(0, 0, this.DIM_X, this.DIM_Y);

	  this.defender.draw(ctx);

	  this.getAllObjects().forEach(function(object) {
	    if (object == null) { return; }
	    object.draw(ctx);
	  });
	};

	Game.prototype.lose = function() {
	  this.gameView.pause();
	  this.gameView.addLivesText(this.ctx);
	  this.gameView.gameOver();
	};

	Game.prototype.winRound = function() {
	  if (this.invaderShips.length === 0) {
      var that = this;
	    setTimeout(function() {
	      if (that.invaderShips.length === 0) {
	        that.refreshShields();
	        that.level++;
	        that.defenderLives++;
	        that.addInvaderShips(that.level);
	      }
	    }, 1000);
	  }
	};

	Game.prototype.isOutOfBounds = function (pos) {
	  return (pos[0] < -50) || (pos[1] < 0) ||
	    (pos[0] > this.DIM_X + 50) || (pos[1] > this.DIM_Y);
	};

	Game.prototype.collisionObjects = function() {
	  return [].concat(
	    this.bullets,
	    this.invaderShips,
	    this.defender,
	    this.shieldPieces,
	    this.ufo,
	    this.powerUps
	  );
	};

	// This method makes enemy ships shoot bullets
	Game.prototype.enemyFire = function() {
	  // fireChance increases as the horde gets wiped out
	  let fireChance, invaderCount = this.invaderShips.length;
	  if (invaderCount < 10) {
	    fireChance = 500;
	  } else if (invaderCount < 25) {
	    fireChance = 1500;
	  } else if (invaderCount < 40) {
	    fireChance = 3000;
	  } else if (invaderCount < 50) {
	    fireChance = 4000;
	  } else {
	    fireChance = 5000;
	  }

	  this.invaderShips.forEach(function(invader) {
	    let fire = Math.random() * fireChance;
	    if (fire < 1) {
	      invader.fireBullet();
	      invader.currentBullet = false;
	    }
	  });

	  // Early return if ufo is not spawned
	  if (this.ufo == null) { return; }

	  let ufoFire = Math.random() * 1000;
	  if (ufoFire < 15) {
	    this.ufo.fireBullet();
	  }
	};

	// This method makes enemy ships move faster with each one that dies
	Game.prototype.increaseInvadersSpeed = function() {
	  this.invaderShips.forEach(function(invader) {
	    invader.increaseSpeed();
	  });
	};

	Game.prototype.checkCollisions = function() {
	  let collisionObjects = this.collisionObjects();
	  for (var i = 0; i < collisionObjects.length; i++) {
	    for (var j = 0; j < collisionObjects.length; j++) {

	      let object1 = collisionObjects[i];
	      let object2 = collisionObjects[j];

	      let options = {
	        ship: Ship,
	        bullet: Bullet,
	        shieldPiece: ShieldPiece,
	        powerUp: PowerUp,
	        object1: object1,
	        object2: object2
	      };

	      if (Util.validCollision(options)) {
	        if (object1.isCollidedWith(object2)) {
	          // collideWith handles logic for removing objects off of canvas
	          object1.collideWith(object2);
	        }
	      }

	    }
	  }
	};

	Game.prototype.currentDefenderBullet = function() {
	  this.bullets.forEach(function(bullet) {
	    if (bullet.ship.name === 'defender') return true;
	  });
	  return false;
	};

	Game.prototype.remove = function(object) {
	  if (object instanceof Bullet) {
	    object.removeBullet(object);
	  } else if (object instanceof Ship) {
	    if (object.name === 'ufo') {
	      this.ufo = null;
	      return;
	    }

	    object.removeShip(object);
	  } else if (object instanceof ShieldPiece) {
	    this.shieldPieces.splice(this.shieldPieces.indexOf(object), 1);
	  } else if (object instanceof PowerUp) {
	    this.powerUps.splice(this.powerUps.indexOf(object), 1);
	  }
	};

	Game.prototype.step = function() {
	  this.moveObjects();
	  this.checkCollisions();
	  this.enemyFire();
	  this.winRound();
	};

	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);
	const Bullet = __webpack_require__(6);
	const PowerUp = __webpack_require__(9);

	const Ship = function(inOptions) {
    let options = inOptions || { radius: 13 };
	  this.id = options.id;
	  this.name = options.name;
	  this.game = options.game;
	  this.canvasSize = options.canvasSize;
	  this.img = options.img;
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.side = options.side;
	  this.currentBullet = false;
	  this.isDead = false;
	  this.hasThreeGuns = false;
	  this.hasFiveGuns = false;
	  this.speedUp = false;
	  this.speedUp2 = false;
	  this.bulletsInPlay = [];

	  MovingObject.call(this, options);
	};

	Util.inherits(Ship, MovingObject);

	Ship.prototype.removeShip = function(shipToRemove) {
    var that = this;
	  this.game.invaderShips.forEach(function(ship) {
	    if (ship.id === shipToRemove.id) {
	      that.game.invaderShips = that.game.invaderShips.filter(function(s) {
          return s.id !== shipToRemove.id;
        });
	    }
	  });
	};

	Ship.prototype.draw = function(ctx) {
	  if (this.name === 'ufo') {
	    let x = this.pos[0] - 26;
	    let y = this.pos[1] - 3;
	    ctx.drawImage(this.img, x, y, 53, 30);
	    return;
	  }

	  // subtract from pos to align the image with the radius
	  let x = this.pos[0] - 12;
	  let y = this.pos[1] - 12;

	  if (this.name === 'defender') {
	    x -= 4;
	    y -= 4;
      ctx.drawImage(this.img, x, y, 33, 33);

      return;
	  }

    ctx.drawImage(this.img, x, y, 25, 25);
	};

	Ship.prototype.respawn = function() {
	  this.deathImage();

	  this.game.defenderLives -= 1;
	  this.hasThreeGuns = false;
	  this.hasFiveGuns = false;
	  this.speedUp = false;
	  this.speedUp2 = false;

	  if (this.game.defenderLives < 0) this.game.lose();
    this.game.gameView.pause();

    var that = this;

	  setTimeout(function() {
	    that.pos = [
	      (that.canvasSize[0] - 30) * .52,
	      that.canvasSize[1] - 70
	    ];
	    that.vel = [0,0];
	    that.img = document.getElementById('defender');
	    that.game.gameView.resume();
	  }, 600);

	};

	Ship.prototype.death = function() {
	  let deathSound;

	  if (this.name === 'defender') {
	    if (!this.game.gameView.isMuted) deathSound = '/public/javascript/games/invadersfromspace/sounds/defender_death.mp3';
	    this.respawn();
	  } else {
	    this.game.score += this.killScore();
	    this.game.increaseInvadersSpeed();
	    this.currentBullet = false;
	    this.isDead = true;
	    this.deathImage();

	    if (this.name === 'ufo') {
	      this.dropPowerUp(this.pos);
	      this.vel = [0,0];
	    }

      var that = this;

	    setTimeout(function() {
	      that.game.remove(that);
	    }, 200);

	    if (!this.game.gameView.isMuted) {
	      if (this.name === 'ufo') {
	        deathSound = '/public/javascript/games/invadersfromspace/sounds/ufo_death.wav';
	      } else {
	        deathSound = '/public/javascript/games/invadersfromspace/sounds/grunt_death.wav';
	      }
	    }
	  }

	  var sound = new Howl({
	    src: [deathSound],
	    volume: 0.5,
	  });

	  sound.play();
	};

	Ship.prototype.deathImage = function() {
	  if (this.name === 'defender') {
	    this.img = document.getElementById('defender-death');
	  } else {
	    this.img = document.getElementById('ship-death');
	  }
	  this.draw(this.game.ctx);
	};

	Ship.prototype.dropPowerUp = function(pos) {
	  const powerUp = new PowerUp({
	    vel: [0, 4],
	    pos: pos,
	    radius: 5,
	    color: '#ff00ff',
	    game: this.game,
	    ship: this,
	    ctx: this.game.ctx
	  });

	  this.game.powerUps.push(powerUp);
	};

	Ship.prototype.toggleImage = function() {
	  if (this.isDead) { return; }

	  if (this.name === 'grunt') {
	    let grunt1 = document.getElementById('grunt-1');
	    let grunt2 = document.getElementById('grunt-2');
	    this.img.id === 'grunt-1' ? this.img = grunt2 : this.img = grunt1;
	  } else if (this.name === 'soldier') {
	    let soldier1 = document.getElementById('soldier-1');
	    let soldier2 = document.getElementById('soldier-2');
	    this.img.id === 'soldier-1' ? this.img = soldier2 : this.img = soldier1;
	  } else if (this.name === 'invader') {
	    let invader1 = document.getElementById('invader-1');
	    let invader2 = document.getElementById('invader-2');
	    this.img.id === 'invader-1' ? this.img = invader2 : this.img = invader1;
	  }
	};

	Ship.prototype.killScore = function() {
	  if (this.name === 'grunt') {
	    return 10;
	  } else if (this.name === 'soldier') {
	    return 20;
	  } else if (this.name === 'invader') {
	    return 40;
	  } else if (this.name === 'ufo') {
	    let ufoPoints = [50, 100, 200, 300, 500];
	    let idx = Math.random() * 4;
	    idx = Math.round(idx);
	    return ufoPoints[idx];
	  }
	};

	Ship.prototype.collideWith = function(object) {
	  if (this.side === object.shipSide) return;

	  this.bulletsInPlay.shift();
	  if (this.bulletsInPlay.length === 0) this.currentBullet = false;

	  if (object.type === 'powerUp') {
	    if (this.name === 'defender') {
	      if (object.power === 'life') {
	        this.game.defenderLives++;
	      } else if (object.power === 'gun') {
	        if (this.hasThreeGuns) {
	          this.hasFiveGuns = true;
	        } else {
	          this.hasThreeGuns = true;
	        }
	      } else if (object.power === 'speed') {
	        if (this.speedUp) {
	          this.speedUp2 = true;
	        } else {
	          this.speedUp = true;
	        }
	      }
	    }
	  }
	};

	Ship.prototype.fireBullet = function() {
	  // Early return prevents player from spamming bullets, limiting
	  // the player to one bullet at a time
	  if (this.currentBullet) { return; }

	  let bulletPosX = this.pos[0] - 2;
	  let bulletPosY = this.pos[1] - 25;
	  let bulletColor;

	  let bulletVel;
	  if (this.name === 'defender') {
	    bulletVel = [0, -4];
	    bulletColor = "#FF00FF";
	  } else {
	    bulletVel = [0, 4];
	    bulletPosY += 30;
	  }

	  let bulletPos = [bulletPosX, bulletPosY];

	  if (this.name === 'grunt') {
	    bulletColor = "#a2d3f5";
	  } else if (this.name === 'soldier') {
	    bulletColor = "#fdfd67";
	  } else if (this.name === 'invader') {
	    bulletColor = "#ff884e";
	  } else if (this.name === 'ufo') {
	    bulletColor = "red";
	  }

	  if (this.hasFiveGuns) {
	    let bulletPositions = [
	      [bulletPosX, bulletPosY],
	      [bulletPosX - 8, bulletPosY +  8],
	      [bulletPosX + 8, bulletPosY +  8],
	      [bulletPosX - 14, bulletPosY + 16],
	      [bulletPosX + 14, bulletPosY + 16]
      ];

      var that = this;

	    bulletPositions.forEach(function(pos) {
	      let bullet = new Bullet({
	        id: that.game.bulletId,
	        vel: bulletVel,
	        pos: pos,
	        color: bulletColor,
	        game: that.game,
	        radius: 1,
	        shipName: that.name,
	        shipSide: that.side,
	        ship: that
	      });

	      that.game.bullets.push(bullet);
	      that.bulletsInPlay.push(bullet);
	      that.game.bulletId++;
	    });

	  } else if (this.hasThreeGuns) {
	    let bulletPositions = [
	      [bulletPosX, bulletPosY],
	      [bulletPosX - 8, bulletPosY +  8],
	      [bulletPosX + 8, bulletPosY +  8]
      ];

      var that = this;

	    bulletPositions.forEach(function(pos) {
	      let bullet = new Bullet({
	        id: that.game.bulletId,
	        vel: bulletVel,
	        pos: pos,
	        color: bulletColor,
	        game: that.game,
	        radius: 1,
	        shipName: that.name,
	        shipSide: that.side,
	        ship: that
	      });

	      that.game.bullets.push(bullet);
	      that.bulletsInPlay.push(bullet);
	      that.game.bulletId++;
	    });

	  } else {
	    let bullet = new Bullet({
	      id: this.game.bulletId,
	      vel: bulletVel,
	      pos: bulletPos,
	      color: bulletColor,
	      game: this.game,
	      radius: 1,
	      shipName: this.name,
	      shipSide: this.side,
	      ship: this
	    });

	    this.game.bullets.push(bullet);
	    this.bulletsInPlay.push(bullet);
	  }


	  if (!this.game.gameView.isMuted) {
	    let shootSound = '';
	    if (this.name === 'defender') {
	      shootSound = '/public/javascript/games/invadersfromspace/sounds/defender_gun2.wav';
	    } else if (this.name === 'ufo') {
	      shootSound = '/public/javascript/games/invadersfromspace/sounds/ufo_gun.wav';
	    } else {
	      shootSound = '/public/javascript/games/invadersfromspace/sounds/defender_gun.wav'
	    }

	    var sound = new Howl({
	      src: [shootSound],
	      volume: 0.3,
	    });

	    sound.play();
	  }

	    this.game.bulletId++;
	    this.currentBullet = true;
	};

	Ship.prototype.reverse = function() {
	  let newVel = Math.abs(this.vel[0]) + 0.02;
	  if (this.vel[0] > 0) {
	    newVel = 0 - newVel;
	    this.vel = [newVel, 0];
	    this.pos[0] -= 5;
	  } else {
	    this.vel = [newVel, 0];
	    this.pos[0] += 5;
	  }
	  this.pos[1] += 20;
	};

	Ship.prototype.increaseSpeed = function() {
	  let newVel = Math.abs(this.vel[0]) + 0.001;
	  if (this.vel[0] < 0) {
	    newVel = 0 - newVel;
	    this.vel = [newVel, 0];
	  } else {
	    this.vel = [newVel, 0];
	  }
	};

	Ship.prototype.move = function() {
	  if (this.name === 'ufo') {
	    if (this.game.isOutOfBounds(this.pos)){
	      this.game.remove(this);
	      return;
	    }

	    this.pos[0] += this.vel[0];
	    return;
	  }

	  // Player loses game if invaders move too close to the bottom
	  if (this.pos[1] > this.canvasSize[1] - 100) {
	    this.game.lose();
	  }

	  if (this.pos[0] > this.canvasSize[0] - 20) {
	    this.game.reverseAllInvaders();
	    } else if (this.pos[0] < 20) {
	    this.game.reverseAllInvaders();
	  } else {
	    this.pos[0] += this.vel[0];
	    this.pos[1] += this.vel[1];
	  }

	  this.draw(this.game.ctx);
	};

	Ship.prototype.power = function(impulse) {
	  if (this.speedUp) {
	    let speed = this.speedUp2 ? 8 : 5;
	    if (impulse[0] < 0) {
	      impulse[0] = -speed;
	    } else {
	      impulse[0] = speed;
	    }
	  }

	  if (this.pos[0] > this.canvasSize[0] - 20) {
	    if (impulse[0] > 0) {
	      return;
	    }
	  } else if (this.pos[0] < 20) {
	    if (impulse[0] < 0) {
	      return;
	    }
	  }

	  let xOffset = impulse[0];
	  this.pos[0] += xOffset;
	};

	module.exports = Ship;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(5);

	const MovingObject = function(options) {
	  this.color = options.color;
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.img = options.img;
	  this.game = options.game;
	  this.canvasSize = options.canvasSize;
	};

	MovingObject.prototype.draw = function(ctx) {
	  let x = this.pos[0];
	  let y = this.pos[1];

	  ctx.drawImage(this.img, x, y, 50, 30);
	};

	MovingObject.prototype.move = function() {
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];

	  if (this.game.isOutOfBounds(this.pos)) {
	    this.ship.bulletsInPlay.shift();
	    if (this.ship.bulletsInPlay.length === 0) {
	      this.ship.currentBullet = false;
	    }
	    this.game.remove(this);
	  }
	};

	MovingObject.prototype.collideWith = function(otherObject) {
	  // default do nothing
	};

	MovingObject.prototype.isCollidedWith = function(otherObject) {
	  let radiusSum = this.radius + otherObject.radius;
	  const centerDiff = Util.dist(this.pos, otherObject.pos);
	  return centerDiff < radiusSum;
	};

	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports) {

	const Util = {
	  inherits: function(child, parent) {
	    function Surrogate() {}
	    Surrogate.prototype = parent.prototype;
	    child.prototype = new Surrogate();
	    child.prototype.constructor = child;
	  },

	  randomVec: function(length) {
	    let deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },

	  scale: function(vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },

	  dist: function(pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },

	  wrap: function(coord, max) {
	    if (coord < 0) {
	      return max - (coord % max);
	    } else if (coord > max) {
	      return coord % max;
	    } else {
	      return coord;
	    }
	  },

	  validCollision: function(options) {
	    const Ship = options.ship;
	    const Bullet = options.bullet;
	    const ShieldPiece = options.shieldPiece;
	    const PowerUp = options.powerUp;

	    const object1 = options.object1;
	    const object2 = options.object2;

	    if (
	      (object1 instanceof Bullet && object2 instanceof Ship) ||
	      (object1 instanceof Ship && object2 instanceof Bullet) ||
	      (object1 instanceof Bullet && object2 instanceof ShieldPiece) ||
	      (object1 instanceof ShieldPiece && object2 instanceof Bullet)
	    ) { return true; }

	    if (object1 instanceof Ship && object2 instanceof PowerUp) {
	      if (object1.name === 'defender') { return true; }
	    } else if (object2 instanceof Ship && object1 instanceof PowerUp) {
	      if (object2.name === 'defender') { return true; }
	    }

	  }
	};

	module.exports = Util;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);
	const ShieldPiece = __webpack_require__(7);

	const Bullet = function(inOptions) {
    let options = inOptions || {};
	  this.id = options.id;
	  this.vel = options.vel;
	  this.pos = options.pos;
	  this.color = options.color;
	  this.radius = options.radius;
	  this.shipSide = options.shipSide;
	  this.ship = options.ship;

	  MovingObject.call(this, options);
	};

	Util.inherits(Bullet, MovingObject);

	Bullet.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;

	  ctx.fillRect(
	    this.pos[0],
	    this.pos[1],
	    4,
	    14
	  );
	};

	Bullet.prototype.removeBullet = function(bulletToRemove) {
    var that = this;
	  this.game.bullets.forEach(function(bullet) {
	    if (bullet.id === bulletToRemove.id) {
	      that.game.bullets = that.game.bullets.filter(function(b) {
          return b.id !== bulletToRemove.id;
        });
	    }
	  });
	};

	Bullet.prototype.collideWith = function(otherObject) {
	  this.ship.bulletsInPlay.shift();

	  if (this.ship.bulletsInPlay.length === 0) {
	    this.ship.currentBullet = false;
	  }

	  // prevents friendly fire
	  if (this.shipSide === otherObject.side) {
	    return;
	  }

	  if (otherObject instanceof ShieldPiece) {
	    this.game.remove(otherObject);
	  } else {
	    let otherShip = otherObject;
	    otherShip.death();
	  }

	  this.game.remove(this);
	};

	module.exports = Bullet;


/***/ },
/* 7 */
/***/ function(module, exports) {

	const ShieldPiece = function(options) {
	  this.id = options.id;
	  this.pos = options.pos;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.util = options.util;
	  this.game = options.game;
	};

	ShieldPiece.prototype.move = function() {
	  // default do nothing
	};

	ShieldPiece.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;

	  ctx.fillRect(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    this.radius
	  );
	};

	ShieldPiece.prototype.isCollidedWith = function(otherObject) {
	  let radiusSum = this.radius + otherObject.radius;
	  const centerDiff = this.util.dist(this.pos, otherObject.pos);
	  return centerDiff < radiusSum;
	};

	ShieldPiece.prototype.collideWith = function(otherObject) {
	  // default do nothing
	};

	module.exports = ShieldPiece;


/***/ },
/* 8 */
/***/ function(module, exports) {

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);

	const PowerUp = function(options) {
	  this.type = 'powerUp';
	  this.vel = options.vel;
	  this.pos = options.pos;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.game = options.game;
	  this.ship = options.ship;
	  this.ctx = options.ctx;
	  this.power = null;
	  this.spawned = false;

	  MovingObject.call(this, options);

	  this.spawn(this.ctx);
	};

	Util.inherits(PowerUp, MovingObject);

	PowerUp.prototype.spawn = function(ctx) {
	  let dropChance = Math.random() * 100;

	  if (dropChance < 50) {
      let rollPowers = Math.random() * 100;

	    if (rollPowers < 50) {
	      this.spawnGun();
	    } else {
	      this.spawnSpeed();
      }

      var that = this;

	    setTimeout(function() {
	      that.spawned = false;
	      that.game.remove(that);
	    }, 5000);
	  }

	};

	PowerUp.prototype.spawnGun = function() {
	  this.spawned = true;
	  this.color = "#FF00FF";
	  this.draw(this.ctx);
	  this.power = 'gun';
	};

	PowerUp.prototype.spawnSpeed = function() {
	  this.spawned = true;
	  this.color = "#ADD8E6";
	  this.draw(this.ctx);
	  this.power = 'speed';
	};

	PowerUp.prototype.spawnLife = function() {
	  this.spawned = true;
	  this.color = "#66CD00";
	  this.draw(this.ctx);
	  this.power = 'life';
	};

	PowerUp.prototype.collideWith = function(otherObject) {

	  if (this.type === 'powerUp') {
	    if (otherObject.name === 'defender') {
	      if (this.power === 'life') {
	        this.game.defenderLives++;
	      } else if (this.power === 'gun') {
	        this.ship.hasThreeGuns = true;
	      } else if (this.power === 'speed') {
	        this.ship.speedUp = true;
	      }
	    }
	  }

	  this.game.remove(this);
	};

	PowerUp.prototype.move = function() {
	  if (this.pos[1] >= this.game.DIM_Y - 70) {
	    return;
	  }

	  this.pos[1] += this.vel[1];
	};

	PowerUp.prototype.draw = function(ctx) {
	  if (!this.spawned) { return; }
	  ctx.fillStyle = this.color;

	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI
	  );
	  ctx.fill();
	};

	module.exports = PowerUp;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	const ShieldPiece = __webpack_require__(7);
	const Util = __webpack_require__(5);

	const Shield = function(options) {
	  this.id = options.id;
	  this.pos = options.pos;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.game = options.game;
	};

	Shield.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;
	  let posX = this.pos[0];
	  let posY = this.pos[1];

	  for (let i = 1; i < 21; i++) {
	    let shieldPiece = new ShieldPiece ({
	      id: i,
	      pos: [posX, posY],
	      radius: this.radius,
	      color: this.color,
	      util: Util,
	      game: this.game
	    });

	    shieldPiece.draw(ctx);
	    this.game.shieldPieces.push(shieldPiece);

	    if (i < 10) { posX += 7; }
	    else if (i === 10) { posY -= 7; }
	    else if (i < 20) { posX -= 7; }
	    else if (i === 20) { posY -= 7; }
	  }

	};

	module.exports = Shield;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(5);
	const MovingObject = __webpack_require__(4);

	const Star = function(inOptions) {
    let options = inOptions || {};
	  this.id = options.id;
	  this.color = "#ffffff";
	  this.radius = Math.random() * 1.5;
	  this.pos = options.pos || options.game.randomPosition();
	  this.vel = options.vel || Util.randomVec(50);
	  this.game = options.game;

	  MovingObject.call(this, options);
	};

	Util.inherits(Star, MovingObject);

	Star.prototype.move = function() {
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];

	  this.pos = this.game.wrap(this.pos);
	};

	Star.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI,
	    true
	  );
	  ctx.fill();
	};

	module.exports = Star;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
