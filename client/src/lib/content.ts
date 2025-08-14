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

// Fallback mood options used when the moods.json file can't be fetched
// (for example, on first load before assets are cached or when offline).
const DEFAULT_MOODS: MoodOption[] = [
  { emoji: "🐻", mood: "Happy", color: "bg-secondary-custom" },
  { emoji: "🦊", mood: "Calm", color: "bg-calm-custom bg-opacity-30" },
  { emoji: "🐢", mood: "Tired", color: "bg-purple-100" },
  { emoji: "🦦", mood: "Anxious", color: "bg-orange-100" },
  { emoji: "🐰", mood: "Excited", color: "bg-pink-100" },
  { emoji: "🦋", mood: "Peaceful", color: "bg-green-100" },
  { emoji: "🦔", mood: "Overwhelmed", color: "bg-red-100" },
  { emoji: "🐨", mood: "Content", color: "bg-content-custom" },
  { emoji: "🐼", mood: "Sad", color: "bg-blue-100" },
  { emoji: "🦁", mood: "Angry", color: "bg-red-200" },
  { emoji: "🐱", mood: "Lonely", color: "bg-gray-200" },
  { emoji: "🦉", mood: "Focused", color: "bg-indigo-100" },
  { emoji: "🦥", mood: "Bored", color: "bg-gray-100" },
  { emoji: "🦩", mood: "Silly", color: "bg-pink-200" },
  { emoji: "🦚", mood: "Proud", color: "bg-yellow-100" },
  { emoji: "🐙", mood: "Stressed", color: "bg-rose-100" },
  { emoji: "🦓", mood: "Confused", color: "bg-slate-100" },
  { emoji: "🦕", mood: "Nostalgic", color: "bg-lime-100" },
  { emoji: "🐿️", mood: "Hyper", color: "bg-orange-200" },
  { emoji: "🦢", mood: "Graceful", color: "bg-teal-100" },
  { emoji: "🦜", mood: "Chatty", color: "bg-emerald-100" },
  { emoji: "🦄", mood: "Magical", color: "bg-fuchsia-100" },
  { emoji: "🐧", mood: "Cold", color: "bg-sky-100" },
];

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
  const custom = getLocalArray<MoodOption>(CUSTOM_MOODS_KEY);
  const hidden = getLocalArray<string>(HIDDEN_MOODS_KEY);

  try {
    const defaults = await fetchJson<MoodOption[]>("/content/moods.json");
    return [...defaults, ...custom].filter(m => !hidden.includes(m.mood));
  } catch {
    // If fetching fails, fall back to the built-in default moods
    return [...DEFAULT_MOODS, ...custom].filter(m => !hidden.includes(m.mood));
  }
};
export const fetchGames = () => fetchJson<GameEntry[]>("/content/games.json");
export const fetchPages = () => fetchJson<PageEntry[]>("/content/pages.json");
