var game = engineGame({ book: '/public/javascript/games/chess/book.bin' });

function newGame() {
  var baseTime = parseFloat($('#timeBase').val()) * 60;
  var inc = parseFloat($('#timeInc').val());
  var skill = $("input[name='skillLevel']:checked").val() || '10';
  var playerColour = $("input[name='playerColour']:checked").val() || 'white';
  var showScore = $('#showScore').is(':checked') || true;
  var contemptLevel = $('#contemptLevel').val();

  game.reset();
  game.setTime(baseTime, inc);
  game.setSkillLevel(parseInt(skill));
  game.setPlayerColor(playerColour);
  game.setDisplayScore(showScore);
  game.setContempt(contemptLevel);
  game.start();
}

function undo() {
  game.undo();
}

newGame();
