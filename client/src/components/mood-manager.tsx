import { useState, useEffect } from "react";
import { fetchMoods, MoodOption } from "@/lib/content";
import { EmojiPicker } from "@/components/emoji-picker";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { isEmoji } from "@/lib/utils";
import { getLocalArray, saveLocalArray } from "@/lib/local-storage";

interface MoodManagerProps {
  onBack: () => void;
}

const CUSTOM_MOODS_KEY = "cozy-critter-custom-moods";
const HIDDEN_MOODS_KEY = "cozy-critter-hidden-moods";

export function MoodManager({ onBack }: MoodManagerProps) {
  const [moods, setMoods] = useState<MoodOption[]>([]);
  const [emoji, setEmoji] = useState("");
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [editing, setEditing] = useState<MoodOption | null>(null);
  const [editEmoji, setEditEmoji] = useState("");
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showEditPicker, setShowEditPicker] = useState(false);

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
    if (!isEmoji(emoji) || !name.trim() || !color.trim()) return;
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

  const handleEditMood = (mood: MoodOption) => {
    setEditing(mood);
    setEditEmoji(mood.emoji);
    setEditName(mood.mood);
    setEditColor(mood.color);
  };

  const handleSaveEdit = () => {
    if (!editing || !isEmoji(editEmoji) || !editName.trim() || !editColor.trim()) return;
    const custom = getLocalArray<MoodOption>(CUSTOM_MOODS_KEY);
    const updated = custom.map(m =>
      m.mood === editing.mood ? { emoji: editEmoji.trim(), mood: editName.trim(), color: editColor.trim() } : m
    );
    saveLocalArray(CUSTOM_MOODS_KEY, updated);
    setEditing(null);
    setEditEmoji("");
    setEditName("");
    setEditColor("");
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
              <Popover open={showPicker} onOpenChange={setShowPicker}>
                <PopoverTrigger asChild>
                  <button
                    id="mood-emoji"
                    type="button"
                    className="w-full p-2 border border-border dark:border-border rounded bg-background text-foreground text-left"
                  >
                    {emoji || "Pick emoji"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <EmojiPicker
                    onSelect={e => setEmoji(e)}
                    close={() => setShowPicker(false)}
                  />
                </PopoverContent>
              </Popover>
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
          {moods.map(m => {
            const custom = getLocalArray<MoodOption>(CUSTOM_MOODS_KEY);
            const isCustom = custom.some(c => c.mood === m.mood);
            const isEditing = editing?.mood === m.mood;
            return (
              <li
                key={m.mood}
                className="flex items-center justify-between bg-card dark:bg-card border border-border dark:border-border rounded-lg p-3"
              >
                {isEditing ? (
                  <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center">
                    <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:gap-2">
                      <Popover open={showEditPicker} onOpenChange={setShowEditPicker}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="w-full sm:w-20 p-2 border border-border dark:border-border rounded bg-background text-foreground"
                            aria-label="Emoji"
                          >
                            {editEmoji || "Pick"}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="start">
                          <EmojiPicker
                            onSelect={e => setEditEmoji(e)}
                            close={() => setShowEditPicker(false)}
                          />
                        </PopoverContent>
                      </Popover>
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full p-2 border border-border dark:border-border rounded bg-background text-foreground"
                        aria-label="Name"
                      />
                      <input
                        value={editColor}
                        onChange={e => setEditColor(e.target.value)}
                        className="w-full p-2 border border-border dark:border-border rounded bg-background text-foreground"
                        aria-label="Color class"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-2 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="px-2 py-1 text-sm bg-muted text-foreground rounded hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-muted/50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="flex items-center gap-2">
                      <span className="text-2xl" aria-hidden="true">{m.emoji}</span>
                      <span>{m.mood}</span>
                    </span>
                    <div className="flex gap-2">
                      {isCustom && (
                        <button
                          onClick={() => handleEditMood(m)}
                          className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveMood(m)}
                        className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

