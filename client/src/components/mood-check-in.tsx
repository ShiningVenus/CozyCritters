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
    <main className="p-6">
      {/* Welcome section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-brown-custom mb-3">
          How are you feeling today?
        </h2>
        <p className="text-gray-600">Pick a cozy critter that matches your mood</p>
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
        <label className="block text-sm font-medium text-brown-custom mb-2">
          Add a note (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={!!selectedMood}
          placeholder="How are you feeling? What's on your mind?"
          className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-custom focus:ring-opacity-30 disabled:bg-gray-50 disabled:opacity-50"
          rows={3}
          maxLength={200}
        />
        <div className="text-xs text-gray-500 mt-1 text-right">
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
