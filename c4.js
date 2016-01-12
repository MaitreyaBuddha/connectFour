#!/usr/bin/env node
/**
 * Connect 4 simple functionality programming test
 *
 */

'use strict';

let empty = '*';
let red = '#';
let black = 'O';
let height = 5;
let width = 7;
function makeBoard() {
  let ret= [];
  let column = [];
  for (let i = 0; i < height; ++i) {
    column.push(empty);
  }
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

// Could use jsx for type of vector enforcement
// Also es6 destructuring when it's shipping
// Vector is [x,y]
function isVectorWin(player, x, y, v) {
  let vx = v[0];
  let vy = v[1];
  let count = 0;
  let rightish = 1; // We know our current spot has player
  let checkX = x + (rightish * vx);
  let checkY = y + (rightish * vy);
  while (isPlayer(player, checkX, checkY)) {
    rightish++;
    checkX = x + (rightish * vx);
    checkY = y + (rightish * vy);
    count++;
  }

  let leftish = 0;
  checkX = x + (leftish * vx);
  checkY = y + (leftish * vy);
  while (isPlayer(player, x - (leftish * vx), y - (leftish * vy))) {
    leftish++;
    checkX = x + (leftish * vx);
    checkY = y + (leftish * vy);
    count++;
  }

  return count >= 4;
}

// Check only from new input
function isWin(player, x, y) {
  // Check column
  // Leaving this ourside vectorWin because it's soooo simple
  let column = board[x];
  if (column[y - 1] === player &&
    column[y - 2] === player &&
    column[y - 3] === player  ) {
    return true;
  }

  // Check row
  if (isVectorWin(player, x, y, [1, 0])) {
    return true;
  }

  // Check /
  if (isVectorWin(player, x, y, [1, 1])) {
    return true;
  }

  // Check \
  if (isVectorWin(player, x, y, [-1, 1])) {
    return true;
  }

  return false;
}

function isWinFunAlternative(player, x, y) {
  for (let v of [[0,-1],[1,0],[1,1],[-1,1]]) {
    if (isVectorWin(player, x, y, v)) {
      return true;
    }
  }
  return false;
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

if (process.argv[2] === 'test') {
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
  play(red, 1);
  assertWon(empty);
  play(red, 1);
  assertWon(red); // vertical

  resetState();
  play(red, 0);
  play(red, 2);
  play(red, 3);
  play(red, 5);
  assertWon(empty);
  play(red, 4);
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
  play(black, 5);
  play(black, 5);
  play(black, 5);
  assertWon(empty);
  play(red, 5);
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
  play(red, 2);
  play(red, 2);
  play(black, 1);
  play(black, 1);
  play(red, 1);
  assertWon(red); // Win like \
} else {
  let readlineSync = require('readline-sync');

  let player = red;
  output();
  while (winner === empty) {
    let choice = readlineSync.questionInt(`Enter row (1-7) for player ${player}: `);
    if (choice < 1 || choice > 7) {
      console.log(`Invalid choice ${choice}.`)
      continue;
    }

    // grid is 0-based, we are 1-based, because that's easier on a keyboard
    play(player, choice - 1);
    if (player === red) {
      player = black;
    } else {
      player = red;
    }
  }
}

