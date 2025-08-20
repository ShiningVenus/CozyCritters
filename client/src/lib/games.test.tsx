import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import MiniGames from '@/pages/mini-games';
import { gameRegistry } from '@/lib/games';
import { GameResult } from '@/types/game';

// Verify the shape-match game is registered correctly

test('shape-match game registered under focus category', () => {
  const game = gameRegistry.getGame('shape-match');
  assert.ok(game, 'shape-match game should be registered');
  assert.equal(game!.config.category, 'focus');
});

// Verify zen-blocks game is registered correctly
test('zen-blocks game registered under calming category', () => {
  const game = gameRegistry.getGame('zen-blocks');
  assert.ok(game, 'zen-blocks game should be registered');
  assert.equal(game!.config.category, 'calming');
});

// Verify bubble-pop game is registered correctly
test('bubble-pop game registered under calming category', () => {
  const game = gameRegistry.getGame('bubble-pop');
  assert.ok(game, 'bubble-pop game should be registered');
  assert.equal(game!.config.category, 'calming');
});

// Verify animal-checkers game is registered correctly
test('animal-checkers game registered under focus category', () => {
  const game = gameRegistry.getGame('animal-checkers');
  assert.ok(game, 'animal-checkers game should be registered');
  assert.equal(game!.config.category, 'focus');
});

// Verify animal-chess game is registered correctly
test('animal-chess game registered under focus category', () => {
  const game = gameRegistry.getGame('animal-chess');
  assert.ok(game, 'animal-chess game should be registered');
  assert.equal(game!.config.category, 'focus');
});

// Verify MiniGames renders the shape-match card

test('MiniGames lists the Shape Match game', () => {
  const html = renderToString(<MiniGames onBack={() => {}} />);
  assert.ok(html.includes('Shape Match'));
});

// Verify completion handler logic
test('onComplete marks game as completed', () => {
  const game = gameRegistry.getGame('shape-match');
  let completed: string[] = [];
  const handleGameComplete = (result: GameResult) => {
    if (result.completed && game) {
      completed = [...completed, game.config.id];
    }
  };

  handleGameComplete({ completed: true, timeSpent: 1 });
  assert.deepEqual(completed, ['shape-match']);
});
