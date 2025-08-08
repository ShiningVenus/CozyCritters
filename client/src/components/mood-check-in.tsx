import { useState } from "react";
import { encouragementMessages } from "@shared/schema";
import { EncouragementMessage } from "./encouragement-message";
import { MoodPicker } from "./mood-picker";

interface MoodCheckInProps {
  onMoodSelected: (mood: { emoji: string; mood: string; message: string; note?: string }) => void;
}

export function MoodCheckIn({ onMoodSelected }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<{
    emoji: string;
    mood: string;
    message: string;
    note?: string;
  } | null>(null);
  const [note, setNote] = useState<string>("");

  const handleMoodSelect = (emoji: string, mood: string) => {
    const randomMessage = encouragementMessages[
      Math.floor(Math.random() * encouragementMessages.length)
    ];
    
    const moodData = { emoji, mood, message: randomMessage, note: note.trim() || undefined };
    setSelectedMood(moodData);
    onMoodSelected(moodData);
  };

  const handleAddToGarden = () => {
    // Reset the selected mood and note after a brief delay for visual feedback
    setTimeout(() => {
      setSelectedMood(null);
      setNote("");
    }, 1500);
  };

  return (
    <main className="p-6 bg-background dark:bg-background">
      {/* Welcome section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-brown dark:text-brown mb-3">
          How are you feeling today?
        </h2>
        <p className="text-muted-foreground dark:text-muted-foreground">Pick a cozy critter that matches your mood</p>
      </div>

      {/* Mood selector */}
      <div className="mb-6">
        <MoodPicker
          onMoodSelect={handleMoodSelect}
          selectedMood={selectedMood?.mood}
          disabled={!!selectedMood}
        />
      </div>

      {/* Optional note input */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-brown dark:text-brown mb-2">
          Add a note (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={!!selectedMood}
          placeholder="How are you feeling? What's on your mind?"
          className="w-full p-3 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-30 disabled:bg-muted disabled:opacity-50"
          rows={3}
          maxLength={200}
        />
        <div className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 text-right">
          {note.length}/200
        </div>
      </div>

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
