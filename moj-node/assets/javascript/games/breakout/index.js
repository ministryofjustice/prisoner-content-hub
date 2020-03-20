var gameCanvas = document.getElementById("gameCanvas");
    var ctx = gameCanvas.getContext("2d");
    var x = gameCanvas.width/2;
    var y = gameCanvas.height-30;
    var dx = 5;
    var dy = -5 ;
    var ballRadius = 10;
    var randomColor = getRandomColor();
    var paddleHeight = 10;
    var paddleWidth = 100;
    var paddleX = (gameCanvas.width-paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 3;
    var brickColumnCount = 5;
    var brickWidth = 90;
    var brickHeight = 40;
    var brickPadding = 15;
    var brickOffsetTop = 60;
    var brickOffsetLeft = 130;
    var score = 0;
    var lives = 3;
    var bricks = [];
    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
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
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = randomColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, gameCanvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection()

    if(x + dx > gameCanvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        randomColor = getRandomColor();
    }

    if(y + dy < ballRadius) {
        dy = -dy;
        randomColor = getRandomColor();
    }

    else if(y + dy > gameCanvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            }

    else {
    lives--;
        if(!lives) {
            alert("GAME OVER you scored " + score + " points" );
            document.location.reload();
            }
        else {
            x = gameCanvas.width/2;
            y = gameCanvas.height-30;
            dx = 5;
            dy = -5;
            paddleX = (gameCanvas.width-paddleWidth)/2;
            }
        }
    }

    if(rightPressed) {
        paddleX += 7;

    if (paddleX + paddleWidth > gameCanvas.width){
        paddleX = gameCanvas.width - paddleWidth;
        }
    }

    else if(leftPressed) {
        paddleX -= 7 ;

    if (paddleX < 0){
        paddleX = 0;
        }
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
              if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score ++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, gameCanvas.width-65, 20);
}

draw();
