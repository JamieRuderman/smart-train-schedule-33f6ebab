import { useState, useEffect, useCallback } from "react";
import type { Station, FareType } from "@/types/smartSchedule";
import { APP_CONSTANTS } from "@/lib/fareConstants";

export interface UserPreferences {
  lastSelectedStations: {
    from: Station | "";
    to: Station | "";
  };
  selectedFareType: FareType | "none";
}

const DEFAULT_PREFERENCES: UserPreferences = {
  lastSelectedStations: {
    from: "",
    to: "",
  },
  selectedFareType: "none",
};

const STORAGE_KEY = APP_CONSTANTS.PREFERENCES_STORAGE_KEY;

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

  // Update selected fare type
  const updateSelectedFareType = useCallback(
    (fareType: FareType | "none") => {
      savePreferences({
        selectedFareType: fareType,
      });
    },
    [savePreferences]
  );

  return {
    preferences,
    isLoaded,
    updateLastSelected,
    updateSelectedFareType,
  };
}
