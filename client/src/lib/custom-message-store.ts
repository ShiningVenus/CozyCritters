import { encouragementMessages } from "@shared/encouragements";
import { nanoid } from "nanoid";
import { getLocalArray, saveLocalArray, removeLocalItem } from "./local-storage";
import { handleComponentError } from "./error-handler";

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

    saveLocalArray(CUSTOM_MESSAGES_KEY, updatedMessages);
    return customMessage;
  }

  public getAllCustomMessages(): CustomMessage[] {
    return getLocalArray<CustomMessage>(CUSTOM_MESSAGES_KEY);
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
      saveLocalArray(CUSTOM_MESSAGES_KEY, existingMessages);
      return true;
    } catch (error) {
      handleComponentError(
        error instanceof Error ? error : new Error(String(error)),
        'CustomMessageStore',
        'updateCustomMessage'
      );
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

      saveLocalArray(CUSTOM_MESSAGES_KEY, updatedMessages);
      return true;
    } catch (error) {
      handleComponentError(
        error instanceof Error ? error : new Error(String(error)),
        'CustomMessageStore',
        'deleteCustomMessage'
      );
      return false;
    }
  }

  public clearAllCustomMessages(): void {
    removeLocalItem(CUSTOM_MESSAGES_KEY);
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

