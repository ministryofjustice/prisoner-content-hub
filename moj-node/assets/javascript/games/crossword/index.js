var NUMBER_OF_WORDS = 25;
var SIZE_OF_GRID_X = 20;
var SIZE_OF_GRID_Y = 20;
var WORD_LIST = [
  { answer: 'mars', clue: 'Planet - A tasty treat' },
  { answer: 'crocodile', clue: 'Large aquatic reptile' },
  { answer: 'dog', clue: 'Man\'s best friend' },
  { answer: 'chicken', clue: 'Farmyard fowl' },
  { answer: 'horse', clue: 'Hungry as a _____' },
  { answer: 'llama', clue: 'Four legged animal from Peru' },
  { answer: 'beauty', clue: 'In the eye of the beholder' },
  { answer: 'dragon', clue: 'Mythical beast' },
  { answer: 'parrot', clue: 'Feathered mimic' },
  { answer: 'tarantula', clue: 'A type of large spider' },
  { answer: 'potting', clue: 'Putting plants in containers' },
  { answer: 'slipper', clue: 'Indoor footwear' },
  { answer: 'monkey', clue: 'Cheeky, long tailed primate' },
  { answer: 'helmet', clue: 'Protective headgear' },
  { answer: 'twist', clue: 'Late, unexpected change in a story' },
  { answer: 'elbow', clue: 'Arm joint' },
  { answer: 'elephant', clue: 'The largest of the land mammals' },
  { answer: 'incentive', clue: 'Motivation or encouragement to do something' },
  { answer: 'privilege', clue: 'A special right or advantage granted' },
  { answer: 'sleet', clue: 'Rain with ice' },
  { answer: 'treason', clue: 'Crime against the state' },
  { answer: 'salmon', clue: 'A fishy shade of pink' },
  { answer: 'pod', clue: 'Like peas in a ___' },
  { answer: 'suspect', clue: 'Believed guilty' },
  { answer: 'tattoo', clue: 'Design marked on the skin' },
  { answer: 'cat', clue: 'Feline - Popular pet' },
  { answer: 'fish', clue: 'Popular with chips' },
  { answer: 'sloth', clue: 'A slow tree dweller' },
  { answer: 'ant', clue: 'Tiny insect' },
  { answer: 'gorilla', clue: 'Large ape' },
  { answer: 'kiwi', clue: 'A fruity bird' },
  { answer: 'shark', clue: 'Large ocean predator' },
  { answer: 'kangaroo', clue: 'Australian mammal with a lot of bounce' },
  { answer: 'zebra', clue: 'It\'s black and white with this animal' },
  { answer: 'mouse', clue: 'As quiet as a _____' },
  { answer: 'mile', clue: 'A measure of distance' },
  { answer: 'octopus', clue: 'Eight legged sea creature' }
];

var directions = {
  ACROSS: 'across',
  DOWN: 'down'
};

function selectRandomEntriesFrom(array, amount) {
  var from = array.slice();
  var selected = [];
  for (var i = 0; i < amount; i++) {
    selected.push(from.splice(Math.floor(Math.random() * from.length), 1)[0]);
  }
  return selected
}

