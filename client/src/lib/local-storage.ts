/**
 * Utility functions for safe localStorage operations
 */

/**
 * Safely retrieves and parses an array from localStorage
 * @param key - The localStorage key
 * @returns The parsed array or an empty array if not found/invalid
 */
export function getLocalArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Safely saves an array to localStorage
 * @param key - The localStorage key
 * @param value - The array to save
 */
export function saveLocalArray<T>(key: string, value: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save to localStorage with key "${key}":`, error);
  }
}

/**
 * Safely retrieves and parses an object from localStorage
 * @param key - The localStorage key
 * @returns The parsed object or null if not found/invalid
 */
export function getLocalObject<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Safely saves an object to localStorage
 * @param key - The localStorage key
 * @param value - The object to save
 */
export function saveLocalObject<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save to localStorage with key "${key}":`, error);
  }
}

/**
 * Safely removes an item from localStorage
 * @param key - The localStorage key
 */
export function removeLocalItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove from localStorage with key "${key}":`, error);
  }
}