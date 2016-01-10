
'use strict';

let empty = '*';
let red = '#';
let black = 'O';

// TODO make this easily scalable
let height = 5;
let width = 7;
let column = [empty,empty,empty,empty,empty,];
function makeBoard() {
	return [column.slice(0),column.slice(0),column.slice(0),column.slice(0),column.slice(0),column.slice(0),column.slice(0),];	
}
let board = makeBoard();
let winner;

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
		return isPlayer(player, x - 2, y) || right;
	} else {
		return right && isPlayer(player, x + 2, y);
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
play(red, 1);
play(red, 1);
play(black, 1);
play(red, 1);
play(red, 1);
play(red, 1);
assertWon();	// No one won

board = makeBoard();
play(red, 1);
play(red, 2);
play(black, 3);
play(red, 0);
play(red, 3);
assertWon(red);
