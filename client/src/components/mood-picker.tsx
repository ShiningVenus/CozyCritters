import { moodOptions } from "@shared/schema";
import { useRef, useEffect, KeyboardEvent } from "react";

interface MoodPickerProps {
  onMoodSelect: (emoji: string, mood: string) => void;
  selectedMood?: string | null;
  disabled?: boolean;
}

export function MoodPicker({ onMoodSelect, selectedMood, disabled = false }: MoodPickerProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    const buttons = gridRef.current?.querySelectorAll('button:not([disabled])');
    if (!buttons || buttons.length === 0) return;

    const currentIndex = Array.from(buttons).findIndex(button => 
      button === document.activeElement
    );

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        break;
      case 'ArrowDown':
        event.preventDefault();
        // Move down by 2 in a 2-column grid
        nextIndex = currentIndex + 2 < buttons.length ? currentIndex + 2 : 
                   (currentIndex + 2) % buttons.length;
        break;
      case 'ArrowUp':
        event.preventDefault();
        // Move up by 2 in a 2-column grid
        nextIndex = currentIndex - 2 >= 0 ? currentIndex - 2 : 
                   buttons.length + (currentIndex - 2);
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = buttons.length - 1;
        break;
    }

    if (nextIndex !== currentIndex && nextIndex >= 0 && nextIndex < buttons.length) {
      (buttons[nextIndex] as HTMLElement).focus();
    }
  };

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-2 gap-4"
      onKeyDown={handleKeyDown}
      role="radiogroup"
      aria-label="Select your current mood"
    >
      {moodOptions.map((option, index) => (
        <button
          key={index}
          onClick={() => onMoodSelect(option.emoji, option.mood)}
          disabled={disabled}
          role="radio"
          aria-checked={selectedMood === option.mood}
          aria-label={`Select ${option.mood} mood`}
          aria-describedby={`mood-${index}-description`}
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
          <div className="text-4xl mb-3" aria-hidden="true">{option.emoji}</div>
          <span className="text-brown dark:text-brown font-medium">{option.mood}</span>
          <span id={`mood-${index}-description`} className="sr-only">
            {option.mood} mood option. Use arrow keys to navigate, Enter or Space to select.
          </span>
        </button>
      ))}
    </div>
  );
}