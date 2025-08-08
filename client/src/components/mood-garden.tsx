import { useEffect, useState } from "react";
import { moodStorage } from "@/lib/mood-storage";
import { MoodEntry } from "@shared/schema";
import { format, isToday, isYesterday } from "date-fns";
import { Trash2 } from "lucide-react";

interface MoodGardenProps {
  onStartCheckIn: () => void;
}

export function MoodGarden({ onStartCheckIn }: MoodGardenProps) {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadMoodHistory = () => {
    const moods = moodStorage.getRecentMoodEntries(20);
    setMoodHistory(moods);
  };

  useEffect(() => {
    loadMoodHistory();
    
    // Listen for storage changes (in case of updates from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cozy-critter-moods") {
        loadMoodHistory();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Are you sure you want to delete this mood entry? This action cannot be undone.")) {
      setDeletingId(id);
      const success = moodStorage.deleteMoodEntry(id);
      if (success) {
        loadMoodHistory(); // Reload the mood history
      }
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };

  const getMoodColor = (mood: string): string => {
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

  if (moodHistory.length === 0) {
    return (
      <main className="p-6 bg-background dark:bg-background">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-brown-custom mb-3">
            Your Cozy Garden
          </h2>
          <p className="text-gray-600">A timeline of your mood journey</p>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-lg font-semibold text-brown dark:text-brown mb-2">
            Your garden is just getting started!
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground mb-6">
            Check in with your mood to start growing your cozy critter collection.
          </p>
          <button
            onClick={onStartCheckIn}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Add Your First Mood
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 bg-background dark:bg-background">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-brown dark:text-brown mb-3">
          Your Cozy Garden
        </h2>
        <p className="text-muted-foreground dark:text-muted-foreground">A timeline of your mood journey</p>
      </div>

      <div className="space-y-4">
        {moodHistory.map((entry, index) => (
          <div
            key={entry.id}
            className="mood-timeline-item bg-card dark:bg-card rounded-2xl p-4 shadow-md border border-border dark:border-border relative"
            style={{
              position: "relative",
            }}
          >
            <div className="flex items-center space-x-4">
              <div className={`text-3xl ${getMoodColor(entry.mood)} rounded-full p-2`}>
                {entry.emoji}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-brown dark:text-brown">
                    {entry.mood}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                      {formatDate(entry.timestamp)}
                    </span>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      disabled={deletingId === entry.id}
                      className="text-muted-foreground hover:text-red-500 dark:text-muted-foreground dark:hover:text-red-400 transition-colors p-1 rounded hover:bg-muted dark:hover:bg-muted disabled:opacity-50"
                      title="Delete entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1 mb-2">
                  "{entry.message}"
                </p>
                {entry.note && (
                  <div className="bg-background/70 dark:bg-background/30 rounded p-2 mt-2">
                    <p className="text-xs text-foreground dark:text-foreground">
                      <span className="font-medium text-brown dark:text-brown">Note:</span> {entry.note}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Timeline connector */}
            {index !== moodHistory.length - 1 && (
              <div
                className="absolute left-6 w-0.5 h-4 bg-gray-200"
                style={{
                  bottom: "-16px",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
