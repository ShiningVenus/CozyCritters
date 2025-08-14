import { useState } from "react";
import { EncouragementMessage } from "./encouragement-message";
import { MoodPicker } from "./mood-picker";
import { NDAffirmation } from "./nd-affirmation";
import { customMessageStore } from "@/lib/custom-message-store";

interface MoodCheckInProps {
  onMoodSelected: (mood: { emoji: string; mood: string; message: string; note?: string }) => void;
  onManageMoods?: () => void;
}

export function MoodCheckIn({ onMoodSelected, onManageMoods }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<{
    emoji: string;
    mood: string;
    message: string;
    note?: string;
  } | null>(null);
  const [note, setNote] = useState<string>("");
  const [showAffirmation, setShowAffirmation] = useState(() => Math.random() > 0.6);

  const handleMoodSelect = (emoji: string, mood: string) => {
    // Get a random message from both default and custom messages
    const randomMessage = customMessageStore.getRandomMessage(true);
    
    const moodData = { emoji, mood, message: randomMessage, note: note.trim() || undefined };
    setSelectedMood(moodData);
    onMoodSelected(moodData);
  };

  const handleAddToGarden = () => {
    // Reset the selected mood and note after a brief delay for visual feedback
    setTimeout(() => {
      setSelectedMood(null);
      setNote("");
      setShowAffirmation(Math.random() > 0.6);
    }, 1500);
  };

  return (
    <main className="p-6 bg-background dark:bg-background">
      {/* Welcome section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-brown dark:text-brown mb-3">
          How are you feeling right now?
        </h2>
        <p className="text-muted-foreground dark:text-muted-foreground">Choose the animal friend that feels most like you today. There's no wrong choice! 🐾</p>
      </div>

      {/* Mood selector */}
      <div className="mb-6">
        <MoodPicker
          onMoodSelect={handleMoodSelect}
          selectedMood={selectedMood?.mood}
          disabled={!!selectedMood}
        />
        {onManageMoods && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onManageMoods}
              className="text-sm text-primary underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
            >
              Add your own mood
            </button>
          </div>
        )}
      </div>

      {/* Optional note input */}
      <div className="mb-8">
        <label htmlFor="mood-note" className="block text-sm font-medium text-brown dark:text-brown mb-2">
          Add a note (optional)
        </label>
        <textarea
          id="mood-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={!!selectedMood}
          placeholder="What's happening in your world today? Any thoughts, worries, or wins you'd like to capture?"
          aria-describedby="note-help"
          className="w-full p-3 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-30 disabled:bg-muted disabled:opacity-50"
          rows={3}
          maxLength={200}
        />
        <div id="note-help" className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 flex justify-between">
          <span>Your thoughts are private and stay on your device</span>
          <span aria-live="polite">{note.length}/200 characters</span>
        </div>
      </div>

      {/* ND Affirmation - shown randomly */}
      {!selectedMood && showAffirmation && (
        <div className="mb-6">
          <NDAffirmation type={Math.random() > 0.5 ? 'general' : ['sensory', 'executive', 'social'][Math.floor(Math.random() * 3)] as any} />
        </div>
      )}

      {/* Encouragement message */}
      {selectedMood && (
        <EncouragementMessage
          mood={selectedMood}
          onAddToGarden={handleAddToGarden}
        />
      )}
    </main>
  );
}
