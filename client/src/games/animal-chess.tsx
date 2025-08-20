import React, { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { GameProps } from '@/types/game';
import { Button } from '@/components/ui/button';

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

function indexToSquare(r: number, c: number) {
  const files = 'abcdefgh';
  return `${files[c]}${8 - r}`;
}

function boardFromGame(game: Chess): (string | null)[][] {
  const b = game.board() as unknown as Array<Array<{ type: string; color: 'w' | 'b' } | null>>;
  return b.map(row =>
    row.map(cell => (cell ? (cell.color === 'w' ? cell.type.toUpperCase() : cell.type) : null))
  );
}

export function performCpuMove(game: Chess): string | null {
  if (game.turn() !== 'b') return null;
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;
  const move = moves[Math.floor(Math.random() * moves.length)];
  game.move(move.san);
  return move.san;
}

export function AnimalChess({ onComplete, onExit, config }: GameProps) {
  const [chess] = useState(() => new Chess());
  const [board, setBoard] = useState<(string | null)[][]>(() => boardFromGame(chess));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [player, setPlayer] = useState<'white' | 'black'>('white');

  const handleCellClick = (r: number, c: number) => {
    if (player !== 'white') return;
    const square = indexToSquare(r, c);
    const piece = chess.get(square);

    if (selected) {
      const from = indexToSquare(selected[0], selected[1]);
      const move = chess.move({ from, to: square });
      setSelected(null);
      if (move) {
        setBoard(boardFromGame(chess));
        setPlayer('black');
      }
      return;
    }

    if (piece && piece.color === 'w' && chess.turn() === 'w') {
      setSelected([r, c]);
    }
  };

  useEffect(() => {
    if (player === 'black') {
      performCpuMove(chess);
      setBoard(boardFromGame(chess));
      setPlayer('white');
    }
  }, [player, chess]);

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

