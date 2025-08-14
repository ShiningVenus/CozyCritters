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

const CUSTOM_MOODS_KEY = "cozy-critter-custom-moods";
const HIDDEN_MOODS_KEY = "cozy-critter-hidden-moods";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function getLocalArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const fetchMoods = async (): Promise<MoodOption[]> => {
  const defaults = await fetchJson<MoodOption[]>("/content/moods.json");
  const custom = getLocalArray<MoodOption>(CUSTOM_MOODS_KEY);
  const hidden = getLocalArray<string>(HIDDEN_MOODS_KEY);
  return [...defaults, ...custom].filter(m => !hidden.includes(m.mood));
};
export const fetchGames = () => fetchJson<GameEntry[]>("/content/games.json");
export const fetchPages = () => fetchJson<PageEntry[]>("/content/pages.json");
