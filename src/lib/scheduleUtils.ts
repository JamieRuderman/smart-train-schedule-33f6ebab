import stations from "@/data/stations";
import trainSchedules, { type ScheduleType } from "@/data/trainSchedules";
import {
  weekdayFerries,
  weekendFerries,
  weekdayInboundFerries,
  weekendInboundFerries,
} from "@/data/ferrySchedule";
import { stationIndexMap, calculateZonesBetweenStations } from "./stationUtils";
import { parseTimeToMinutes, isTimeInPast } from "./timeUtils";
import { FARE_CONSTANTS, FERRY_CONSTANTS } from "./fareConstants";
import type {
  Station,
  TrainTrip,
  FerryConnection,
  FareType,
  FareInfo,
  PaymentMethod,
} from "@/types/smartSchedule";

// Pre-processed data structures
export interface ProcessedTrip {
  trip: number;
  times: string[];
  ferry?: FerryConnection;
  inboundFerry?: FerryConnection;
  departureTime: string;
  arrivalTime: string;
  fromStation: Station;
  toStation: Station;
  isValid: boolean; // Pre-calculated validity
}

interface StationPair {
  fromIndex: number;
  toIndex: number;
  direction: "southbound" | "northbound";
  isSouthbound: boolean;
}

interface ScheduleCache {
  [key: string]: ProcessedTrip[]; // key: "fromStation-toStation-scheduleType"
}

// Note: stationIndexMap is now imported from stationUtils

// Pre-calculate all possible station pairs (used for pre-processing)
const stationPairs: Record<string, StationPair> = {};
stations.forEach((fromStation, fromIndex) => {
  stations.forEach((toStation, toIndex) => {
    if (fromIndex !== toIndex) {
      const key = `${fromStation}-${toStation}`;
      const isSouthbound = fromIndex < toIndex;
      stationPairs[key] = {
        fromIndex,
        toIndex,
        direction: isSouthbound ? "southbound" : "northbound",
        isSouthbound,
      };
    }
  });
});

// Pre-process schedule data
function processScheduleData(): ScheduleCache {
  const cache: ScheduleCache = {};

  const findNextFerry = (
    arrivalTime: string,
    ferries: FerryConnection[]
  ): FerryConnection | undefined => {
    const arrivalMinutes = parseTimeToMinutes(arrivalTime);
    for (const ferry of ferries) {
      if (parseTimeToMinutes(ferry.depart) >= arrivalMinutes) {
        return ferry;
      }
    }
    return undefined;
  };

  // Find inbound ferry that arrives before the train departure with the shortest transfer time
  const findInboundFerry = (
    trainDepartureAtLarkspur: string,
    inboundFerries: FerryConnection[]
  ): FerryConnection | undefined => {
    if (!inboundFerries.length) return undefined;
    const depMinutes = parseTimeToMinutes(trainDepartureAtLarkspur);

    // Only consider ferries that arrive before the train departs
    const validFerries = inboundFerries.filter(
      (ferry) => parseTimeToMinutes(ferry.arrive) < depMinutes
    );

    if (!validFerries.length) return undefined;

    // Find the ferry with the shortest transfer time (i.e., arrives closest to but before departure)
    let best = validFerries[0];
    let bestTransferTime = depMinutes - parseTimeToMinutes(best.arrive);

    for (let i = 1; i < validFerries.length; i++) {
      const ferry = validFerries[i];
      const transferTime = depMinutes - parseTimeToMinutes(ferry.arrive);
      if (transferTime < bestTransferTime) {
        best = ferry;
        bestTransferTime = transferTime;
      }
    }

    return best;
  };

  // Process weekday schedule
  (Object.entries(trainSchedules.weekday) as [string, TrainTrip[]][]).forEach(
    ([direction, trips]) => {
      trips.forEach((trip) => {
        // Pre-calculate validity for all possible station combinations
        stations.forEach((fromStation, fromIndex) => {
          stations.forEach((toStation, toIndex) => {
            if (fromIndex !== toIndex) {
              // Get the correct direction for this station pair
              const pairKey = `${fromStation}-${toStation}`;
              const stationPair = stationPairs[pairKey];

              // Only include trips that match the correct direction for this station pair
              if (stationPair && stationPair.direction === direction) {
                const minIndex = Math.min(fromIndex, toIndex);
                const maxIndex = Math.max(fromIndex, toIndex);
                const departureTime = trip.times[minIndex];
                const arrivalTime = trip.times[maxIndex];
                const isValid =
                  !departureTime.includes("~~") && !arrivalTime.includes("~~");

                if (isValid) {
                  const key = `${fromStation}-${toStation}-weekday`;
                  if (!cache[key]) cache[key] = [];

                  cache[key].push({
                    trip: trip.trip,
                    times: trip.times,
                    ferry:
                      toStation === FERRY_CONSTANTS.FERRY_STATION
                        ? findNextFerry(
                            trip.times[
                              stationIndexMap[FERRY_CONSTANTS.FERRY_STATION]
                            ],
                            weekdayFerries
                          )
                        : undefined,
                    inboundFerry:
                      fromStation === FERRY_CONSTANTS.FERRY_STATION
                        ? findInboundFerry(
                            trip.times[
                              stationIndexMap[FERRY_CONSTANTS.FERRY_STATION]
                            ],
                            weekdayInboundFerries
                          )
                        : undefined,
                    departureTime,
                    arrivalTime,
                    fromStation,
                    toStation,
                    isValid: true,
                  });
                }
              }
            }
          });
        });
      });
    }
  );

  // Process weekend schedule
  (Object.entries(trainSchedules.weekend) as [string, TrainTrip[]][]).forEach(
    ([direction, trips]) => {
      trips.forEach((trip) => {
        // Pre-calculate validity for all possible station combinations
        stations.forEach((fromStation, fromIndex) => {
          stations.forEach((toStation, toIndex) => {
            if (fromIndex !== toIndex) {
              // Get the correct direction for this station pair
              const pairKey = `${fromStation}-${toStation}`;
              const stationPair = stationPairs[pairKey];

              // Only include trips that match the correct direction for this station pair
              if (stationPair && stationPair.direction === direction) {
                const minIndex = Math.min(fromIndex, toIndex);
                const maxIndex = Math.max(fromIndex, toIndex);
                const departureTime = trip.times[minIndex];
                const arrivalTime = trip.times[maxIndex];
                const isValid =
                  !departureTime.includes("~~") && !arrivalTime.includes("~~");

                if (isValid) {
                  const key = `${fromStation}-${toStation}-weekend`;
                  if (!cache[key]) cache[key] = [];

                  cache[key].push({
                    trip: trip.trip,
                    times: trip.times,
                    ferry:
                      toStation === FERRY_CONSTANTS.FERRY_STATION
                        ? findNextFerry(
                            trip.times[
                              stationIndexMap[FERRY_CONSTANTS.FERRY_STATION]
                            ],
                            weekendFerries
                          )
                        : undefined,
                    inboundFerry:
                      fromStation === FERRY_CONSTANTS.FERRY_STATION
                        ? findInboundFerry(
                            trip.times[
                              stationIndexMap[FERRY_CONSTANTS.FERRY_STATION]
                            ],
                            weekendInboundFerries
                          )
                        : undefined,
                    departureTime,
                    arrivalTime,
                    fromStation,
                    toStation,
                    isValid: true,
                  });
                }
              }
            }
          });
        });
      });
    }
  );

  return cache;
}

