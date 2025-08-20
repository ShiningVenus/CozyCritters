import React, { useState } from 'react';
import { GameProps } from '@/types/game';
import { Button } from '@/components/ui/button';

type Piece = 'fox' | 'bunny';
const BOARD_SIZE = 8;

const pieceEmoji: Record<Piece, string> = {
  fox: '🦊',
  bunny: '🐰'
};

function createInitialBoard(): (Piece | null)[][] {
  return Array.from({ length: BOARD_SIZE }, (_, r) =>
    Array.from({ length: BOARD_SIZE }, (_, c) => {
      if (r < 3 && (r + c) % 2 === 1) return 'fox';
      if (r > 4 && (r + c) % 2 === 1) return 'bunny';
      return null;
    })
  );
}

export function AnimalCheckers({ onComplete, onExit, config }: GameProps) {
  const [board, setBoard] = useState<(Piece | null)[][]>(createInitialBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [player, setPlayer] = useState<Piece>('fox');

  const handleCellClick = (r: number, c: number) => {
    const cell = board[r][c];

    if (selected) {
      const [sr, sc] = selected;
      if (board[r][c] === null && isValidMove(sr, sc, r, c)) {
        const newBoard = board.map(row => [...row]);
        newBoard[r][c] = board[sr][sc];
        newBoard[sr][sc] = null;
        if (Math.abs(r - sr) === 2) {
          const mr = (r + sr) / 2;
          const mc = (c + sc) / 2;
          newBoard[mr][mc] = null;
        }
        setBoard(newBoard);
        setPlayer(prev => (prev === 'fox' ? 'bunny' : 'fox'));
      }
      setSelected(null);
      return;
    }

    if (cell === player) {
      setSelected([r, c]);
    }
  };

  const isValidMove = (sr: number, sc: number, r: number, c: number) => {
    const dir = player === 'fox' ? 1 : -1;
    const dr = r - sr;
    const dc = c - sc;

    if (dr === dir && Math.abs(dc) === 1) return true;
    if (dr === 2 * dir && Math.abs(dc) === 2) {
      const mr = sr + dir;
      const mc = sc + dc / 2;
      const middle = board[mr][mc];
      if (middle && middle !== player) return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gradient-to-br from-amber-50 to-lime-50 dark:from-amber-900/20 dark:to-lime-900/20 rounded-2xl">
      <div className="text-center mb-4">
        <div className="text-2xl mb-2">{config.emoji}</div>
        <h2 className="text-xl font-bold text-foreground mb-2">{config.name}</h2>
        <p className="text-sm text-muted-foreground mb-2">{config.description}</p>
        <p className="text-sm text-muted-foreground">Current player: {pieceEmoji[player]}</p>
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
                aria-label={cell ? `${cell} piece` : 'empty square'}
                className={`w-10 h-10 flex items-center justify-center text-xl rounded ${isDark ? 'bg-amber-200 dark:bg-amber-600' : 'bg-lime-200 dark:bg-lime-600'} ${isSel ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
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

