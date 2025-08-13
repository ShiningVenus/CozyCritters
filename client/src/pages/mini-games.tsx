import React, { useState } from 'react';
import { ArrowLeft, Filter, Star, Clock, Target, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { gameRegistry } from '@/lib/games';
import { Game, GameConfig, GameResult } from '@/types/game';
import {
  getCompletedGames,
  markGameCompleted,
  getGameData,
  getFavoriteGames,
  toggleFavoriteGame,
} from '@/lib/game-progress';
import { GameInstructions } from '@/components/game-instructions';


interface MiniGamesProps {
  onBack: () => void;
}

export default function MiniGames({ onBack }: MiniGamesProps) {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [pendingGame, setPendingGame] = useState<Game | null>(null);
  const [summary, setSummary] = useState<{ game: Game; result: GameResult } | null>(null);
  const [filter, setFilter] = useState<
    GameConfig['category'] | 'all' | 'completed' | 'favorites'
  >('all');
  const [completedGames, setCompletedGames] = useState<string[]>(() => getCompletedGames());
  const [favoriteGames, setFavoriteGames] = useState<string[]>(() => getFavoriteGames());

  const allGames = gameRegistry.getAllGames();
  const filteredGames =
    filter === 'all'
      ? allGames
      : filter === 'completed'
      ? allGames.filter((g) => completedGames.includes(g.config.id))
      : filter === 'favorites'
      ? allGames.filter((g) => favoriteGames.includes(g.config.id))
      : gameRegistry.getGamesByCategory(filter);

  const handleGameComplete = (result: GameResult) => {
    if (currentGame) {
      if (result.completed) {
        markGameCompleted(currentGame.config.id, result);
        setCompletedGames(getCompletedGames());
      }
      setSummary({ game: currentGame, result });
      setCurrentGame(null);
    }
  };

  const handleGameExit = () => {
    setCurrentGame(null);
  };

  const handleSelectGame = (game: Game) => {
    const skip = localStorage.getItem(`skip-instructions-${game.config.id}`) === 'true';
    if (skip) {
      setCurrentGame(game);
    } else {
      setPendingGame(game);
    }
  };

  const handleStartPendingGame = () => {
    if (pendingGame) {
      setCurrentGame(pendingGame);
      setPendingGame(null);
    }
  };

  const handleCloseInstructions = () => {
    setPendingGame(null);
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavoriteGame(id);
    setFavoriteGames(getFavoriteGames());
  };

  const getCategoryIcon = (category: GameConfig['category']) => {
    switch (category) {
      case 'calming': return '🌙';
      case 'focus': return '🎯';
      case 'sensory': return '✨';
      case 'creative': return '🎨';
      default: return '🎮';
    }
  };

  const getCategoryColor = (category: GameConfig['category']) => {
    switch (category) {
      case 'calming': return 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700';
      case 'focus': return 'from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-700';
      case 'sensory': return 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700';
      case 'creative': return 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-700';
      default: return 'from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-700';
    }
  };

  if (currentGame) {
    const GameComponent = currentGame.Component;
    return (
      <div className="p-6">
        <GameComponent
          config={currentGame.config}
          onComplete={handleGameComplete}
          onExit={handleGameExit}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-accent rounded-full"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-foreground">Sensory-Friendly Games</h2>
          <p className="text-sm text-muted-foreground">Gentle activities for focus and calm</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-foreground">{allGames.length}</div>
            <div className="text-xs text-muted-foreground">Games Available</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">{completedGames.length}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {allGames.filter(g => g.config.accessibility.motionSensitive === false).length}
            </div>
            <div className="text-xs text-muted-foreground">Motion-Safe</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            'all',
            'completed',
            'favorites',
            'calming',
            'focus',
            'sensory',
            'creative',
          ] as const
        ).map((category) => (
          <Button
            key={category}
            onClick={() => setFilter(category)}
            variant={filter === category ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            {category === 'completed' ? (
              <Star size={14} />
            ) : category === 'favorites' ? (
              <Heart size={14} />
            ) : (
              <Filter size={14} />
            )}
            {category === 'all'
              ? 'All Games'
              : category === 'completed'
              ? 'Completed'
              : category === 'favorites'
              ? 'Favorites'
              : category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredGames.map((game) => {
          const progress = getGameData(game.config.id);
          return (
          <div
            key={game.config.id}
            className={`bg-gradient-to-br ${getCategoryColor(game.config.category)} rounded-2xl p-6 border shadow-sm transition-all hover:shadow-md`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{game.config.emoji}</div>
                <div>
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    {game.config.name}
                    {completedGames.includes(game.config.id) && (
                      <Star size={14} className="text-yellow-500 fill-current" />
                    )}
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
                  onClick={() => handleToggleFavorite(game.config.id)}
                  className="h-6 w-6 p-0"
                  aria-label="Toggle favorite"
                >
                  <Heart
                    size={16}
                    className={favoriteGames.includes(game.config.id) ? 'text-red-500 fill-current' : ''}
                  />
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

            <p className="text-sm text-muted-foreground mb-4">
              {game.config.description}
            </p>

            {/* Accessibility indicators */}
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

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {game.config.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded"
                >
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

            <Button
              onClick={() => handleSelectGame(game)}
              className="w-full"
            >
              {completedGames.includes(game.config.id) ? 'Play Again' : 'Start Game'}
            </Button>
          </div>
        );
        })}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No games found in this category.</p>
          <Button onClick={() => setFilter('all')} variant="outline">
            View All Games
          </Button>
        </div>
      )}

      {/* Coming Soon Teaser */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 rounded-2xl p-6 text-center">
        <div className="text-2xl mb-2">🚀</div>
        <h3 className="font-bold text-indigo-800 dark:text-indigo-200 mb-2">More Games Coming Soon!</h3>
        <p className="text-sm text-indigo-600 dark:text-indigo-300">
          We're working on more sensory-friendly games including drawing pads, gentle puzzles, and stim-friendly activities.
        </p>
      </div>

      {pendingGame && (
        <GameInstructions
          gameId={pendingGame.config.id}
          title={pendingGame.config.name}
          description={pendingGame.config.description}
          onStart={handleStartPendingGame}
          onClose={handleCloseInstructions}
        />
      )}

      {summary && (
        <Dialog open onOpenChange={(o) => { if (!o) setSummary(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{summary.game.config.name} Complete</DialogTitle>
              <DialogDescription>
                {summary.result.completed ? 'Great job taking a mindful break!' : 'Session ended.'}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 text-sm space-y-1">
              <div>Time: {summary.result.timeSpent}s</div>
              {typeof summary.result.score === 'number' && (
                <div>Score: {summary.result.score}</div>
              )}
            </div>
            <DialogFooter className="justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setSummary(null);
                  setCurrentGame(summary.game);
                }}
              >
                Play Again
              </Button>
              <Button onClick={() => setSummary(null)}>Back</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
