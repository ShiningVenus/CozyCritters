export interface MoodOption {
  id?: string;
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

export function getCustomMoods(): MoodOption[] {
  const moods = getLocalArray<MoodOption>(CUSTOM_MOODS_KEY);
  let updated = false;
  const withIds = moods.map(m => {
    if (!m.id) {
      updated = true;
      return { ...m, id: crypto.randomUUID() };
    }
    return m;
  });
  if (updated) {
    localStorage.setItem(CUSTOM_MOODS_KEY, JSON.stringify(withIds));
  }
  return withIds;
}

export function upsertCustomMood(mood: MoodOption): void {
  const moods = getCustomMoods();
  const index = moods.findIndex(m => m.id === mood.id);
  if (index >= 0) {
    moods[index] = mood;
  } else {
    moods.push(mood);
  }
  localStorage.setItem(CUSTOM_MOODS_KEY, JSON.stringify(moods));
}

export function removeCustomMood(id: string): void {
  const moods = getCustomMoods();
  localStorage.setItem(
    CUSTOM_MOODS_KEY,
    JSON.stringify(moods.filter(m => m.id !== id))
  );
}

export const fetchMoods = async (): Promise<MoodOption[]> => {
  const defaults = await fetchJson<MoodOption[]>("/content/moods.json");
  const custom = getCustomMoods();
  const hidden = getLocalArray<string>(HIDDEN_MOODS_KEY);
  return [...defaults, ...custom].filter(m => !hidden.includes(m.mood));
};
export const fetchGames = () => fetchJson<GameEntry[]>("/content/games.json");
export const fetchPages = () => fetchJson<PageEntry[]>("/content/pages.json");
