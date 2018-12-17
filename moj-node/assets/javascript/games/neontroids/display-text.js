var frameCount = 0;
var frameRate = 0;
var elapsedTime = 0;
var oldTime = Date.now();
var totalFrameCount = 0;

function displayText() {
    displayFps();
    displayAttractMessage();
    displayScore();
    displayLives();
}

function displayFps() {
    elapsedTime += Date.now() - oldTime;
    if (elapsedTime > 1000) {
        elapsedTime = 0;
        frameRate = frameCount;
        frameCount = -1;
    }

    ctx.fillStyle = "white";
    ctx.font = "8px Arial";
    var text = frameRate + " fps";
    var textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (canvas.width / 2) - textWidth / 2, canvas.height);
    oldTime = Date.now();
    frameCount++;
    totalFrameCount++;
}

function displayAttractMessage() {
    if (gameState === "attract") {
        setColor('white');
        ctx.fillStyle = "#DDDDFF";
        ctx.font = "100px Verdana";
        var text = "Neontroids";
        ctx.shadowColor = '#0000FF';

        for (var j = 1; j < 6; j++) {
            ctx.shadowBlur = j * 27;
            ctx.fillText(text, (canvas.width / 2) - ctx.measureText(text).width / 2, canvas.height / 2 - 50);
        }

        ctx.fillStyle = "yellow";
        ctx.font = "25px Verdana";
        var text2 = "Click the mouse or press any key to play";
        ctx.fillText(text2, (canvas.width / 2) - ctx.measureText(text2).width / 2, (canvas.height / 2) + 20);

        ctx.fillStyle = "#cccccc";
        ctx.font = "15px Verdana";
        var text3 = "Cursor keys to move, Space to fire";
        ctx.fillText(text3, (canvas.width / 2) - ctx.measureText(text3).width / 2, (canvas.height / 2) + 60);

        ctx.font = "15px Verdana";
        var text4 = "or Z & X to rotate, N fire, M thrust";
        ctx.fillText(text4, (canvas.width / 2) - ctx.measureText(text4).width / 2, (canvas.height / 2) + 80);
    }
}

function displayScore() {
    setColor('yellow');
    ctx.font = "18px Verdana";
    var text = "Score: " + score;
    ctx.fillText(text, 5, 18);

    setColor('aqua');
    text = "High Score: " + highScore;
    var textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (canvas.width / 2) - textWidth / 2, 18);
}

function displayLives() {
    setColor('fuchsia');
    ctx.font = "18px Verdana";
    var text = "Lives: " + lives;
    ctx.fillText(text, canvas.width - ctx.measureText(text).width - 5, 18);
}

function setColor(color) {
    ctx.fillStyle = color;
    ctx.shadowColor = "#0000ff";
}
