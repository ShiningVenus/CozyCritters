import React, { useState } from 'react';
import { GameProps } from '@/types/game';
import { Button } from '@/components/ui/button';

const BOARD_SIZE = 8;

const pieceEmoji: Record<string, string> = {
  r: '🦊',
  n: '🦝',
  b: '🦉',
  q: '🦁',
  k: '🐻',
  p: '🐭',
  R: '🐰',
  N: '🦄',
  B: '🐼',
  Q: '🐱',
  K: '🐶',
  P: '🐹'
};

function createInitialBoard(): (string | null)[][] {
  return [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    Array(8).fill('p'),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill('P'),
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ];
}

function isWhite(piece: string | null) {
  return piece ? piece === piece.toUpperCase() : false;
}

export function AnimalChess({ onComplete, onExit, config }: GameProps) {
  const [board, setBoard] = useState<(string | null)[][]>(createInitialBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [player, setPlayer] = useState<'white' | 'black'>('white');

  const handleCellClick = (r: number, c: number) => {
    const piece = board[r][c];

    if (selected) {
      const [sr, sc] = selected;
      const movingPiece = board[sr][sc];
      const target = board[r][c];
      if (movingPiece && (target === null || isWhite(movingPiece) !== isWhite(target))) {
        const newBoard = board.map(row => [...row]);
        newBoard[r][c] = movingPiece;
        newBoard[sr][sc] = null;
        setBoard(newBoard);
        setPlayer(prev => (prev === 'white' ? 'black' : 'white'));
      }
      setSelected(null);
      return;
    }

    if (piece && ((player === 'white' && isWhite(piece)) || (player === 'black' && !isWhite(piece)))) {
      setSelected([r, c]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gradient-to-br from-slate-50 to-stone-50 dark:from-slate-900/20 dark:to-stone-900/20 rounded-2xl">
      <div className="text-center mb-4">
        <div className="text-2xl mb-2">{config.emoji}</div>
        <h2 className="text-xl font-bold text-foreground mb-2">{config.name}</h2>
        <p className="text-sm text-muted-foreground mb-2">{config.description}</p>
        <p className="text-sm text-muted-foreground">Current player: {player === 'white' ? '🐹' : '🐭'}</p>
      </div>
      <div className="grid grid-cols-8 gap-1 mb-6">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isDark = (r + c) % 2 === 1;
            const isSel = selected && selected[0] === r && selected[1] === c;
            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                aria-label={cell ? `piece ${cell}` : 'empty square'}
                className={`w-10 h-10 flex items-center justify-center text-xl rounded ${isDark ? 'bg-slate-300 dark:bg-slate-600' : 'bg-stone-200 dark:bg-stone-600'} ${isSel ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
              >
                {cell ? pieceEmoji[cell] : ''}
              </button>
            );
          })
        )}
      </div>
      <div className="flex gap-3">
        <Button
          onClick={() => onComplete?.({ completed: true, timeSpent: 0, moodImpact: 'calming' })}
          variant="outline"
        >
          Complete
        </Button>
        <Button onClick={onExit} variant="ghost">
          Exit
        </Button>
      </div>
    </div>
  );
}

