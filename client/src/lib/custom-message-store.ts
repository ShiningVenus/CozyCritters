import { encouragementMessages } from "@shared/encouragements";
import { nanoid } from "nanoid";

const CUSTOM_MESSAGES_KEY = "cozy-critter-custom-messages";

export interface CustomMessage {
  id: string;
  message: string;
  category: 'general' | 'nd' | 'encouragement';
  createdAt: number;
}

export class CustomMessageStore {
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

  public updateCustomMessage(
    id: string,
    updates: Partial<Pick<CustomMessage, 'message' | 'category'>>
  ): boolean {
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

  public clearAllCustomMessages(): void {
    localStorage.removeItem(CUSTOM_MESSAGES_KEY);
  }

  public getRandomMessage(includeCustom: boolean = true): string {
    const defaultMessages = encouragementMessages;

    let allMessages: string[] = [...defaultMessages];

    if (includeCustom) {
      const customMessages = this.getAllCustomMessages();
      allMessages = [...allMessages, ...customMessages.map(msg => msg.message)];
    }

    return allMessages[Math.floor(Math.random() * allMessages.length)];
  }
}

export const customMessageStore = new CustomMessageStore();

