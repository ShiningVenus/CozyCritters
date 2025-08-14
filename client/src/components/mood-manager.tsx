import { useState, useEffect } from "react";
import { fetchMoods, MoodOption } from "@/lib/content";

interface MoodManagerProps {
  onBack: () => void;
}

const CUSTOM_MOODS_KEY = "cozy-critter-custom-moods";
const HIDDEN_MOODS_KEY = "cozy-critter-hidden-moods";

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

function saveLocalArray<T>(key: string, value: T[]): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function MoodManager({ onBack }: MoodManagerProps) {
  const [moods, setMoods] = useState<MoodOption[]>([]);
  const [emoji, setEmoji] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    try {
      const list = await fetchMoods();
      setMoods(list);
    } catch {
      setMoods([]);
    }
  };

  const handleAddMood = () => {
    if (!emoji.trim() || !name.trim() || !color.trim()) return;
    const custom = getLocalArray<MoodOption>(CUSTOM_MOODS_KEY);
    const newMood = { emoji: emoji.trim(), mood: name.trim(), color: color.trim() };
    saveLocalArray(CUSTOM_MOODS_KEY, [...custom, newMood]);
    setEmoji("");
    setName("");
    setColor("");
    loadMoods();
  };

  const handleRemoveMood = (mood: MoodOption) => {
    const custom = getLocalArray<MoodOption>(CUSTOM_MOODS_KEY);
    if (custom.find(m => m.mood === mood.mood)) {
      saveLocalArray(
        CUSTOM_MOODS_KEY,
        custom.filter(m => m.mood !== mood.mood)
      );
    } else {
      const hidden = getLocalArray<string>(HIDDEN_MOODS_KEY);
      if (!hidden.includes(mood.mood)) {
        saveLocalArray(HIDDEN_MOODS_KEY, [...hidden, mood.mood]);
      }
    }
    loadMoods();
  };

  return (
    <main className="p-6 bg-background dark:bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-3 p-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
            aria-label="Go back"
          >
            ←
          </button>
          <h2 className="text-2xl font-semibold text-brown dark:text-brown">
            Manage Moods
          </h2>
        </div>

        <div className="bg-card dark:bg-card border border-border dark:border-border rounded-xl p-4 mb-6">
          <div className="grid gap-4" aria-label="Add mood form">
            <div>
              <label htmlFor="mood-emoji" className="block text-sm font-medium text-brown dark:text-brown mb-1">
                Emoji
              </label>
              <input
                id="mood-emoji"
                value={emoji}
                onChange={e => setEmoji(e.target.value)}
                className="w-full p-2 border border-border dark:border-border rounded bg-background text-foreground"
              />
            </div>
            <div>
              <label htmlFor="mood-name" className="block text-sm font-medium text-brown dark:text-brown mb-1">
                Name
              </label>
              <input
                id="mood-name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2 border border-border dark:border-border rounded bg-background text-foreground"
              />
            </div>
            <div>
              <label htmlFor="mood-color" className="block text-sm font-medium text-brown dark:text-brown mb-1">
                Color class
              </label>
              <input
                id="mood-color"
                value={color}
                onChange={e => setColor(e.target.value)}
                placeholder="bg-green-600 text-white"
                className="w-full p-2 border border-border dark:border-border rounded bg-background text-foreground"
              />
            </div>
            <button
              onClick={handleAddMood}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Add mood
            </button>
          </div>
        </div>

        <ul className="space-y-3" aria-label="Existing moods">
          {moods.map(m => (
            <li
              key={m.mood}
              className="flex items-center justify-between bg-card dark:bg-card border border-border dark:border-border rounded-lg p-3"
            >
              <span className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">{m.emoji}</span>
                <span>{m.mood}</span>
              </span>
              <button
                onClick={() => handleRemoveMood(m)}
                className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

