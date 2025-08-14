import React from 'react';

interface StatsPanelProps {
  totalGames: number;
  completedCount: number;
  motionSafeCount: number;
}

export function StatsPanel({ totalGames, completedCount, motionSafeCount }: StatsPanelProps) {
  return (
    <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-4">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-foreground">{totalGames}</div>
          <div className="text-xs text-muted-foreground">Games Available</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">{completedCount}</div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div>
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{motionSafeCount}</div>
          <div className="text-xs text-muted-foreground">Motion-Safe</div>
        </div>
      </div>
    </div>
  );
}

