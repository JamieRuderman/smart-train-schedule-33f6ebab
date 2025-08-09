/**
 * Fare calculation constants
 * These represent the current SMART train fare structure
 */

export const FARE_CONSTANTS = {
  // Base fare per zone for adults
  ADULT_FARE_PER_ZONE: 1.5,

  // Discount multipliers
  DISABLED_DISCOUNT: 0.75, // 50% off
  CLIPPER_START_DISCOUNT: 0.75, // 50% off

  // Quick connection threshold in minutes
  QUICK_CONNECTION_THRESHOLD: 10,

  // Time intervals
  MINUTE_UPDATE_INTERVAL: 60000, // 1 minute in milliseconds
} as const;

/**
 * Ferry-specific constants
 */
export const FERRY_CONSTANTS = {
  // Station that has ferry connections
  FERRY_STATION: "Larkspur",
} as const;

/**
 * App configuration constants
 */
export const APP_CONSTANTS = {
  // Default time format
  DEFAULT_TIME_FORMAT: "12h" as const,

  // LocalStorage keys
  PREFERENCES_STORAGE_KEY: "smart-train-preferences",
  THEME_STORAGE_KEY: "vite-ui-theme",
} as const;
