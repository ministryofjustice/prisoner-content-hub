// var options = {
//     dimensions: { x: 20, y: 20 },
//     wordList: [
//         'hugh',
//         'pugh',
//         'barney',
//         'mcgrue',
//         'cuthbert',
//         'dibble',
//         'grub',
//         'windy',
//         'trumpton',
//         'television'
//     ]
// };

var options = {
  dimensions: { x: 20, y: 20 },
  wordList: [
    'elephant',
    'zebra',
    'parrot',
    'monkey',
    'dog',
    'cat',
    'octopus',
    'llama',
    'gorilla',
    'fish',
    'sloth'
  ]
};

function WordGrid(options) {

  var size = options.dimensions;
  var words = [];
  var numberOfPlacedWords = 0;
  var grid = [];

  function createGrid(dimensions) {
    var grid = [];
    for (var yPos = 0; yPos < dimensions.y; yPos++) {
      var row = [];
      for (var xPos = 0; xPos < dimensions.x; xPos++) {
        row.push('');
      }
      grid.push(row);
    }
    return grid;
  }

  function placeWord(word, x, y, isVertical) {
    if (isVertical) {
      for (var yOffset = 0; yOffset < word.length; yOffset++) {
        grid[y + yOffset][x] = word[yOffset];
      }
    } else {
      for (var xOffset = 0; xOffset < word.length; xOffset++) {
        grid[y][x + xOffset] = word[xOffset];
      }
    }

    numberOfPlacedWords++;

    var clue = 'figure it out';
    var hint = 'something esoteric';

    words.push({
      number: numberOfPlacedWords,
      direction: isVertical ? 'DOWN' : 'ACROSS',
      row: y,
      column: x,
      clue: clue,
      answer: word,
      hint: hint
    });
  }

  function addFirstWord(word) {
    var start = Math.floor(options.dimensions.x / 2);
    var offset = Math.floor(word.length / 2);
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
      console.log('No row above', y, offset);
      return false;
    }
  }

  function hasRowBelow(y, offset) {
    offset = offset || 1;
    if (grid[y + offset]) {
      return true;
    } else {
      console.log('No row below', y, offset);
      return false;
    }
  }

  function rowExists(y, yOffset) {
    yOffset = yOffset || 0;
    if (grid[y + yOffset]) {
      return true;
    } else {
      console.log('Row does not exist', y);
      return false;
    }
  }

  function isEmptyAtPosition(x, y, xOffset, yOffset) {
    xOffset = xOffset || 0;
    yOffset = yOffset || 0;
    if (grid[y + yOffset][x + xOffset] === '') {
      return true;
    } else {
      console.log('Cell not empty at position', x + xOffset, y + yOffset);
      return false;
    }
  }

  function hasLetterAtPosition(x, y, xOffset, yOffset, letter) {
    xOffset = xOffset || 0;
    yOffset = yOffset || 0;
    if (grid[y + yOffset][x + xOffset] === letter) {
      return true;
    } else {
      console.log('Letter mismatch at position', x + xOffset, y + yOffset, letter);
      return false;
    }
  }


  function checkWordPosition(word, x, y, isVertical) {
    console.log('Checking position', word, x, y)
    if (isVertical) {
      for (var i = -1; i < word.length + 1; i++) {
        console.log('checking', x, y + i);
        if (!rowExists(y, i) || (!isEmptyAtPosition(x, y, null, i) && !hasLetterAtPosition(x, y, null, i, word[i])) ||
          ((!isEmptyAtPosition(x, y, 1, i) || !isEmptyAtPosition(x, y, -1, i)) && !hasLetterAtPosition(x, y, null, i, word[i]))) {
          return false;
        }
      }
    } else {
      1
      for (var i = -1; i < word.length + 1; i++) {
        console.log('checking', x + i, y);
        if (!hasRowBelow(y) || !hasRowAbove(y) || (!isEmptyAtPosition(x, y, i) && !hasLetterAtPosition(x, y, i, null, word[i])) ||
          ((!isEmptyAtPosition(x, y, i, 1) || !isEmptyAtPosition(x, y, i, -1)) && !hasLetterAtPosition(x, y, i, null, word[i]))) {
          return false;
        }
      }
    }
    return true;
  }

  function fitWordByLetterPositionV(index, word, x, y) {
    console.log('vertical');
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
        console.log(word);
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
    console.log('Invalid position', word, x, y);
    return false;
  }

  function fitWordByLetterPositionH(index, word, x, y) {
    console.log('horizontal');
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
    console.log('Invalid position', word, x, y);
    return false;
  }

  function findLetterInRow(index, word, y) {
    for (var x = 0; x < grid[y].length; x++) {
      var cell = grid[y][x];
      if (cell === word[index]) {
        console.log('match!', cell, word, x, y, index);
        var position;
        // if (numberOfPlacedWords % 2) {
        //     position = fitWordByLetterPositionH(index, word, x, y);
        // } else {
        //     position = fitWordByLetterPositionV(index, word, x, y);
        // }
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

    for (var i = 0; i < size.y; i++) {
      rows.push(i);
    }

    if (word.length % 2 !== 0) {
      rows.reverse();
    }

    for (var r of rows) {
      for (var l of letters) {
        var position = findLetterInRow(l.index, word, r);
        if (position) {
          return position;
        }
      }
    }
  }

  function addWord(word) {
    var letters = getLettersFor(word);
    var position = findPositionFor(letters, word);

    if (position) {
      placeWord(word, position.x, position.y, position.isVertical);
      return true;
    }

    console.warn('Crossword: could not place word "' + word + '"');
    return false;
  }

  function sortWords(wordList) {
    wordList.sort(function (first, second) { return second.length - first.length; });
  }

  function addWords(wordList) {
    sortWords(wordList);
    console.log(wordList);
    addFirstWord(wordList.shift());

    var wordsChecked = 0;
    while (wordList.length) {
      if (wordsChecked === wordList.length) {
        break;
      }

      if (wordList[0].length < 2) {
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

  grid = createGrid(size);
  addWords(options.wordList)

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

var wg = new WordGrid(options);
console.log(wg.renderGrid());
console.log(wg.getWords());
