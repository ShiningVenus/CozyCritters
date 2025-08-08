import { moodOptions } from "@shared/schema";

interface MoodPickerProps {
  onMoodSelect: (emoji: string, mood: string) => void;
  selectedMood?: string | null;
  disabled?: boolean;
}

export function MoodPicker({ onMoodSelect, selectedMood, disabled = false }: MoodPickerProps) {
  const getMoodBackgroundClass = (mood: string): string => {
    switch (mood) {
      case "Happy":
        return "bg-secondary-custom";
      case "Calm":
        return "bg-calm-custom bg-opacity-30";
      case "Tired":
        return "bg-purple-100";
      case "Anxious":
        return "bg-orange-100";
      case "Excited":
        return "bg-pink-100";
      case "Peaceful":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {moodOptions.map((option, index) => (
        <button
          key={index}
          onClick={() => onMoodSelect(option.emoji, option.mood)}
          disabled={disabled}
          className={`mood-card p-6 rounded-2xl shadow-md text-center transition-all duration-200 ${
            disabled 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:shadow-lg transform hover:-translate-y-1"
          } ${
            selectedMood === option.mood 
              ? "ring-2 ring-primary-custom ring-opacity-60" 
              : ""
          } ${getMoodBackgroundClass(option.mood)}`}
        >
          <div className="text-4xl mb-3">{option.emoji}</div>
          <span className="text-brown-custom font-medium">{option.mood}</span>
        </button>
      ))}
    </div>
  );
}