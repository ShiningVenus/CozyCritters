/**
 * Environment detection utilities
 */

/**
 * Check if the app is running in production mode
 */
export function isProduction(): boolean {
  return import.meta.env.PROD || import.meta.env.MODE === 'production';
}

/**
 * Check if the app is running in development mode
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV || import.meta.env.MODE === 'development';
}

/**
 * Get the current environment mode
 */
export function getEnvironment(): 'production' | 'development' | 'unknown' {
  if (isProduction()) return 'production';
  if (isDevelopment()) return 'development';
  return 'unknown';
}