
'use strict';

let empty = '*';
let red = '#';
let black = 'O';

let height = 5;
let width = 7;
let column = [];
for (let i = 0; i < height; ++i) {
  column.push(empty);
}
function makeBoard() {
  let ret= [];
  for (let i = 0; i < width; ++i) {
    ret.push(column.slice(0));
  }
  return ret;
}
let board;
let winner;
function resetState() {
  board = makeBoard();
  winner = empty;
}
resetState();

function output() {
  for (let y = height - 1; y >= 0; --y) {
    for (let x = 0; x < width; ++x) {
      //process.stdout.write(`(${x},${y})`); // for debugging
      process.stdout.write(board[x][y]);
    }
    console.log();
  }
  console.log('\n');
}

function won(player) {
  winner = player;
  output();
  console.log(`And the win goes to: ${player}!\n`);
}

// Less typing and automatic logical scoping
function isPlayer(player, x, y) {
  // False if we reference undefined
  if (void 0 === board[x]) {
    return false;
  }
  return board[x][y] === player;
}

// Check only from new input
function isWin(player, x, y) {
  // Check column
  let column = board[x];
  if (column[y - 1] === player &&
    column[y - 2] === player) {
    return true;
  }

  // Check row
  let left = isPlayer(player, x - 1, y);
  let right = isPlayer(player, x + 1, y);
  if (left) {
    if (isPlayer(player, x - 2, y) || right) {
      return true;
    }
  } else if (right && isPlayer(player, x + 2, y)) {
    return true;
  }

  // Check /
  let bottomLeft = isPlayer(player, x - 1, y - 1);
  let topRight = isPlayer(player, x + 1, y + 1);
  if (bottomLeft) {
    console.log(bottomLeft);
    if (isPlayer(player, x - 2, y - 2) || topRight) {
      return true;
    }
  } else if (topRight && isPlayer(player, x + 2, y + 2)) {
    return true;
  }

  // Check \
  let topLeft = isPlayer(player, x - 1, y + 1);
  let bottomRight = isPlayer(player, x + 1, y - 1);
  if (topLeft) {
    return isPlayer(player, x - 2, y + 2) || bottomRight;
  } else {
    return bottomRight && isPlayer(player, x + 2, y - 2);
  }
}

function play(player, x) {
  let column = board[x];
  for (let y = 0; y < height; ++y) {
    if (column[y] !== empty) {
      continue;
    }
    column[y] = player;
    return isWin(player, x, y) ? won(player) : output();
  }
  console.error('Invalid move, column is full');
}


// Test stuff
function assertWon(player) {
  const assert = require('assert');
  assert(winner === player, `Winner ${winner} != ${player}`)
}

play(red, 1);
play(red, 1);
play(black, 1);
play(red, 1);
play(red, 1);
play(red, 1);
assertWon(empty); // No one won

resetState();
play(red, 1);
play(red, 1);
assertWon(empty);
play(red, 1);
assertWon(red); // vertical

resetState();
play(red, 1);
play(red, 2);
play(black, 3);
assertWon(empty);
play(red, 0);
assertWon(red); // horozontal

resetState();
play(red, 1);
play(red, 2);
play(black, 3);
play(red, 3);
play(black, 4);
play(black, 4);
assertWon(empty);
play(red, 4);
assertWon(red); // Win like /

resetState();
play(red, 1);
play(black, 2);
play(black, 3);
play(red, 3);
play(red, 4);
play(black, 4);
assertWon(empty);
play(red, 5);
play(red, 5);
play(black, 5);
assertWon(black); // Win like \


