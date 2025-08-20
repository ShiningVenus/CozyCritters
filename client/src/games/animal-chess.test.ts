import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { performCpuMove } from '@/games/animal-chess';

test('performCpuMove makes a valid move for black and updates board', () => {
  const game = new Chess();
  game.move('e4');
  const before = game.fen();
  const move = performCpuMove(game);
  assert.ok(move, 'CPU should make a move');
  assert.notEqual(game.fen(), before, 'Board should change after CPU move');
  assert.equal(game.turn(), 'w', 'Turn should pass back to white');
});

test('performCpuMove returns null when no legal moves', () => {
  const game = new Chess('7k/5Q2/7K/8/8/8/8/8 b - - 0 1');
  const move = performCpuMove(game);
  assert.equal(move, null);
});
