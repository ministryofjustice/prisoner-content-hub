var ctx = initCanvas();
var canvas;
var lives = 0;
var gameState = "attract";
var score = 0;
var highScore = 0;
var level = 1;
var numRocks = 2;
var explodingCount = 0;
var thumpLow;
var thumpDelay = 1000;
var timer;

initHighScore();
createRocks();
initKeyboard();
runGame();

function initHighScore() {
    var previousHighScore = window.localStorage.getItem('neontroids.highscore');
    if (previousHighScore) {
        highScore = previousHighScore;
    }
}

function initCanvas() {
    canvas = document.getElementById("canvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight - 96;
    return canvas.getContext("2d");
}

function startGame() {
    actors = [];
    gameState = "playing";
    lives = 3;
    numRocks = 4;
    score = 0;
    level = 1;
    saucer = null;
    createShip();
    createRocks();
    totalFrameCount = 0;
    thumpLow = true;
    playThumps();
}

function playThumps() {
    timer = setTimeout(function () {
        thumpLow ? playSound('thumpLow') : playSound('thumpHigh');
        thumpLow = !thumpLow;
        thumpDelay -= 15;
        console.log(thumpDelay);
        if (thumpDelay < 200) {
            thumpDelay = 200;
        }
        playThumps();
    }, thumpDelay);
}

function createRocks() {
    for (var i = 0; i < numRocks; i++) {
        var rock = new RockSprite(0, 0, 0);
        actors.push(rock);
    }
}

function createShip() {
    keyPressed = {};
    ship = new ShipSprite(canvas.width / 2, canvas.height / 2);
    actors.push(ship);
}

function createSaucer() {
    if ((totalFrameCount % 1200 === 0) && (!saucer) && (gameState === 'playing')) {
        var size = level === 1 ? 0 : Math.random() < 0.80 ? 0 : 1;
        size === 0 ? startSound('largeSaucer') : startSound('smallSaucer');
        saucer = new Saucer(0, Math.random() * canvas.height, size);
        actors.push(saucer);
    }
}

function runGame() {
    requestAnimationFrame(runGame);
    clearScreen();
    checkKeyboardInput();
    moveAndRenderActors();
    checkCollisions();
    checkForEndOfGame();
    displayText();
    createSaucer();
}

function clearScreen() {
    ctx.color = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function moveAndRenderActors() {
    actors.forEach(function (actor) {
        actor.move();
        drawPolygon(actor.sprite.polygon, actor.sprite.x, actor.sprite.y);
    });
}

function levelUp() {
    numRocks++;
    level++;
    createRocks();
    thumpDelay = 1000;
}

function checkForEndOfGame() {
    if (gameState === "exploding") {
        explodingCount += 1;
        if (explodingCount > 150) {
            gameState = 'playing';
            createShip();
        }
    }

    if ((gameState === 'playing') && (lives <= 0)) {
        clearTimeout(timer);
        gameState = "attract";
        removeSprite(actors, ship);
        if (score > highScore) {
            highScore = score;
            window.localStorage.setItem('neontroids.highscore', highScore);
        }
    }
}
