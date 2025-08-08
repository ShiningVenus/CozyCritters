import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gameRegistry } from '@/lib/games';

export function MiniGamesPreview() {
  const games = gameRegistry.getAllGames();
  const featuredGame = games[0]; // Show first game as featured
  const totalGames = games.length;

  return (
    <section 
      aria-labelledby="minigames-heading" 
      className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-700/50 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl" role="img" aria-label="games">🎮</div>
          <div>
            <h3 id="minigames-heading" className="text-lg font-bold text-purple-800 dark:text-purple-200">
              Sensory-Friendly Games
            </h3>
            <p className="text-sm text-purple-600 dark:text-purple-300">
              {totalGames} calming activities available
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-300 mb-1">
            <Shield size={12} />
            Motion-safe
          </div>
          <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-300">
            <Star size={12} />
            No pressure
          </div>
        </div>
      </div>

      {featuredGame && (
        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="text-xl">{featuredGame.config.emoji}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 text-sm">
                Featured: {featuredGame.config.name}
              </h4>
              <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                {featuredGame.config.description}
              </p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                  {featuredGame.config.category}
                </span>
                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                  {featuredGame.config.estimatedTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
        Gentle, no-pressure activities designed for neurodivergent minds. 
        Perfect for focus practice, calming moments, or stimming breaks.
      </p>

      <Link href="/games">
        <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700">
          Explore Games
          <ArrowRight size={16} />
        </Button>
      </Link>
    </section>
  );
}