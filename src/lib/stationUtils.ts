import type { Station } from "@/types/smartSchedule";
import stations, { stationZones } from "@/data/stations";
import { FERRY_CONSTANTS } from "./fareConstants";

/**
 * Station utilities - derived from pure data
 */

// Pre-computed lookup for station zones (derived from stationZones data)
export const stationZoneMap: Record<Station, number> = stationZones.reduce(
  (acc, { station, zone }) => {
    acc[station] = zone;
    return acc;
  },
  {} as Record<Station, number>
);

// Pre-computed station index lookup (derived from stations data)
export const stationIndexMap: Record<Station, number> = stations.reduce(
  (acc, station, index) => {
    acc[station] = index;
    return acc;
  },
  {} as Record<Station, number>
);

/**
 * Get the zone number for a station
 */
export function getStationZone(station: Station): number {
  return stationZoneMap[station] || 0;
}

/**
 * Get the index position of a station in the route
 */
export function getStationIndex(station: Station): number {
  return stationIndexMap[station];
}

/**
 * Check if a station has ferry connections
 */
export function hasFerryConnection(station: string): boolean {
  return station === FERRY_CONSTANTS.FERRY_STATION;
}

/**
 * Calculate the number of zones between two stations for fare calculation
 */
export function calculateZonesBetweenStations(
  fromStation: Station,
  toStation: Station
): number {
  const fromZone = getStationZone(fromStation);
  const toZone = getStationZone(toStation);
  return Math.abs(toZone - fromZone) + 1; // Include both zones in the calculation
}

/**
 * Get all stations for use in components
 */
export function getAllStations(): Station[] {
  return stations;
}
