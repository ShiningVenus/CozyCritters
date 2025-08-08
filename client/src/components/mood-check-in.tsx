import { useState } from "react";
import { moodOptions, encouragementMessages } from "@shared/schema";
import { EncouragementMessage } from "./encouragement-message";

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

      {/* Mood selector grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {moodOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleMoodSelect(option.emoji, option.mood)}
            className={`mood-card p-6 rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-center ${
              option.mood === "Happy" ? "bg-secondary-custom" :
              option.mood === "Calm" ? "bg-calm-custom bg-opacity-30" :
              option.color
            }`}
          >
            <div className="text-4xl mb-3">{option.emoji}</div>
            <span className="text-brown-custom font-medium">{option.mood}</span>
          </button>
        ))}
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
