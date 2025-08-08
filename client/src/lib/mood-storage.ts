import { MoodEntry, InsertMoodEntry } from "@shared/schema";
import { nanoid } from "nanoid";

const MOOD_STORAGE_KEY = "cozy-critter-moods";
const CUSTOM_MESSAGES_KEY = "cozy-critter-custom-messages";

export interface CustomMessage {
  id: string;
  message: string;
  category: 'general' | 'nd' | 'encouragement';
  createdAt: number;
}

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

  public clearAllCustomMessages(): void {
    localStorage.removeItem(CUSTOM_MESSAGES_KEY);
  }

  public clearAllData(): void {
    localStorage.removeItem(MOOD_STORAGE_KEY);
    localStorage.removeItem(CUSTOM_MESSAGES_KEY);
    // Also clear theme preference to fully reset
    localStorage.removeItem("cozy-critter-theme");
  }

  public getDataSummary(): { 
    moodEntries: number; 
    customMessages: number; 
    storageUsed: string;
    oldestEntry?: Date;
    newestEntry?: Date;
  } {
    const moods = this.getAllMoodEntries();
    const messages = this.getAllCustomMessages();
    
    // Calculate approximate storage usage
    const moodData = localStorage.getItem(MOOD_STORAGE_KEY) || '';
    const messageData = localStorage.getItem(CUSTOM_MESSAGES_KEY) || '';
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

  // Custom Messages Management
  public saveCustomMessage(message: Omit<CustomMessage, 'id' | 'createdAt'>): CustomMessage {
    const customMessage: CustomMessage = {
      ...message,
      id: nanoid(),
      createdAt: Date.now(),
    };

    const existingMessages = this.getAllCustomMessages();
    const updatedMessages = [customMessage, ...existingMessages];
    
    localStorage.setItem(CUSTOM_MESSAGES_KEY, JSON.stringify(updatedMessages));
    return customMessage;
  }

  public getAllCustomMessages(): CustomMessage[] {
    try {
      const stored = localStorage.getItem(CUSTOM_MESSAGES_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error reading custom messages from localStorage:", error);
      return [];
    }
  }

  public updateCustomMessage(id: string, updates: Partial<Pick<CustomMessage, 'message' | 'category'>>): boolean {
    try {
      const existingMessages = this.getAllCustomMessages();
      const messageIndex = existingMessages.findIndex(msg => msg.id === id);
      
      if (messageIndex === -1) return false;
      
      existingMessages[messageIndex] = { ...existingMessages[messageIndex], ...updates };
      localStorage.setItem(CUSTOM_MESSAGES_KEY, JSON.stringify(existingMessages));
      return true;
    } catch (error) {
      console.error("Error updating custom message:", error);
      return false;
    }
  }

  public deleteCustomMessage(id: string): boolean {
    try {
      const existingMessages = this.getAllCustomMessages();
      const updatedMessages = existingMessages.filter(msg => msg.id !== id);
      
      if (existingMessages.length === updatedMessages.length) {
        return false; // Message not found
      }
      
      localStorage.setItem(CUSTOM_MESSAGES_KEY, JSON.stringify(updatedMessages));
      return true;
    } catch (error) {
      console.error("Error deleting custom message from localStorage:", error);
      return false;
    }
  }

  public getRandomMessage(includeCustom: boolean = true): string {
    const defaultMessages = [
      "You did your best today, and that's something to be proud of! 🌟",
      "Every small step counts - you're doing amazing! 💪",
      "Take a deep breath - you're exactly where you need to be! 🌸",
      "Your feelings are valid and you're not alone! 🤗",
      "Rest is important - be kind to yourself! 💤",
      "You're growing stronger every day! 🌱",
      "Remember to celebrate the small victories! 🎉",
      "Your brain works beautifully in its own unique way! 🧠✨",
      "It's okay to need breaks - your energy is precious! 🌿",
      "Masking is exhausting - you're safe to be yourself here! 🎭➡️😌",
      "Your sensory needs matter - honor what feels right! 🌈",
      "Stimming is self-care - move in ways that feel good! 🤲",
      "Executive function struggles are valid - you're not lazy! ⚡",
      "Your special interests bring joy - embrace what you love! 💫",
      "Social battery low? That's totally normal and okay! 🔋",
      "Routine changes are hard - give yourself extra kindness! 🗓️",
      "Your way of processing emotions is valid and important! 🧩",
      "Bad brain days happen - tomorrow is a fresh start! 🌅",
      "You're not 'too much' or 'not enough' - you're just right! 💝",
      "Different doesn't mean broken - neurodiversity is beautiful! 🌺",
    ];

    let allMessages = [...defaultMessages];
    
    if (includeCustom) {
      const customMessages = this.getAllCustomMessages();
      allMessages = [...allMessages, ...customMessages.map(msg => msg.message)];
    }
    
    return allMessages[Math.floor(Math.random() * allMessages.length)];
  }
}

export const moodStorage = MoodStorage.getInstance();
