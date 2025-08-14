import { useState } from "react";
import { moodStore } from "@/lib/mood-store";

interface EncouragementMessageProps {
  mood: {
    emoji: string;
    mood: string;
    message: string;
    note?: string;
  };
  onAddToGarden: () => void;
}

export function EncouragementMessage({ mood, onAddToGarden }: EncouragementMessageProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToGarden = () => {
    // Save to localStorage
    moodStore.saveMoodEntry({
      emoji: mood.emoji,
      mood: mood.mood,
      message: mood.message,
      note: mood.note,
      timestamp: Date.now(),
    });

    setIsAdded(true);
    
    // Reset after animation
    setTimeout(() => {
      setIsAdded(false);
      onAddToGarden();
    }, 2000);
  };

  return (
    <div className="bg-primary/10 dark:bg-primary/20 rounded-2xl p-6 mb-6 text-center border border-primary/20 dark:border-primary/30">
      <div className="text-3xl mb-3">{mood.emoji}</div>
      <p className="text-brown dark:text-brown font-medium mb-2">Thanks for checking in!</p>
      <p className="text-muted-foreground dark:text-muted-foreground italic mb-4">
        "{mood.message}"
      </p>
      {mood.note && (
        <div className="bg-background/50 dark:bg-background/30 rounded-lg p-3 mb-4 text-left">
          <p className="text-sm text-foreground dark:text-foreground">
            <span className="font-medium text-brown dark:text-brown">Your note:</span> {mood.note}
          </p>
        </div>
      )}
      <button
        onClick={handleAddToGarden}
        disabled={isAdded}
        aria-live="polite"
        className={`px-6 py-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/50 ${
          isAdded
            ? "bg-green-500 text-white scale-105"
            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95"
        }`}
      >
        {isAdded ? "Added to your garden! 🌱" : "Save this moment 💾"}
      </button>
    </div>
  );
}
