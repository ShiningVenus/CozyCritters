import { GameResult } from '@/types/game';

const STORAGE_KEY = 'cozy-critter-game-progress';

export interface GameProgressEntry {
  completed: boolean;
  lastPlayed: number;
  highScore?: number;
  favorite?: boolean;
  stats?: GameStat[];
}

interface GameProgressMap {
  [id: string]: GameProgressEntry;
}

export interface GameStat {
  date: number;
  score?: number;
  timeSpent?: number;
  cycles?: number;
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

export function getFavoriteGames(): string[] {
  const progress = loadProgress();
  return Object.keys(progress).filter((id) => progress[id].favorite);
}

export function getGameData(id: string): GameProgressEntry | undefined {
  const progress = loadProgress();
  return progress[id];
}

export function toggleFavoriteGame(id: string): boolean {
  const progress = loadProgress();
  const existing = progress[id] || { completed: false, lastPlayed: 0 };
  const favorite = !existing.favorite;
  progress[id] = { ...existing, favorite };
  saveProgress(progress);
  return favorite;
}

export function markGameCompleted(id: string, result?: GameResult): void {
  const progress = loadProgress();
  const existing = progress[id];
  const highScore =
    typeof result?.score === 'number'
      ? Math.max(result.score, existing?.highScore ?? -Infinity)
      : existing?.highScore;

  const newStat: GameStat | undefined = result
    ? {
        date: Date.now(),
        score: result.score,
        timeSpent: result.timeSpent,
        cycles: result.cycles,
      }
    : undefined;

  progress[id] = {
    ...existing,
    completed: true,
    lastPlayed: Date.now(),
    highScore,
    stats: newStat ? [...(existing?.stats ?? []), newStat] : existing?.stats,
  };

  saveProgress(progress);
}
