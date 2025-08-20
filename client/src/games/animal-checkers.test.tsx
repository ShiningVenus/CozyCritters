import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getValidMoves, performCpuMove, Piece } from '@/games/animal-checkers';

function emptyBoard(): (Piece | null)[][] {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

test('getValidMoves returns diagonal moves for fox', () => {
  const board = emptyBoard();
  board[2][1] = 'fox';
  const moves = getValidMoves(board, 'fox');
  assert.deepEqual(moves, [
    { from: [2, 1], to: [3, 2] },
    { from: [2, 1], to: [3, 0] }
  ]);
});

test('getValidMoves includes capture moves', () => {
  const board = emptyBoard();
  board[2][1] = 'fox';
  board[3][2] = 'bunny';
  board[3][0] = 'bunny';
  const moves = getValidMoves(board, 'fox');
  assert.deepEqual(moves, [{ from: [2, 1], to: [4, 3] }]);
});

test('performCpuMove moves bunny piece', () => {
  const board = emptyBoard();
  board[5][2] = 'bunny';
  const original = Math.random;
  Math.random = () => 0; // choose first move deterministically
  const newBoard = performCpuMove(board, 'bunny');
  Math.random = original;
  assert.equal(newBoard[4][3], 'bunny');
  assert.equal(newBoard[5][2], null);
});
