import stations, { stationZoneMap } from "@/data/stations";
import weekdaySchedule from "@/data/weekdaySchedule";
import weekendSchedule from "@/data/weekendSchedule";
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

// Pre-calculated lookup tables
const stationIndexMap: Record<Station, number> = stations.reduce(
  (acc, station, index) => {
    acc[station] = index;
    return acc;
  },
  {} as Record<Station, number>
);

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

  // Process weekday schedule
  (Object.entries(weekdaySchedule) as [string, TrainTrip[]][]).forEach(
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
                    ferry: trip.ferry,
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
  (Object.entries(weekendSchedule) as [string, TrainTrip[]][]).forEach(
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
                    ferry: trip.ferry,
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
export function getStationIndex(station: Station): number {
  return stationIndexMap[station];
}

export function getFilteredTrips(
  fromStation: Station,
  toStation: Station,
  scheduleType: "weekday" | "weekend"
): ProcessedTrip[] {
  const key = `${fromStation}-${toStation}-${scheduleType}`;
  return scheduleCache[key] || [];
}

// Optimized time comparison with proper timezone handling
export function isTimeInPast(currentTime: Date, timeString: string): boolean {
  const cleanTime = timeString.replace(/\*/g, "");
  const [hoursStr, minutesStr] = cleanTime.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Create a new date for today with the specific time
  const tripTime = new Date(currentTime);
  tripTime.setHours(hours, minutes, 0, 0);

  return tripTime < currentTime;
}

// Fast next trip calculation
export function getNextTripIndex(
  trips: ProcessedTrip[],
  fromIndex: number,
  currentTime: Date
): number {
  for (let i = 0; i < trips.length; i++) {
    const departureTime = trips[i].times[fromIndex];
    if (!isTimeInPast(currentTime, departureTime)) {
      return i;
    }
  }
  return -1;
}

// Fare calculation utilities
export function getStationZone(station: Station): number {
  return stationZoneMap[station] || 0;
}

export function calculateZonesBetweenStations(
  fromStation: Station,
  toStation: Station
): number {
  const fromZone = getStationZone(fromStation);
  const toZone = getStationZone(toStation);
  return Math.abs(toZone - fromZone) + 1; // Include both zones in the calculation
}

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
      price = zones * 1.5;
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
      price = zones * 0.75;
      description = "Disabled/Medicare - 50% off";
      break;
    case "clipper-start":
      price = zones * 0.75;
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
