import { useState, useEffect, useCallback } from "react";
import type { Station } from "@/types/smartSchedule";

export interface UserPreferences {
  favoriteRoutes: Array<{
    from: Station;
    to: Station;
    name?: string;
  }>;
  defaultScheduleType: "weekday" | "weekend";
  timeFormat: "12h" | "24h";
  showAllTrips: boolean;
  lastSelectedStations: {
    from: Station | "";
    to: Station | "";
  };
}

const DEFAULT_PREFERENCES: UserPreferences = {
  favoriteRoutes: [],
  defaultScheduleType: "weekday",
  timeFormat: "12h",
  showAllTrips: false,
  lastSelectedStations: {
    from: "",
    to: "",
  },
};

const STORAGE_KEY = "smart-train-preferences";

/**
 * Custom hook for managing user preferences with localStorage persistence
 */
export function useUserPreferences() {
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<UserPreferences>;
        setPreferences((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn("Failed to load user preferences:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  const savePreferences = useCallback(
    (newPreferences: Partial<UserPreferences>) => {
      try {
        const updated = { ...preferences, ...newPreferences };
        setPreferences(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.warn("Failed to save user preferences:", error);
      }
    },
    [preferences]
  );

  // Update last selected stations
  const updateLastSelected = useCallback(
    (from: Station | "", to: Station | "") => {
      savePreferences({
        lastSelectedStations: { from, to },
      });
    },
    [savePreferences]
  );

  // Update default schedule type
  const updateDefaultScheduleType = useCallback(
    (type: "weekday" | "weekend") => {
      savePreferences({ defaultScheduleType: type });
    },
    [savePreferences]
  );

  // Update time format preference
  const updateTimeFormat = useCallback(
    (format: "12h" | "24h") => {
      savePreferences({ timeFormat: format });
    },
    [savePreferences]
  );

  // Update show all trips preference
  const updateShowAllTrips = useCallback(
    (show: boolean) => {
      savePreferences({ showAllTrips: show });
    },
    [savePreferences]
  );

  return {
    preferences,
    isLoaded,
    updateLastSelected,
    updateDefaultScheduleType,
    updateTimeFormat,
    updateShowAllTrips,
  };
}
