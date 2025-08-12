import React, { useEffect, useState } from 'react';
import { GameProps } from '@/types/game';
import { Button } from '@/components/ui/button';
import { RotateCcw, Circle, Square, Triangle, Star, Heart, Diamond } from 'lucide-react';

interface Card {
  id: number;
  shape: number; // index into SHAPES
  flipped: boolean;
  matched: boolean;
}

const SHAPES = [
  { name: 'Circle', Icon: Circle },
  { name: 'Square', Icon: Square },
  { name: 'Triangle', Icon: Triangle },
  { name: 'Star', Icon: Star },
  { name: 'Heart', Icon: Heart },
  { name: 'Diamond', Icon: Diamond }
];

export function ShapeMatch({ onComplete, onExit, config }: GameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');

  const shuffleCards = () => {
    const deck: Card[] = [];
    SHAPES.forEach((shape, index) => {
      deck.push({ id: index * 2, shape: index, flipped: false, matched: false });
      deck.push({ id: index * 2 + 1, shape: index, flipped: false, matched: false });
    });
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCards(deck);
    setFlipped([]);
    setMatches(0);
    setMoves(0);
    setGameState('playing');
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  const handleCardClick = (index: number) => {
    const card = cards[index];
    if (card.flipped || card.matched || flipped.length === 2 || gameState !== 'playing') return;

    const newCards = [...cards];
    newCards[index] = { ...card, flipped: true };
    const newFlipped = [...flipped, index];
    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      if (newCards[first].shape === newCards[second].shape) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards([...newCards]);
        setMatches(prev => prev + 1);
        setFlipped([]);
      } else {
        setTimeout(() => {
          const tempCards = [...newCards];
          tempCards[first].flipped = false;
          tempCards[second].flipped = false;
          setCards(tempCards);
          setFlipped([]);
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (matches === SHAPES.length && gameState === 'playing') {
      setGameState('won');
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      onComplete?.({
        completed: true,
        score: matches * 10,
        timeSpent,
        moodImpact: 'positive'
      });
    }
  }, [matches, onComplete, startTime, gameState]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl">
      <div className="text-center mb-6">
        <div className="text-2xl mb-2">{config.emoji}</div>
        <h2 className="text-xl font-bold text-foreground mb-2">{config.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">{config.description}</p>
        <div className="flex justify-center gap-4 text-sm">
          <span className="font-medium">Moves: {moves}</span>
          <span className="font-medium">Matches: {matches}/{SHAPES.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
        {cards.map((card, index) => {
          const ShapeIcon = SHAPES[card.shape].Icon;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={card.flipped || card.matched || flipped.length === 2 || gameState !== 'playing'}
              className={`w-16 h-20 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 transition-all ${card.flipped || card.matched ? '' : 'hover:scale-105'}`}
              aria-label={card.flipped || card.matched ? SHAPES[card.shape].name : 'hidden card'}
            >
              {card.flipped || card.matched ? (
                <ShapeIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              ) : (
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded" />
              )}
            </button>
          );
        })}
      </div>

      {gameState === 'won' && (
        <div className="text-green-600 dark:text-green-400 font-medium mb-4">Great job! You found all the matches.</div>
      )}

      <div className="flex gap-3 flex-wrap justify-center">
        <Button onClick={shuffleCards} variant="outline" className="gap-2">
          <RotateCcw size={16} />
          Reset
        </Button>
        <Button onClick={onExit} variant="ghost">
          Exit
        </Button>
      </div>
    </div>
  );
}

