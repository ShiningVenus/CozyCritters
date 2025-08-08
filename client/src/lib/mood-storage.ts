import { MoodEntry, InsertMoodEntry } from "@shared/schema";
import { nanoid } from "nanoid";

const MOOD_STORAGE_KEY = "cozy-critter-moods";

export class MoodStorage {
  private static instance: MoodStorage;

  public static getInstance(): MoodStorage {
    if (!MoodStorage.instance) {
      MoodStorage.instance = new MoodStorage();
    }
    return MoodStorage.instance;
  }

  public saveMoodEntry(entry: InsertMoodEntry): MoodEntry {
    const moodEntry: MoodEntry = {
      ...entry,
      id: nanoid(),
    };

    const existingMoods = this.getAllMoodEntries();
    const updatedMoods = [moodEntry, ...existingMoods];
    
    localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(updatedMoods));
    return moodEntry;
  }

  public getAllMoodEntries(): MoodEntry[] {
    try {
      const stored = localStorage.getItem(MOOD_STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error reading mood entries from localStorage:", error);
      return [];
    }
  }

  public getMoodEntriesByDateRange(startDate: Date, endDate: Date): MoodEntry[] {
    const allMoods = this.getAllMoodEntries();
    return allMoods.filter(
      (mood) =>
        mood.timestamp >= startDate.getTime() && 
        mood.timestamp <= endDate.getTime()
    );
  }

  public getRecentMoodEntries(limit: number = 10): MoodEntry[] {
    const allMoods = this.getAllMoodEntries();
    return allMoods.slice(0, limit);
  }

  public deleteMoodEntry(id: string): boolean {
    try {
      const existingMoods = this.getAllMoodEntries();
      const updatedMoods = existingMoods.filter(mood => mood.id !== id);
      
      if (existingMoods.length === updatedMoods.length) {
        // No entry was found with the given id
        return false;
      }
      
      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(updatedMoods));
      return true;
    } catch (error) {
      console.error("Error deleting mood entry from localStorage:", error);
      return false;
    }
  }

  public clearAllMoodEntries(): void {
    localStorage.removeItem(MOOD_STORAGE_KEY);
  }
}

export const moodStorage = MoodStorage.getInstance();
