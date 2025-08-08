import { useEffect, useState } from "react";
import { moodStorage } from "@/lib/mood-storage";
import { MoodEntry } from "@shared/schema";
import { format, isToday, isYesterday, isSameDay, startOfDay } from "date-fns";
import { Trash2 } from "lucide-react";

interface MoodLogProps {
  onStartCheckIn?: () => void;
}

export function MoodLog({ onStartCheckIn }: MoodLogProps) {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadMoodEntries = () => {
    const allMoods = moodStorage.getAllMoodEntries();
    setMoodEntries(allMoods);
  };

  useEffect(() => {
    loadMoodEntries();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cozy-critter-moods") {
        loadMoodEntries();
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
        loadMoodEntries(); // Reload the mood entries
      }
      setDeletingId(null);
    }
  };

  const formatDateTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d 'at' h:mm a");
    }
  };

  const groupEntriesByDate = () => {
    const grouped: { [key: string]: MoodEntry[] } = {};
    
    moodEntries.forEach(entry => {
      const date = startOfDay(new Date(entry.timestamp));
      const dateKey = format(date, "yyyy-MM-dd");
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(entry);
    });

    return grouped;
  };

  const getMoodColor = (mood: string): string => {
    switch (mood) {
      case "Happy":
        return "bg-yellow-100 border-yellow-200";
      case "Calm":
        return "bg-blue-100 border-blue-200";
      case "Tired":
        return "bg-purple-100 border-purple-200";
      case "Anxious":
        return "bg-orange-100 border-orange-200";
      case "Excited":
        return "bg-pink-100 border-pink-200";
      case "Peaceful":
        return "bg-green-100 border-green-200";
      default:
        return "bg-gray-100 border-gray-200";
    }
  };

  const getDateHeader = (dateKey: string): string => {
    const date = new Date(dateKey);
    
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMMM d, yyyy");
    }
  };

  const groupedEntries = groupEntriesByDate();
  const sortedDateKeys = Object.keys(groupedEntries).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (moodEntries.length === 0) {
    return (
      <div className="p-6 bg-background dark:bg-background">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-brown dark:text-brown mb-3">
            Mood Log
          </h2>
          <p className="text-muted-foreground dark:text-muted-foreground">Your mood tracking history</p>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-brown dark:text-brown mb-2">
            No mood entries yet
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground mb-6">
            Start tracking your mood to see your entries here.
          </p>
          {onStartCheckIn && (
            <button
              onClick={onStartCheckIn}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Start Tracking
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background dark:bg-background">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-brown dark:text-brown mb-3">
          Mood Log
        </h2>
        <p className="text-gray-600">
          {moodEntries.length} mood {moodEntries.length === 1 ? 'entry' : 'entries'} tracked
        </p>
      </div>

      <div className="space-y-6">
        {sortedDateKeys.map(dateKey => (
          <div key={dateKey} className="space-y-3">
            <h3 className="text-lg font-semibold text-brown dark:text-brown border-b border-brown/20 dark:border-brown/30 pb-2">
              {getDateHeader(dateKey)}
            </h3>
            
            <div className="space-y-3">
              {groupedEntries[dateKey]
                .sort((a, b) => b.timestamp - a.timestamp)
                .map(entry => (
                  <div
                    key={entry.id}
                    className={`mood-log-entry p-4 rounded-lg border ${getMoodColor(entry.mood)} transition-colors`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">
                        {entry.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-brown dark:text-brown">
                            {entry.mood}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                              {formatDateTime(entry.timestamp)}
                            </span>
                            <button
                              onClick={() => handleDeleteEntry(entry.id)}
                              disabled={deletingId === entry.id}
                              className="text-muted-foreground hover:text-red-500 dark:text-muted-foreground dark:hover:text-red-400 transition-colors p-1 rounded hover:bg-muted dark:hover:bg-muted disabled:opacity-50"
                              title="Delete entry"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground italic mb-2">
                          "{entry.message}"
                        </p>
                        {entry.note && (
                          <div className="bg-background/70 dark:bg-background/30 rounded-lg p-2 mt-2">
                            <p className="text-xs text-foreground dark:text-foreground">
                              <span className="font-medium text-brown dark:text-brown">Note:</span> {entry.note}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}