import { MoodEntry, InsertMoodEntry } from "@shared/schema";
import { nanoid } from "nanoid";
import { customMessageStore } from "./custom-message-store";
import { getLocalArray, saveLocalArray, removeLocalItem } from "./local-storage";
import { handleComponentError, ErrorSeverity } from "./error-handler";

const MOOD_STORAGE_KEY = "cozy-critter-moods";

export class MoodStore {
  public saveMoodEntry(entry: InsertMoodEntry): MoodEntry {
    const moodEntry: MoodEntry = {
      ...entry,
      id: nanoid(),
    };

    const existingMoods = this.getAllMoodEntries();
    const updatedMoods = [moodEntry, ...existingMoods];

    saveLocalArray(MOOD_STORAGE_KEY, updatedMoods);
    return moodEntry;
  }

  public getAllMoodEntries(): MoodEntry[] {
    return getLocalArray<MoodEntry>(MOOD_STORAGE_KEY);
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

      saveLocalArray(MOOD_STORAGE_KEY, updatedMoods);
      return true;
    } catch (error) {
      handleComponentError(
        error instanceof Error ? error : new Error(String(error)),
        'MoodStore',
        'deleteMoodEntry'
      );
      return false;
    }
  }

  public clearAllMoodEntries(): void {
    removeLocalItem(MOOD_STORAGE_KEY);
  }

  public clearAllData(): void {
    this.clearAllMoodEntries();
    customMessageStore.clearAllCustomMessages();
    // Also clear theme preference to fully reset
    removeLocalItem("cozy-critter-theme");
  }

  public getDataSummary(): {
    moodEntries: number;
    customMessages: number;
    storageUsed: string;
    oldestEntry?: Date;
    newestEntry?: Date;
  } {
    const moods = this.getAllMoodEntries();
    const messages = customMessageStore.getAllCustomMessages();

    // Calculate approximate storage usage
    const moodData = localStorage.getItem(MOOD_STORAGE_KEY) || '';
    const messageData = localStorage.getItem("cozy-critter-custom-messages") || '';
    const themeData = localStorage.getItem("cozy-critter-theme") || '';
    const totalBytes = moodData.length + messageData.length + themeData.length;
    const storageUsed = totalBytes < 1024 ? `${totalBytes} bytes` : `${(totalBytes / 1024).toFixed(1)} KB`;

    let oldestEntry: Date | undefined;
    let newestEntry: Date | undefined;

    if (moods.length > 0) {
      const timestamps = moods.map(m => m.timestamp).sort((a, b) => a - b);
      oldestEntry = new Date(timestamps[0]);
      newestEntry = new Date(timestamps[timestamps.length - 1]);
    }

    return {
      moodEntries: moods.length,
      customMessages: messages.length,
      storageUsed,
      oldestEntry,
      newestEntry,
    };
  }
}

export const moodStore = new MoodStore();

