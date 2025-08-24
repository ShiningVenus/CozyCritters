/**
 * Centralized error handling utilities for Cozy Critters
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorReport {
  message: string;
  severity: ErrorSeverity;
  context?: ErrorContext;
  timestamp: number;
  error?: Error;
}

class ErrorHandler {
  private errorQueue: ErrorReport[] = [];
  private isDev = import.meta.env.DEV;

  /**
   * Log an error with context and severity
   */
  public logError(
    message: string, 
    error?: Error | unknown, 
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: ErrorContext
  ): void {
    const errorReport: ErrorReport = {
      message,
      severity,
      context,
      timestamp: Date.now(),
      error: error instanceof Error ? error : undefined
    };

    this.errorQueue.push(errorReport);

    // Console logging based on environment and severity
    if (this.isDev || severity === ErrorSeverity.CRITICAL) {
      this.logToConsole(errorReport);
    }

    // Keep error queue limited to prevent memory issues
    if (this.errorQueue.length > 100) {
      this.errorQueue = this.errorQueue.slice(-50);
    }
  }

  /**
   * Handle localStorage operations with automatic error handling
   */
  public withLocalStorageErrorHandling<T>(
    operation: () => T,
    fallback: T,
    context?: ErrorContext
  ): T {
    try {
      return operation();
    } catch (error) {
      this.logError(
        'localStorage operation failed',
        error,
        ErrorSeverity.MEDIUM,
        { ...context, action: 'localStorage_operation' }
      );
      return fallback;
    }
  }

  /**
   * Handle async operations with automatic error handling
   */
  public async withAsyncErrorHandling<T>(
    operation: () => Promise<T>,
    fallback: T,
    context?: ErrorContext
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.logError(
        'Async operation failed',
        error,
        ErrorSeverity.MEDIUM,
        context
      );
      return fallback;
    }
  }

  /**
   * Handle component errors with recovery
   */
  public handleComponentError(
    error: Error,
    component: string,
    action?: string,
    onError?: () => void
  ): void {
    this.logError(
      `Component error in ${component}`,
      error,
      ErrorSeverity.HIGH,
      { component, action }
    );

    if (onError) {
      onError();
    }
  }

  /**
   * Get recent errors for debugging
   */
  public getRecentErrors(limit: number = 10): ErrorReport[] {
    return this.errorQueue.slice(-limit);
  }

  /**
   * Clear error queue
   */
  public clearErrors(): void {
    this.errorQueue = [];
  }

  private logToConsole(errorReport: ErrorReport): void {
    const { message, severity, context, error, timestamp } = errorReport;
    const prefix = `🐾 [${severity.toUpperCase()}]`;
    const timeStr = new Date(timestamp).toISOString();
    
    const contextStr = context ? JSON.stringify(context, null, 2) : '';
    
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        console.error(`${prefix} ${message}`, error, contextStr, timeStr);
        break;
      case ErrorSeverity.HIGH:
        console.error(`${prefix} ${message}`, error, contextStr);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(`${prefix} ${message}`, error, contextStr);
        break;
      case ErrorSeverity.LOW:
        if (this.isDev) {
          console.log(`${prefix} ${message}`, error, contextStr);
        }
        break;
    }
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Convenience functions
export const logError = errorHandler.logError.bind(errorHandler);
export const withLocalStorageErrorHandling = errorHandler.withLocalStorageErrorHandling.bind(errorHandler);
export const withAsyncErrorHandling = errorHandler.withAsyncErrorHandling.bind(errorHandler);
export const handleComponentError = errorHandler.handleComponentError.bind(errorHandler);