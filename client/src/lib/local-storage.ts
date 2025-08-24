/**
 * Utility functions for safe localStorage operations
 */

import { withLocalStorageErrorHandling } from "./error-handler";

/**
 * Safely retrieves and parses an array from localStorage
 * @param key - The localStorage key
 * @returns The parsed array or an empty array if not found/invalid
 */
export function getLocalArray<T>(key: string): T[] {
  return withLocalStorageErrorHandling(
    () => {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    },
    [],
    { action: 'getLocalArray', additionalData: { key } }
  );
}

/**
 * Safely saves an array to localStorage
 * @param key - The localStorage key
 * @param value - The array to save
 */
export function saveLocalArray<T>(key: string, value: T[]): void {
  withLocalStorageErrorHandling(
    () => {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    },
    false,
    { action: 'saveLocalArray', additionalData: { key, valueLength: value.length } }
  );
}

/**
 * Safely retrieves and parses an object from localStorage
 * @param key - The localStorage key
 * @returns The parsed object or null if not found/invalid
 */
export function getLocalObject<T>(key: string): T | null {
  return withLocalStorageErrorHandling(
    () => {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    },
    null,
    { action: 'getLocalObject', additionalData: { key } }
  );
}

/**
 * Safely saves an object to localStorage
 * @param key - The localStorage key
 * @param value - The object to save
 */
export function saveLocalObject<T>(key: string, value: T): void {
  withLocalStorageErrorHandling(
    () => {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    },
    false,
    { action: 'saveLocalObject', additionalData: { key } }
  );
}

/**
 * Safely removes an item from localStorage
 * @param key - The localStorage key
 */
export function removeLocalItem(key: string): void {
  withLocalStorageErrorHandling(
    () => {
      localStorage.removeItem(key);
      return true;
    },
    false,
    { action: 'removeLocalItem', additionalData: { key } }
  );
}