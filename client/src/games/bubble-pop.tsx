import React, { useState, useRef } from 'react';
import { GameProps } from '@/types/game';
import { Button } from '@/components/ui/button';

const POP_OSC_FREQUENCY = 440;

export function BubblePop({ onComplete, onExit, config }: GameProps) {
  const gridSize = 5;
  const totalBubbles = gridSize * gridSize;
  const [bubbles, setBubbles] = useState<boolean[]>(Array(totalBubbles).fill(false));
  const startTime = useRef(Date.now());
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playPop = () => {
    try {
        let ctx = audioCtxRef.current;
        if (!ctx) {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          ctx = new AudioCtx();
          audioCtxRef.current = ctx;
        }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = POP_OSC_FREQUENCY;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // ignore audio errors
    }
  };

  const handlePop = (index: number) => {
    setBubbles(prev => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      playPop();
      if (next.every(Boolean)) {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        onComplete?.({ completed: true, timeSpent, moodImpact: 'calming' });
      }
      return next;
    });
  };

  const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePop(index);
    }
  };

  const poppedCount = bubbles.filter(Boolean).length;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-2xl">
      <div className="text-center mb-4">
        <div className="text-2xl mb-2">{config.emoji}</div>
        <h2 className="text-xl font-bold text-foreground mb-2">{config.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">{config.description}</p>
        <p className="text-sm text-muted-foreground">Bubbles popped: {poppedCount}</p>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-6">
        {bubbles.map((isPopped, i) => (
          <button
            key={i}
            aria-label={isPopped ? 'Popped bubble' : 'Bubble'}
            onClick={() => handlePop(i)}
            onKeyDown={(e) => handleKey(e, i)}
            disabled={isPopped}
            className={`w-12 h-12 rounded-full bg-sky-200 dark:bg-sky-600 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 dark:focus:ring-sky-400 ${isPopped ? 'scale-75 opacity-50' : 'active:scale-90'}`}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => {
            const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
            onComplete?.({ completed: true, timeSpent, moodImpact: 'calming' });
          }}
          variant="outline"
          disabled={poppedCount === 0}
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