// Pre-processed schedule cache
const scheduleCache = processScheduleData();

// Fast lookup functions
// Station index function is now exported from stationUtils
export { getStationIndex } from "./stationUtils";

export function getFilteredTrips(
  fromStation: Station,
  toStation: Station,
  scheduleType: ScheduleType
): ProcessedTrip[] {
  const key = `${fromStation}-${toStation}-${scheduleType}`;
  return scheduleCache[key] || [];
}

// Time comparison function is now exported from timeUtils
export { isTimeInPast } from "./timeUtils";

// Fast next trip calculation
export function getNextTripIndex(
  trips: ProcessedTrip[],
  currentTime: Date
): number {
  for (let i = 0; i < trips.length; i++) {
    const departureTime = trips[i].departureTime;
    if (!isTimeInPast(currentTime, departureTime)) {
      return i;
    }
  }
  return -1;
}

// Station and fare utilities are now exported from stationUtils
export { getStationZone, calculateZonesBetweenStations } from "./stationUtils";

export function calculateFare(
  fromStation: Station,
  toStation: Station,
  fareType: FareType,
  paymentMethod: PaymentMethod = "clipper"
): FareInfo {
  const zones = calculateZonesBetweenStations(fromStation, toStation);

  let price = 0;
  let description = "";

  switch (fareType) {
    case "adult":
      price = zones * FARE_CONSTANTS.ADULT_FARE_PER_ZONE;
      description = "Adult (19-64)";
      break;
    case "youth":
      price = 0;
      description = "Youth (0-18) - Free";
      break;
    case "senior":
      price = 0;
      description = "Senior (65+) - Free";
      break;
    case "disabled":
      price =
        zones *
        FARE_CONSTANTS.ADULT_FARE_PER_ZONE *
        FARE_CONSTANTS.DISABLED_DISCOUNT;
      description = "Disabled/Medicare - 50% off";
      break;
    case "clipper-start":
      price =
        zones *
        FARE_CONSTANTS.ADULT_FARE_PER_ZONE *
        FARE_CONSTANTS.CLIPPER_START_DISCOUNT;
      description = "Clipper START - 50% off";
      break;
  }

  return {
    fareType,
    paymentMethod,
    zones,
    price,
    description,
  };
}

export function getAllFareOptions(
  fromStation: Station,
  toStation: Station
): FareInfo[] {
  const fareTypes: FareType[] = [
    "adult",
    "youth",
    "senior",
    "disabled",
    "clipper-start",
  ];
  return fareTypes.map((fareType) =>
    calculateFare(fromStation, toStation, fareType)
  );
}
