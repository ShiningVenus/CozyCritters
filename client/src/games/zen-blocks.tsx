import React, { useEffect, useRef, useState } from 'react';
import { GameProps } from '@/types/game';
import { Button } from '@/components/ui/button';

const COLS = 10;
const ROWS = 20;

const createEmptyGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

export function ZenBlocks({ onComplete, onExit, config }: GameProps) {
  const [grid, setGrid] = useState<number[][]>(createEmptyGrid);
  const [piece, setPiece] = useState<{ x: number; y: number }>({
    x: Math.floor(COLS / 2),
    y: 0,
  });
  const [lines, setLines] = useState(0);
  const [startTime] = useState(Date.now());
  const audioCtxRef = useRef<AudioContext | null>(null);

  const canMove = (x: number, y: number) => {
    if (x < 0 || x >= COLS || y >= ROWS) return false;
    return !grid[y][x];
  };

  const playTone = (frequency: number) => {
    try {
      let ctx = audioCtxRef.current;
      if (!ctx) {
        ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = frequency;
      gain.gain.value = 0.05;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // ignore audio errors
    }
  };

  const spawnPiece = (g: number[][]) => {
    const startX = Math.floor(COLS / 2);
    if (g[0][startX]) {
      // board full - gently reset
      g = createEmptyGrid();
    }
    setGrid(g);
    setPiece({ x: startX, y: 0 });
  };

  const lockPiece = (x: number, y: number) => {
    const newGrid = grid.map((row) => [...row]);
    if (newGrid[y] && !newGrid[y][x]) {
      newGrid[y][x] = 1;
    } else {
      // spawning into filled space clears board
      spawnPiece(createEmptyGrid());
      return;
    }

    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newGrid[r].every((cell) => cell === 1)) {
        newGrid.splice(r, 1);
        newGrid.unshift(Array(COLS).fill(0));
        cleared++;
      }
    }
    if (cleared > 0) {
      playTone(440);
      setLines((l) => l + cleared);
    } else {
      playTone(220);
    }

    spawnPiece(newGrid);
  };

  const dropPiece = () => {
    setPiece((prev) => {
      if (canMove(prev.x, prev.y + 1)) {
        return { ...prev, y: prev.y + 1 };
      }
      lockPiece(prev.x, prev.y);
      return prev;
    });
  };

  useEffect(() => {
    const interval = setInterval(dropPiece, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && canMove(piece.x - 1, piece.y)) {
        setPiece((p) => ({ ...p, x: p.x - 1 }));
      } else if (e.key === 'ArrowRight' && canMove(piece.x + 1, piece.y)) {
        setPiece((p) => ({ ...p, x: p.x + 1 }));
      } else if (e.key === 'ArrowDown') {
        dropPiece();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [piece, grid]);

  const resetGame = () => {
    setGrid(createEmptyGrid());
    setLines(0);
    setPiece({ x: Math.floor(COLS / 2), y: 0 });
  };

  const endSession = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    onComplete?.({
      completed: true,
      score: lines,
      timeSpent,
      moodImpact: 'calming',
    });
  };

  const displayGrid = grid.map((row) => [...row]);
  if (piece.y >= 0 && piece.y < ROWS) {
    displayGrid[piece.y][piece.x] = 2;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl">
      <div className="text-center mb-4">
        <div className="text-2xl mb-2">{config.emoji}</div>
        <h2 className="text-xl font-bold text-foreground mb-2">{config.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">{config.description}</p>
        <div className="flex justify-center gap-4 text-sm">
          <span className="font-medium">Lines: {lines}</span>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-px bg-gray-300 dark:bg-gray-700 p-1 rounded">
        {displayGrid.flat().map((cell, idx) => (
          <div
            key={idx}
            className={`w-6 h-6 ${
              cell === 0
                ? 'bg-white dark:bg-gray-800'
                : cell === 1
                ? 'bg-purple-400 dark:bg-purple-600'
                : 'bg-purple-300 dark:bg-purple-500'
            }`}
          />
        ))}
      </div>

      <div className="flex gap-3 flex-wrap justify-center mt-6">
        <Button onClick={resetGame} variant="outline">
          Reset
        </Button>
        <Button onClick={endSession}>End Session</Button>
        <Button onClick={onExit} variant="ghost">
          Exit
        </Button>
      </div>
    </div>
  );
}

