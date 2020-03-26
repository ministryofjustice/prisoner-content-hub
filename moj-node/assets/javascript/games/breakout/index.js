var gameCanvas = document.getElementById("gameCanvas");
var ctx = gameCanvas.getContext("2d");
var x = gameCanvas.width/2;
var y = gameCanvas.height-30;
var dx = 5;
var dy = -5;
var ballStatic = false;
var ballRadius = 10;
var randomColor = getRandomColor();
var blockColor = ["#d4351c", 	"#ffdd00", "#00703c", "#1d70b8", "#003078",  "#5694ca", "#4c2c92"];
var paddleHeight = 10;
var paddleWidth = 100;
var paddleX = (gameCanvas.width-paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var spaceBarPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 40;
var brickHeight = 40;
var brickPadding = 50;
var brickOffsetTop = 60;
var brickOffsetLeft = 150;
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
    ctx.fillStyle = "#1d70b8";
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
                ctx.fillStyle = getRandomColor();
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

    if(score == brickRowCount*brickColumnCount) {
      winGame();
      return
    }

    if(x + dx > gameCanvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        randomColor = getRandomColor();
    }

    if(y + dy < ballRadius) {
        dy = -dy;
        randomColor = getRandomColor();
    }

    else if (y + dy > gameCanvas.height - ballRadius - paddleHeight){
      if(x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius){
          dy = -dy;
      }
      else {
          lives --;
          if(!lives){
            loseGame()
            return
          }

          else {
            x = paddleX + (paddleWidth / 2);
            y = gameCanvas.height - paddleHeight - ballRadius - 0;
            dx = 0;
            dy = 0;
            ballStatic = true;
          }
        }
      }

    if(rightPressed && ballStatic) {
        paddleX += 7;
        x = paddleX + (paddleWidth / 2);
        }

    if(rightPressed && !ballStatic) {
        paddleX += 7;
        }

    if (paddleX + paddleWidth > gameCanvas.width){
        paddleX = gameCanvas.width - paddleWidth;
        }


    else if(leftPressed && ballStatic) {
        paddleX -= 7;
        x = paddleX + (paddleWidth / 2);
        }

    if(leftPressed && !ballStatic) {
        paddleX -= 7;
        }

    if (paddleX < 0){
        paddleX = 0;
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

    else if(e.key == " " && ballStatic == true) {
      dx = -5;
      dy = 5;
      ballStatic = false;
    }

    e.preventDefault();

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
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "	#0b0c0c";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "	#0b0c0c";
    ctx.fillText("Lives: "+lives, gameCanvas.width-80, 20);
}

function loseGame() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.fillStyle = "#1d70b8";
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.fillStyle = "white";
  ctx.font = "bold 40px Arial";
  ctx.fillText("Game over you scored " + score + " points" , 100 , gameCanvas.height / 2);
  ctx.fillText("Press return to restart the game" , 100 , 380);

  document.addEventListener('keyup', function(e){
    if(e.keyCode == 13)
    document.location.reload();
    requestAnimationFrame();
  })
}

function winGame() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.fillStyle = "#1d70b8";
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.fillStyle = "white";
  ctx.font = "bold 40px Arial";
  ctx.fillText("Smashed it!!! you win!!" , 100 , gameCanvas.height / 2);
  ctx.fillText("Press return to start a new game" , 100 , 380);

  document.addEventListener('keyup', function(e){
    if(e.keyCode == 13)
    document.location.reload();
    requestAnimationFrame();
  })

}

draw();