function WordGrid(listOfWords) {

  var words = [];
  var numberOfPlacedWords = 0;
  var grid = [];

  function createGrid() {
    var grid = [];
    for (var yPos = 0; yPos < SIZE_OF_GRID_Y; yPos++) {
      var row = [];
      for (var xPos = 0; xPos < SIZE_OF_GRID_X; xPos++) {
        row.push('');
      }
      grid.push(row);
    }
    return grid;
  }

  function placeWord(word, x, y, isVertical) {
    if (isVertical) {
      for (var yOffset = 0; yOffset < word.answer.length; yOffset++) {
        grid[y + yOffset][x] = word.answer[yOffset];
      }
    } else {
      for (var xOffset = 0; xOffset < word.answer.length; xOffset++) {
        grid[y][x + xOffset] = word.answer[xOffset];
      }
    }

    words.push({
      number: numberOfPlacedWords,
      direction: isVertical ? directions.DOWN : directions.ACROSS,
      row: y,
      column: x,
      clue: word.clue,
      answer: word.answer
    });

    numberOfPlacedWords++;
  }

  function addFirstWord(word) {
    var start = Math.floor(SIZE_OF_GRID_X / 2);
    var offset = Math.floor(word.answer.length / 2);
    var index = start - offset;
    if (index < 0) {
      return false;
    }
    placeWord(word, start, index, true);
    return true;
  }

  function getLettersFor(word) {
    var letters = [];
    var middleOfWord = Math.floor(word.length / 2) - 1;

    for (var i = 0; i < word.length; i++) {
      var offset;
      if (i % 2) {
        offset = Math.ceil(i / 2);
      } else {
        offset = i * -0.5;
      }

      var index = middleOfWord + offset;
      if (!word[index]) {
        index = word.length - 1;
      }
      letters.push({
        letter: word[index],
        index: index
      });
    }

    return letters;
  }

  function hasRowAbove(y, offset) {
    offset = offset || 1;
    if (grid[y - offset]) {
      return true;
    } else {
      return false;
    }
  }

  function hasRowBelow(y, offset) {
    offset = offset || 1;
    if (grid[y + offset]) {
      return true;
    } else {
      return false;
    }
  }

  function rowExists(y, yOffset) {
    yOffset = yOffset || 0;
    if (grid[y + yOffset]) {
      return true;
    } else {
      return false;
    }
  }

  function isEmptyAtPosition(x, y, xOffset, yOffset) {
    xOffset = xOffset || 0;
    yOffset = yOffset || 0;
    if (grid[y + yOffset][x + xOffset] === '') {
      return true;
    } else {
      return false;
    }
  }

  function hasLetterAtPosition(x, y, xOffset, yOffset, letter) {
    xOffset = xOffset || 0;
    yOffset = yOffset || 0;
    if (grid[y + yOffset][x + xOffset] === letter) {
      return true;
    } else {
      return false;
    }
  }


  function checkWordPosition(word, x, y, isVertical) {
    if (isVertical) {
      for (var i = -1; i < word.length + 1; i++) {
        if (!rowExists(y, i) || (!isEmptyAtPosition(x, y, null, i) && !hasLetterAtPosition(x, y, null, i, word[i])) ||
          ((!isEmptyAtPosition(x, y, 1, i) || !isEmptyAtPosition(x, y, -1, i)) && !hasLetterAtPosition(x, y, null, i, word[i]))) {
          return false;
        }
      }
    } else {
      1
      for (var i = -1; i < word.length + 1; i++) {
        if (!hasRowBelow(y) || !hasRowAbove(y) || (!isEmptyAtPosition(x, y, i) && !hasLetterAtPosition(x, y, i, null, word[i])) ||
          ((!isEmptyAtPosition(x, y, i, 1) || !isEmptyAtPosition(x, y, i, -1)) && !hasLetterAtPosition(x, y, i, null, word[i]))) {
          return false;
        }
      }
    }
    return true;
  }

  function fitWordByLetterPositionV(index, word, x, y) {
    var position;

    if ((!hasRowAbove(y) || isEmptyAtPosition(x, y, null, -1)) && (!hasRowBelow(y) || isEmptyAtPosition(x, y, null, 1))) {
      if (checkWordPosition(word, x, y - index, true)) {
        position = {
          x: x,
          y: y - index,
          isVertical: true
        };
      }
    }

    if ((!rowExists(y) || isEmptyAtPosition(x, y, -1)) && (!rowExists(y) || isEmptyAtPosition(x, y, 1))) {
      if (checkWordPosition(word, x - index, y)) {
        position = {
          x: x - index,
          y: y,
          isVertical: false
        };
      }
    }

    if (position) {
      return position;
    }
    return false;
  }

  function fitWordByLetterPositionH(index, word, x, y) {
    var position;

    if (isEmptyAtPosition(x, y, -1) && isEmptyAtPosition(x, y, 1)) {
      if (checkWordPosition(word, x - index, y)) {
        position = {
          x: x - index,
          y: y,
          isVertical: false
        };
      }
    }

    if (isEmptyAtPosition(x, y, null, -1) && isEmptyAtPosition(x, y, null)) {
      if (checkWordPosition(word, x, y - index, true)) {
        position = {
          x: x,
          y: y - index,
          isVertical: true
        };
      }
    }

    if (position) {
      return position;
    }
    return false;
  }

  function findLetterInRow(index, word, y) {
    for (var x = 0; x < grid[y].length; x++) {
      var cell = grid[y][x];
      if (cell === word[index]) {
        var position;
        position = fitWordByLetterPositionH(index, word, x, y);
        if (!position) {
          position = fitWordByLetterPositionV(index, word, x, y);
        }

        if (position) {
          return position;
        }
      }
    }
    return false;
  }

  function findPositionFor(letters, word) {
    var rows = [];

    for (var i = 0; i < SIZE_OF_GRID_Y; i++) {
      rows.push(i);
    }

    if (word.length % 2 !== 0) {
      rows.reverse();
    }

    for (var i = 0; i < rows.length; i++) {
      for (var j = 0; j < letters.length; j++) {
        var position = findLetterInRow(letters[j].index, word, rows[i]);
        if (position) {
          return position;
        }
      }
    }
  }

  function addWord(word) {
    var letters = getLettersFor(word.answer);
    var position = findPositionFor(letters, word.answer);

    if (position) {
      placeWord(word, position.x, position.y, position.isVertical);
      return true;
    }

    // console.warn('Crossword: could not place word "' + word.answer + '"');
    return false;
  }

  function sortWords(wordList) {
    wordList.sort(function (first, second) { return second.answer.length - first.answer.length; });
  }

  function addWords(wordList) {
    sortWords(wordList);
    addFirstWord(wordList.shift());

    var wordsChecked = 0;
    while (wordList.length) {
      if (wordsChecked === wordList.length) {
        break;
      }

      if (wordList[0].answer.length < 2) {
        wordList.shift();
        continue;
      }

      if (!addWord(wordList[0])) {
        wordList.splice(1, 0, wordList.shift());
        wordsChecked++;
      } else {
        wordList.shift();
        wordsChecked = 0;
      }
    }

    if (wordList.length) {
      console.warn('Crossword: Unable to place all words');
    }
  }

  grid = createGrid();
  addWords(listOfWords)

  return {
    renderGrid: function () {
      function padToTwo(number) {
        if (number <= 9999) { number = ("00" + number).slice(-2); }
        return number;
      }
      var rendered = '[ +]';
      for (var y = 0; y < grid.length; y++) {

        rendered += '[' + padToTwo(y) + ']';
      }
      rendered += '\n';
      for (var y = 0; y < grid.length; y++) {
        rendered += '[' + padToTwo(y) + ']';
        for (var x = 0; x < grid[y].length; x++) {
          rendered += grid[y][x] === '' ? '[  ]' : '[ ' + grid[y][x] + ']';
        }
        rendered += '\n';
      }
      return rendered;
    },
    getGrid: function () { return grid; },
    getWords: function () { return words; }

  };

}

