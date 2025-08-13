export interface MoodOption {
  emoji: string;
  mood: string;
  color: string;
}

export interface GameEntry {
  title: string;
  url: string;
  description: string;
}

export interface PageEntry {
  title: string;
  body: string;
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

export const fetchMoods = () => fetchJson<MoodOption[]>("/content/moods.json");
export const fetchGames = () => fetchJson<GameEntry[]>("/content/games.json");
export const fetchPages = () => fetchJson<PageEntry[]>("/content/pages.json");
