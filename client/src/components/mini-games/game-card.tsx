import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Clock, Target, Star } from 'lucide-react';
import { Game } from '@/types/game';
import { getGameData } from '@/lib/game-progress';
import { getCategoryColor, getCategoryIcon } from '@/lib/game-categories';

interface GameCardProps {
  game: Game;
  completed: boolean;
  favorite: boolean;
  onSelect: (game: Game) => void;
  onToggleFavorite: (id: string) => void;
}

export function GameCard({ game, completed, favorite, onSelect, onToggleFavorite }: GameCardProps) {
  const progress = getGameData(game.config.id);

  return (
    <div
      className={`bg-gradient-to-br ${getCategoryColor(game.config.category)} rounded-2xl p-6 border shadow-sm transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{game.config.emoji}</div>
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-2">
              {game.config.name}
              {completed && <Star size={14} className="text-yellow-500 fill-current" />}
            </h3>
            <p className="text-xs text-muted-foreground capitalize flex items-center gap-1">
              {getCategoryIcon(game.config.category)} {game.config.category}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite(game.config.id)}
            className="h-6 w-6 p-0"
            aria-label="Toggle favorite"
          >
            <Heart size={16} className={favorite ? 'text-red-500 fill-current' : ''} />
          </Button>
          <div className="text-right">
            <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
              <Clock size={12} />
              {game.config.estimatedTime}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Target size={12} />
              {game.config.difficulty}
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{game.config.description}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {!game.config.accessibility.motionSensitive && (
          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
            Motion-safe
          </span>
        )}
        {!game.config.accessibility.soundRequired && (
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
            Silent-friendly
          </span>
        )}
        {game.config.accessibility.colorBlindFriendly && (
          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
            Colorblind-friendly
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {game.config.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded">
            {tag}
          </span>
        ))}
        {game.config.tags.length > 3 && (
          <span className="text-xs text-muted-foreground">
            +{game.config.tags.length - 3} more
          </span>
        )}
      </div>

      {(progress?.lastPlayed || typeof progress?.highScore === 'number') && (
        <div className="text-xs text-muted-foreground mb-4 space-y-1">
          {progress.lastPlayed && (
            <div>Last played: {new Date(progress.lastPlayed).toLocaleDateString()}</div>
          )}
          {typeof progress.highScore === 'number' && (
            <div>High score: {progress.highScore}</div>
          )}
        </div>
      )}

      <Button onClick={() => onSelect(game)} className="w-full">
        {completed ? 'Play Again' : 'Start Game'}
      </Button>
    </div>
  );
}

