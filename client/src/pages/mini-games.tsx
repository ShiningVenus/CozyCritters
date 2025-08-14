import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { gameRegistry } from '@/lib/games';
import { Game, GameResult } from '@/types/game';
import {
  getCompletedGames,
  markGameCompleted,
  getFavoriteGames,
  toggleFavoriteGame,
} from '@/lib/game-progress';
import { GameInstructions } from '@/components/game-instructions';
import { FilterTabs, GameFilter } from '@/components/mini-games/filter-tabs';
import { StatsPanel } from '@/components/mini-games/stats-panel';
import { GameCard } from '@/components/mini-games/game-card';


interface MiniGamesProps {
  onBack: () => void;
}

export default function MiniGames({ onBack }: MiniGamesProps) {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [pendingGame, setPendingGame] = useState<Game | null>(null);
  const [summary, setSummary] = useState<{ game: Game; result: GameResult } | null>(null);
  const [filter, setFilter] = useState<GameFilter>('all');
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
  const motionSafeCount = allGames.filter(
    (g) => g.config.accessibility.motionSensitive === false
  ).length;

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
      <StatsPanel
        totalGames={allGames.length}
        completedCount={completedGames.length}
        motionSafeCount={motionSafeCount}
      />

      {/* Filter Tabs */}
      <FilterTabs filter={filter} onFilterChange={setFilter} />

      {/* Games Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredGames.map((game) => (
          <GameCard
            key={game.config.id}
            game={game}
            completed={completedGames.includes(game.config.id)}
            favorite={favoriteGames.includes(game.config.id)}
            onSelect={handleSelectGame}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
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
