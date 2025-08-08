import { moodOptions } from "@shared/schema";

interface MoodPickerProps {
  onMoodSelect: (emoji: string, mood: string) => void;
  selectedMood?: string | null;
  disabled?: boolean;
}

export function MoodPicker({ onMoodSelect, selectedMood, disabled = false }: MoodPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {moodOptions.map((option, index) => (
        <button
          key={index}
          onClick={() => onMoodSelect(option.emoji, option.mood)}
          disabled={disabled}
          aria-label={`Select ${option.mood} mood`}
          aria-pressed={selectedMood === option.mood}
          className={`mood-card p-6 rounded-2xl shadow-md text-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/50 dark:focus:ring-primary/70 ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-lg hover:scale-105 active:scale-95"
          } ${
            selectedMood === option.mood
              ? "ring-2 ring-primary dark:ring-primary ring-opacity-60 scale-105"
              : ""
          } ${option.color}`}
        >
          <div className="text-4xl mb-3">{option.emoji}</div>
          <span className="text-brown dark:text-brown font-medium">{option.mood}</span>
        </button>
      ))}
    </div>
  );
}