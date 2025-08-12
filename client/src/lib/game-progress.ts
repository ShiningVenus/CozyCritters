import { GameResult } from '@/types/game';

const STORAGE_KEY = 'cozy-critter-game-progress';

export interface GameProgressEntry {
  completed: boolean;
  lastPlayed: number;
  highScore?: number;
}

interface GameProgressMap {
  [id: string]: GameProgressEntry;
}

function loadProgress(): GameProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GameProgressMap) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: GameProgressMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getCompletedGames(): string[] {
  const progress = loadProgress();
  return Object.keys(progress).filter((id) => progress[id].completed);
}

export function getGameData(id: string): GameProgressEntry | undefined {
  const progress = loadProgress();
  return progress[id];
}

export function markGameCompleted(id: string, result?: GameResult): void {
  const progress = loadProgress();
  const existing = progress[id];
  const highScore =
    typeof result?.score === 'number'
      ? Math.max(result.score, existing?.highScore ?? -Infinity)
      : existing?.highScore;

  progress[id] = {
    completed: true,
    lastPlayed: Date.now(),
    highScore,
  };

  saveProgress(progress);
}
