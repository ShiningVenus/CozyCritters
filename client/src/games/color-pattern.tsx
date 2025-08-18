import React, { useState, useEffect } from 'react';
import { GameProps } from '@/types/game';
import { Button } from '@/components/ui/button';
import { RotateCcw, Square } from 'lucide-react';

const COLORS = [
  { name: 'Sky Blue', value: 'bg-sky-300 dark:bg-sky-600', border: 'border-sky-400' },
  { name: 'Sage Green', value: 'bg-green-300 dark:bg-green-600', border: 'border-green-400' },
  { name: 'Lavender', value: 'bg-purple-300 dark:bg-purple-600', border: 'border-purple-400' },
  { name: 'Peach', value: 'bg-orange-200 dark:bg-orange-600', border: 'border-orange-300' },
  { name: 'Rose', value: 'bg-pink-300 dark:bg-pink-600', border: 'border-pink-400' },
  { name: 'Sunshine', value: 'bg-yellow-200 dark:bg-yellow-500', border: 'border-yellow-300' }
];

export function ColorPattern({ onComplete, onExit, config }: GameProps) {
  const [pattern, setPattern] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [showingPattern, setShowingPattern] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [gameState, setGameState] = useState<'ready' | 'showing' | 'input' | 'success' | 'mistake'>('ready');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());

  const generatePattern = (length: number) => {
    const newPattern = [];
    const availableColors = Math.min(level + BASE_COLORS, COLORS.length);
    for (let i = 0; i < length; i++) {
      newPattern.push(Math.floor(Math.random() * availableColors));
    }
    setPattern(newPattern);
    setUserInput([]);
    setCurrentStep(0);
  };

  const showPattern = async () => {
    setGameState('showing');
    setShowingPattern(true);

    for (let i = 0; i < pattern.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentStep(pattern[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    setShowingPattern(false);
    setCurrentStep(-1);
    setGameState('input');
  };

  const handleColorClick = (colorIndex: number) => {
    if (gameState !== 'input') return;

    const newUserInput = [...userInput, colorIndex];
    setUserInput(newUserInput);

    // Check if the input matches the pattern so far
    if (colorIndex !== pattern[newUserInput.length - 1]) {
      setGameState('mistake');
      setTimeout(() => {
        // Reset for retry
        setUserInput([]);
        setGameState('ready');
      }, 1500);
      return;
    }

    // Check if pattern is complete
    if (newUserInput.length === pattern.length) {
      setGameState('success');
      setScore(prev => prev + (pattern.length * 10));
      setTimeout(() => {
        setLevel(prev => {
          const newLevel = prev + 1;
          generatePattern(Math.min(newLevel + 2, 8)); // Cap at 8 colors
          return newLevel;
        });
        setGameState('ready');
      }, 1500);
    }
  };

  const startNewGame = () => {
    generatePattern(3); // Start with 3 colors
    setGameState('ready');
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setUserInput([]);
    generatePattern(3);
    setGameState('ready');
  };

  const completeGame = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    onComplete?.({
      completed: true,
      score,
      timeSpent,
      moodImpact: 'positive'
    });
  };

  useEffect(() => {
    generatePattern(3);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl">
      <div className="text-center mb-6">
        <div className="text-2xl mb-2">{config.emoji}</div>
        <h2 className="text-xl font-bold text-foreground mb-2">{config.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">{config.description}</p>
        <div className="flex justify-center gap-4 text-sm">
          <span className="font-medium">Level: {level}</span>
          <span className="font-medium">Score: {score}</span>
        </div>
      </div>

      {/* Game Status */}
      <div className="text-center mb-4">
        {gameState === 'ready' && (
          <p className="text-sm text-muted-foreground">Watch the pattern, then repeat it!</p>
        )}
        {gameState === 'showing' && (
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Watch carefully... {currentStep + 1}/{pattern.length}
          </p>
        )}
        {gameState === 'input' && (
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            Now repeat the pattern! {userInput.length}/{pattern.length}
          </p>
        )}
        {gameState === 'success' && (
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            ✨ Perfect! Level {level} complete!
          </p>
        )}
        {gameState === 'mistake' && (
          <p className="text-sm text-red-500 dark:text-red-400 font-medium">
            Not quite! Let's try again.
          </p>
        )}
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {COLORS.slice(0, Math.min(6, level + 2)).map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorClick(index)}
            disabled={gameState === 'showing' || gameState === 'success' || gameState === 'mistake'}
            className={`
              w-16 h-16 rounded-2xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${color.value} ${color.border}
              ${showingPattern && currentStep === index ? 'ring-4 ring-white scale-110' : ''}
              ${userInput.includes(index) && gameState === 'input' ? 'ring-2 ring-gray-400' : ''}
              ${gameState === 'input' ? 'hover:scale-105 cursor-pointer' : ''}
              ${gameState !== 'input' ? 'cursor-not-allowed opacity-70' : ''}
            `}
            aria-label={`${color.name} color`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap justify-center">
        {gameState === 'ready' && (
          <Button onClick={showPattern} className="gap-2">
            Start Level {level}
          </Button>
        )}
        
        <Button onClick={resetGame} variant="outline" className="gap-2">
          <RotateCcw size={16} />
          Reset
        </Button>
        
        <Button 
          onClick={completeGame} 
          variant="outline" 
          className="gap-2"
          disabled={score < 50}
        >
          <Square size={16} />
          Complete
        </Button>
        
        <Button onClick={onExit} variant="ghost">
          Exit
        </Button>
      </div>

      {score >= 50 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            🎉 Excellent focus! You've earned {score} points.
          </p>
        </div>
      )}
    </div>
  );
}