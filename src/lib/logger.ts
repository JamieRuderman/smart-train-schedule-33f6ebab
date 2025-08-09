/**
 * Simple logging utility for consistent error handling
 */

export const logger = {
  /**
   * Log a warning message
   */
  warn: (message: string, error?: unknown) => {
    console.warn(`[SMART Train] ${message}`, error || "");
  },

  /**
   * Log an error message
   */
  error: (message: string, error?: unknown) => {
    console.error(`[SMART Train] ${message}`, error || "");
  },

  /**
   * Log info in development mode only
   */
  info: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.info(`[SMART Train] ${message}`, data || "");
    }
  },
} as const;
