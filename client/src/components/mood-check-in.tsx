import { useState } from "react";
import { encouragementMessages } from "@shared/schema";
import { EncouragementMessage } from "./encouragement-message";
import { MoodPicker } from "./mood-picker";

interface MoodCheckInProps {
  onMoodSelected: (mood: { emoji: string; mood: string; message: string }) => void;
}

export function MoodCheckIn({ onMoodSelected }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<{
    emoji: string;
    mood: string;
    message: string;
  } | null>(null);

  const handleMoodSelect = (emoji: string, mood: string) => {
    const randomMessage = encouragementMessages[
      Math.floor(Math.random() * encouragementMessages.length)
    ];
    
    const moodData = { emoji, mood, message: randomMessage };
    setSelectedMood(moodData);
    onMoodSelected(moodData);
  };

  const handleAddToGarden = () => {
    // Reset the selected mood after a brief delay for visual feedback
    setTimeout(() => {
      setSelectedMood(null);
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
      <div className="mb-8">
        <MoodPicker
          onMoodSelect={handleMoodSelect}
          selectedMood={selectedMood?.mood}
          disabled={!!selectedMood}
        />
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
