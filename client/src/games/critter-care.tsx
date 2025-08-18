import React, { useState, useEffect, useRef } from 'react';
import { GameProps } from '@/types/game';
import { Button } from '@/components/ui/button';
import { EncouragementMessage } from '@/components/encouragement-message';
import { customMessageStore } from '@/lib/custom-message-store';

interface PetState {
  hunger: number;
  energy: number;
  happiness: number;
}

const STORAGE_KEY = 'critterCareState';

export function CritterCare({ onComplete, onExit, config }: GameProps) {
  const loadState = (): PetState => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          hunger: Math.min(100, Math.max(0, parsed.hunger ?? 80)),
          energy: Math.min(100, Math.max(0, parsed.energy ?? 80)),
          happiness: Math.min(100, Math.max(0, parsed.happiness ?? 80))
        };
      }
    } catch (e) {
      console.error('Failed to load critter state', e);
    }
    return { hunger: 80, energy: 80, happiness: 80 };
  };

  const [hunger, setHunger] = useState(() => loadState().hunger);
  const [energy, setEnergy] = useState(() => loadState().energy);
  const [happiness, setHappiness] = useState(() => loadState().happiness);
  const [completed, setCompleted] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const startTime = useRef(Date.now());

  // persist state
  useEffect(() => {
    const state: PetState = { hunger, energy, happiness };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hunger, energy, happiness]);

  // natural decay over time
  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => {
      setHunger(h => Math.max(0, h - 1));
      setEnergy(e => Math.max(0, e - 1));
      setHappiness(h => Math.max(0, h - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [completed]);

  // completion check
  useEffect(() => {
    if (completed) return;
    const balanced = hunger >= 60 && energy >= 60 && happiness >= 60;
    if (!balanced) return;

    const timer = setTimeout(() => {
      setCompleted(true);
      setShowMessage(true);
      onComplete?.({
        completed: true,
        timeSpent: Math.round((Date.now() - startTime.current) / 1000),
        moodImpact: 'positive'
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [hunger, energy, happiness, onComplete, completed]);

  const adjust = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(prev => Math.min(100, prev + 10));
  };

  const feed = () => adjust(setHunger);
  const play = () => adjust(setHappiness);
  const rest = () => adjust(setEnergy);

  const petEmoji = () => {
    if (happiness > 80) return '😸';
    if (happiness > 60) return '😺';
    if (happiness > 40) return '😿';
    return '🙀';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl">
      <div className="text-center mb-6">
        <div className="text-2xl mb-2">{config.emoji}</div>
        <h2 className="text-xl font-bold text-foreground mb-2">{config.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">{config.description}</p>
      </div>

      <div className="text-6xl mb-4" aria-live="polite">{petEmoji()}</div>

      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div>
          <p className="text-sm font-medium">Hunger</p>
          <p className="text-lg">{hunger}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Energy</p>
          <p className="text-lg">{energy}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Happiness</p>
          <p className="text-lg">{happiness}</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap justify-center mb-4">
        <Button onClick={feed} className="gap-2">
          🍖 Feed
        </Button>
        <Button onClick={play} variant="secondary" className="gap-2">
          🎮 Play
        </Button>
        <Button onClick={rest} variant="outline" className="gap-2">
          😴 Rest
        </Button>
        <Button onClick={onExit} variant="ghost">
          Exit
        </Button>
      </div>

      {showMessage && (
        <EncouragementMessage
          mood={{
            emoji: '🐾',
            mood: 'Balanced',
            message: customMessageStore.getRandomMessage(true)
          }}
          onAddToGarden={() => setShowMessage(false)}
        />
      )}
    </div>
  );
}

