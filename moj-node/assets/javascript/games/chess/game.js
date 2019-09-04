var game = engineGame({ book: '/public/javascript/games/chess/book.bin' });

function newGame() {
  var baseTime = parseFloat($('#timeBase').val()) * 60;
  var inc = parseFloat($('#timeInc').val());
  var skill = parseInt($("input[name='skillLevel']:checked").val() || '0');
  var playerColor = $('#playerColor').val();
  var showScore = $('#showScore').is(':checked') || true;
  var contemptLevel = 0; //$('#contemptLevel').val();

  game.reset();
  game.setTime(baseTime, inc);
  game.setSkillLevel(skill);
  game.setPlayerColor(playerColor);
  game.setDisplayScore(showScore);
  game.setContempt(contemptLevel);
  game.start();
}

function undo() {
  game.undo();
}

newGame();
