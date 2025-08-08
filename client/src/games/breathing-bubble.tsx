import React, { useState, useEffect, useRef } from 'react';
import { GameProps } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';

export function BreathingBubble({ onComplete, onExit, config }: GameProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [cycles, setCycles] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const startTime = useRef<number>(Date.now());

  const phaseDurations = {
    inhale: 4000,
    hold: 2000,
    exhale: 6000,
    rest: 1000
  };

  useEffect(() => {
    if (isActive) {
      const phaseTimer = setTimeout(() => {
        const nextPhases = {
          inhale: 'hold' as const,
          hold: 'exhale' as const,
          exhale: 'rest' as const,
          rest: 'inhale' as const
        };
        
        const nextPhase = nextPhases[phase];
        setPhase(nextPhase);
        
        if (nextPhase === 'inhale') {
          setCycles(prev => prev + 1);
        }
      }, phaseDurations[phase]);

      return () => clearTimeout(phaseTimer);
    }
  }, [isActive, phase]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(Date.now() - startTime.current);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    startTime.current = Date.now();
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleComplete = () => {
    setIsActive(false);
    onComplete?.({
      completed: true,
      timeSpent: Math.round(timeElapsed / 1000),
      moodImpact: 'calming'
    });
  };

  const getBubbleScale = () => {
    switch (phase) {
      case 'inhale': return 'scale-150';
      case 'hold': return 'scale-150';
      case 'exhale': return 'scale-75';
      case 'rest': return 'scale-75';
      default: return 'scale-100';
    }
  };

  const getInstructions = () => {
    switch (phase) {
      case 'inhale': return 'Breathe in slowly...';
      case 'hold': return 'Hold your breath...';
      case 'exhale': return 'Breathe out gently...';
      case 'rest': return 'Rest...';
      default: return 'Press play to start';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
      <div className="text-center mb-8">
        <div className="text-2xl mb-2">{config.emoji}</div>
        <h2 className="text-xl font-bold text-foreground mb-2">{config.name}</h2>
        <p className="text-sm text-muted-foreground">{config.description}</p>
      </div>

      {/* Breathing Bubble */}
      <div className="relative mb-8">
        <div
          className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-600 dark:to-purple-600 transition-transform duration-[4000ms] ease-in-out ${getBubbleScale()}`}
          style={{
            boxShadow: '0 0 50px rgba(59, 130, 246, 0.5)',
            transition: `transform ${phaseDurations[phase]}ms ease-in-out`
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">{cycles}</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <p className="text-lg font-medium text-foreground mb-2">
          {getInstructions()}
        </p>
        <p className="text-sm text-muted-foreground">
          Cycles completed: {cycles} • Time: {Math.round(timeElapsed / 1000)}s
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isActive ? (
          <Button onClick={handleStart} className="gap-2">
            <Play size={16} />
            Start
          </Button>
        ) : (
          <Button onClick={handlePause} variant="outline" className="gap-2">
            <Pause size={16} />
            Pause
          </Button>
        )}
        
        <Button 
          onClick={handleComplete} 
          variant="outline" 
          className="gap-2"
          disabled={cycles < 1}
        >
          <Square size={16} />
          Complete
        </Button>
        
        <Button onClick={onExit} variant="ghost">
          Exit
        </Button>
      </div>

      {cycles >= 3 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            ✨ Great job! You've completed {cycles} breathing cycles.
          </p>
        </div>
      )}
    </div>
  );
}