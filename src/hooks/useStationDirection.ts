import { useMemo } from "react";
import type { Station } from "@/types/smartSchedule";
import { getStationIndex } from "@/lib/stationUtils";

export interface StationDirection {
  direction: "southbound" | "northbound";
  isSouthbound: boolean;
  isNorthbound: boolean;
}

/**
 * Hook to determine the direction of travel between two stations
 */
export function useStationDirection(
  fromStation: Station | "",
  toStation: Station | ""
): StationDirection | null {
  return useMemo(() => {
    if (!fromStation || !toStation) return null;

    const fromIndex = getStationIndex(fromStation);
    const toIndex = getStationIndex(toStation);
    const isSouthbound = fromIndex < toIndex;

    return {
      direction: isSouthbound ? "southbound" : "northbound",
      isSouthbound,
      isNorthbound: !isSouthbound,
    };
  }, [fromStation, toStation]);
}
