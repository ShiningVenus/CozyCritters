import React, { useState } from 'react';
import { GameProps } from '@/types/game';
import { Button } from '@/components/ui/button';

export type Piece = 'fox' | 'bunny';
const BOARD_SIZE = 8;

export type Move = {
  from: [number, number];
  to: [number, number];
};

export function getValidMoves(board: (Piece | null)[][], side: Piece): Move[] {
  const moves: Move[] = [];
  const dir = side === 'fox' ? 1 : -1;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== side) continue;
      const stepTargets: [number, number][] = [
        [r + dir, c + 1],
        [r + dir, c - 1]
      ];
      for (const [nr, nc] of stepTargets) {
        if (
          nr >= 0 &&
          nr < BOARD_SIZE &&
          nc >= 0 &&
          nc < BOARD_SIZE &&
          board[nr][nc] === null
        ) {
          moves.push({ from: [r, c], to: [nr, nc] });
        }
      }
      const captureTargets: [number, number][] = [
        [r + 2 * dir, c + 2],
        [r + 2 * dir, c - 2]
      ];
      for (const [nr, nc] of captureTargets) {
        const mr = (r + nr) / 2;
        const mc = (c + nc) / 2;
        if (
          nr >= 0 &&
          nr < BOARD_SIZE &&
          nc >= 0 &&
          nc < BOARD_SIZE &&
          board[nr][nc] === null
        ) {
          const middle = board[mr][mc];
          if (middle && middle !== side) {
            moves.push({ from: [r, c], to: [nr, nc] });
          }
        }
      }
    }
  }
  return moves;
}

export function performCpuMove(
  board: (Piece | null)[][],
  side: Piece
): (Piece | null)[][] {
  const moves = getValidMoves(board, side);
  if (moves.length === 0) return board;
  const choice = moves[Math.floor(Math.random() * moves.length)];
  const [sr, sc] = choice.from;
  const [r, c] = choice.to;
  const newBoard = board.map(row => [...row]);
  newBoard[r][c] = newBoard[sr][sc];
  newBoard[sr][sc] = null;
  if (Math.abs(r - sr) === 2) {
    const mr = (r + sr) / 2;
    const mc = (c + sc) / 2;
    newBoard[mr][mc] = null;
  }
  return newBoard;
}

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
  const cpu: Piece = 'bunny';

  const handleCellClick = (r: number, c: number) => {
    const cell = board[r][c];

    if (selected) {
      const [sr, sc] = selected;
      const moves = getValidMoves(board, player);
      const move = moves.find(
        m =>
          m.from[0] === sr &&
          m.from[1] === sc &&
          m.to[0] === r &&
          m.to[1] === c
      );
      if (board[r][c] === null && move) {
        const newBoard = board.map(row => [...row]);
        newBoard[r][c] = board[sr][sc];
        newBoard[sr][sc] = null;
        if (Math.abs(r - sr) === 2) {
          const mr = (r + sr) / 2;
          const mc = (c + sc) / 2;
          newBoard[mr][mc] = null;
        }
        const nextPlayer = player === 'fox' ? 'bunny' : 'fox';
        setBoard(newBoard);
        setPlayer(nextPlayer);
        if (nextPlayer === cpu) {
          const cpuBoard = performCpuMove(newBoard, cpu);
          setBoard(cpuBoard);
          setPlayer('fox');
        }
      }
      setSelected(null);
      return;
    }

    if (cell === player) {
      setSelected([r, c]);
    }
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