function CrosswordGame(wordGrid) {

  var grid = wordGrid.getGrid();
  var words = wordGrid.getWords();
  var state = {
    selected: null
  };
  var gameBoard = $('#crossword-board');
  var clues = $('#crossword-clues');
  var cluesDown = $('#crossword-clues-down');
  var cluesAcross = $('#crossword-clues-across');

  function createSelected(number, direction) {
    return { number: number, direction: direction };
  };

  function findCellAtPosition(x, y) {
    return gameBoard.find('.crossword__row').eq(y).find('.crossword__cell').eq(x);
  }

  function findLetterAtPosition(x, y) {
    return findCellAtPosition(x, y).find('input');
  }

  function updateScore() {
    var numberOfSolvedClues = $('#crossword-clues .crossword__clue--correct').length;
    $('#crossword-score').text('Solved ' + numberOfSolvedClues + ' out of ' + words.length + ' clues');
    if (numberOfSolvedClues === words.length) {
      $('#crossword-notification').removeClass('visually-hidden');
    } else {
      $('#crossword-notification').addClass('visually-hidden');
    }
  }

  // TODO: REFACTOR THIS
  function checkWordFor(cell) {
    function branchingWordIsValidFor(cell, direction) {
      var number = $(cell).data(direction);
      var word = gameBoard.find('[data-' + direction + '=' + number + ']');
      var correct = 0;
      word.each(function (i, letter) {
        if ($(letter).val().toLowerCase() === $(letter).data('letter').toLowerCase()) {
          correct++;
        }
      });
      return correct === word.length;
    }

    function checkLettersFor(letter) {
      if ($(letter).is('[data-across]') && $(letter).is('[data-down]')) {
        return branchingWordIsValidFor(letter, directions.ACROSS) || branchingWordIsValidFor(letter, directions.DOWN);
      } else if ($(letter).is('[data-across]')) {
        return branchingWordIsValidFor(letter, directions.ACROSS);
      } else if ($(letter).is('[data-down]')) {
        return branchingWordIsValidFor(letter, directions.DOWN);
      }
    }

    if ($(cell).is('[data-across]')) {
      var number = $(cell).data('across');
      var word = gameBoard.find('[data-across=' + number + ']');
      var clue = clues.find('#crossword-clues-across li[data-number=' + number + ']');
      var correct = 0;
      word.each(function (i, letter) {
        if (checkLettersFor(letter)) {
          $(letter).addClass('crossword__cell__input--correct');
          correct++;
        } else {
          $(letter).removeClass('crossword__cell__input--correct');
        }
      });
      if (correct === word.length) {
        clue.addClass('crossword__clue--correct');
      } else {
        clue.removeClass('crossword__clue--correct');
      }
    }

    if ($(cell).is('[data-down]')) {
      var number = $(cell).data('down');
      var word = gameBoard.find('[data-down=' + number + ']');
      var clue = clues.find('#crossword-clues-down li[data-number=' + number + ']');
      var correct = 0;
      word.each(function (i, letter) {
        if (checkLettersFor(letter)) {
          $(letter).addClass('crossword__cell__input--correct');
          correct++;
        } else {
          $(letter).removeClass('crossword__cell__input--correct');
        }
      });
      if (correct === word.length) {
        clue.addClass('crossword__clue--correct');
      } else {
        clue.removeClass('crossword__clue--correct');
      }
    }

    updateScore();
  }

  function getNextLetter() {
    var direction = state.selected.direction;
    var number = state.selected.number;
    var word = gameBoard.find('[data-' + direction + '=' + number + ']');
    var length = word.length;
    var index = word.index(this);
    if (index < length - 1) {
      gameBoard.find('[data-' + direction + '=' + number + ']').eq(index + 1).focus();
    }
  }

  function getPreviousLetter() {
    var direction = state.selected.direction;
    var number = state.selected.number;
    var word = gameBoard.find('[data-' + direction + '=' + number + ']');
    var index = word.index(this);
    if (index > 0) {
      gameBoard.find('[data-' + direction + '=' + number + ']').eq(index - 1).focus();
    }
  }

  function createClueClickHandler(number, word) {
    return function clueClickHandler() {
      findLetterAtPosition(word.column, word.row).focus();
      state.selected = createSelected(number, word.direction);
      gameBoard.find('.crossword__cell__input').removeClass('crossword__cell__input--selected');
      gameBoard.find('[data-' + word.direction + '=' + number + ']').addClass('crossword__cell__input--selected');
      clues.find('.crossword__clue').removeClass('crossword__clue--selected');
      $(this).addClass('crossword__clue--selected');
      $('#crossword-clues-current').text('' + number + '. ' + $(this).text());
    }
  }

  function createClue(number, word) {
    var clue = $('<li class="crossword__clue">' + word.clue + '</li>');
    clue.attr('data-number', number);
    clue.attr('data-direction', word.direction);
    clue.attr('data-word-id', word.number);
    clue.val(number);
    clue.on('click', createClueClickHandler(number, word));
    return clue;
  }

  function createInputClickHandler(number, word) {
    return function inputClickHandler(e) {
      e.preventDefault();
      e.stopPropagation();
      $(this).focus();
      state.selected = createSelected(number, word.direction);
      gameBoard.find('.crossword__cell__input').removeClass('crossword__cell__input--selected');
      gameBoard.find('[data-' + word.direction + '=' + number + ']').addClass('crossword__cell__input--selected');
      clues.find('.crossword__clue').removeClass('crossword__clue--selected');
      var clue = clues.find('[data-word-id=' + word.number + ']');
      clue.addClass('crossword__clue--selected');
      $('#crossword-clues-current').text('' + number + '. ' + clue.text());
    }
  }

  function isTypeableCharacter(charCode) {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(charCode) > -1;
  }

  function createInputKeyDownHandler() {
    return function inputKeyDownHandler(e) {
      e.preventDefault();
      e.stopPropagation();
      var key = e.key.toUpperCase();

      if (key === 'BACKSPACE') {
        if ($(this).val().length > 0) {
          $(this).val('');
        } else {
          getPreviousLetter.call(this);
        }
      } else if (isTypeableCharacter(key)) {
        $(this).val(key);
        getNextLetter.call(this);
      }
    }
  }

  function addInputTo(cell, word, number, index) {
    if (cell.find('input').length === 0) {
      cell.append('<input class="crossword__cell__input" type="text" maxlength="1" />');
    }
    var input = cell.find('input');
    input.off('click').on('click', createInputClickHandler(number, word));
    input.off('blur').on('blur', function () { checkWordFor($(this)); })
    input.on('keydown', createInputKeyDownHandler(number, word));
    input.on('keyup', function () { checkWordFor(gameBoard.find('[data-' + word.direction + '=' + number + ']').eq(0)); });
    input.attr('data-' + word.direction, number);
    input.attr('data-' + word.direction + '-index', index);
    input.attr('data-letter', word.answer[index]);
  }

  function addLabelTo(cell, number) {
    var label = $('<span class="crossword__cell__label"></span>');
    label.text(number);
    label.appendTo(cell);
  }

  // build game grid;
  this.render = function () {

    gameBoard.empty();
    cluesAcross.empty();
    cluesDown.empty();
    $('#crossword-clues-current').text('Nothing selected');

    // render empty board
    for (var y = 0; y < grid.length; y++) {
      var row = $('<div class="crossword__row"></div>')
      for (var x = 0; x < grid[y].length; x++) {
        var cell = $('<div class="crossword__cell"></div>');
        cell.appendTo(row);
      }
      row.appendTo(gameBoard);
    }

    var down = [];
    var across = [];

    // add inputs and generate clues;
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var startOfWord = findCellAtPosition(word.column, word.row);
      var number;
      if (word.direction === directions.DOWN) {
        down.push(word);
        number = down.length;
      } else if (word.direction === directions.ACROSS) {
        across.push(word);
        number = across.length;
      }
      for (var j = 0; j < word.answer.length; j++) {
        var cell;
        if (word.direction === directions.DOWN) {
          cell = findCellAtPosition(word.column, word.row + j);
          addInputTo(cell, word, number, j);
        } else if (word.direction === directions.ACROSS) {
          cell = findCellAtPosition(word.column + j, word.row);
          addInputTo(cell, word, number, j);
        }
      }
    }

    // add labels to the start of each word
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var startOfWord = findCellAtPosition(word.column, word.row);
      number = startOfWord.find('input').data(word.direction);
      addLabelTo(startOfWord, number);
      startOfWord.off('click').on('click', createInputClickHandler(number, word));
    }

    // render down clues
    for (var j = 0; j < down.length; j++) {
      cluesDown.append(createClue(j + 1, down[j]));
    }

    // render across clues
    for (var j = 0; j < across.length; j++) {
      cluesAcross.append(createClue(j + 1, across[j]));
    }

    updateScore();
  }

  this.setupControls = function () {
    render = this.render.bind(this);
    $('#crossword-reset').on('click', function (e) {
      e.preventDefault();
      render();
    });
    $('#crossword-new-game').on('click', function (e) {
      e.preventDefault();
      var wg = new WordGrid(selectRandomEntriesFrom(WORD_LIST, NUMBER_OF_WORDS));
      grid = wg.getGrid();
      words = wg.getWords();
      render();
    });
  }

}

(function () {
  var wg = new WordGrid(selectRandomEntriesFrom(WORD_LIST, NUMBER_OF_WORDS));
  var game = new CrosswordGame(wg);
  game.render();
  game.setupControls();
})();
