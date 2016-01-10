
'use strict';

let empty = '*';
let red = '#';
let black = 'O';

// TODO make this easily scalable
let height = 5;
let width = 7;
let column = [empty,empty,empty,empty,empty,];
let board = [column.slice(0),column.slice(0),column.slice(0),column.slice(0),column.slice(0),column.slice(0),column.slice(0),]

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

function play(player, x) {
	let column = board[x];
	for (let y = 0; y < height; ++y) {
		if (column[y] !== empty) {
			continue;
		}
		column[y] = player;
		return output();
	}
	console.error('Invalid move, column is full');
}

play(red, 1);
play(red, 1);
play(red, 1);
play(red, 1);
play(red, 1);
play(red, 1);
