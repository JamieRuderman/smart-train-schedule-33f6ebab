/*
 * Updates SMART train and Golden Gate Ferry schedules using 511.org GTFS feeds.
 *
 * Usage:
 *   TRANSIT_511_API_KEY=your_key npm run update-transit
 *
 * The script fetches the GTFS zip files, extracts the portions we use, and
 * regenerates the TypeScript data modules under src/data/generated/.
 */

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import AdmZip from "adm-zip";
import { parse } from "csv-parse/sync";

import stations from "@/data/stations";
import { STATION_COUNT } from "@/types/smartSchedule";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, "../src/data/generated");

if (stations.length !== STATION_COUNT) {
  throw new Error(
    `Station count mismatch: expected ${STATION_COUNT}, got ${stations.length}. Ensure stations.ts stays in sync with types.`
  );
}

const BASE_GTFS_URL = "https://api.511.org/transit/datafeeds";
const SMART_OPERATOR_ID = "SA"; // Sonoma Marin Area Rail Transit
const GOLDEN_GATE_FERRY_OPERATOR_ID = "GF";

const SMART_FEED_URL = (token: string) =>
  `${BASE_GTFS_URL}?api_key=${token}&operator_id=${SMART_OPERATOR_ID}`;

const FERRY_FEED_URL = (token: string) =>
  `${BASE_GTFS_URL}?api_key=${token}&operator_id=${GOLDEN_GATE_FERRY_OPERATOR_ID}`;

type ScheduleType = "weekday" | "weekend";

type TrainDirection = "northbound" | "southbound";

type TrainTripOutput = {
  trip: number;
  times: string[];
};

type TrainScheduleOutput = Record<TrainDirection, TrainTripOutput[]>;

type TrainSchedulesOutput = Record<ScheduleType, TrainScheduleOutput>;

type FerryTrip = {
  depart: string;
  arrive: string;
};

type FerrySchedulesOutput = {
  weekdayFerries: FerryTrip[];
  weekendFerries: FerryTrip[];
  weekdayInboundFerries: FerryTrip[];
  weekendInboundFerries: FerryTrip[];
};

type CsvRow = Record<string, string>;

type GtfsFiles = {
  stops: CsvRow[];
  stopTimes: CsvRow[];
  trips: CsvRow[];
  calendar: CsvRow[];
  calendarDates: CsvRow[];
  routes: CsvRow[];
};

const EXPECTED_TRAIN_STATIONS = stations.length;

function assertOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

async function fetchZip(url: string): Promise<AdmZip> {
  const response = await fetch(url);

  if (!response.ok) {
    let errorBody = "";
    try {
      errorBody = await response.text();
    } catch (error) {
      errorBody = `unable to read error body: ${(error as Error).message}`;
    }

    throw new Error(
      `Failed to fetch GTFS feed (${response.status} ${response.statusText}) - ${errorBody.trim()}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  return new AdmZip(Buffer.from(arrayBuffer));
}

function loadGtfs(zip: AdmZip): GtfsFiles {
  const parseFile = (filename: string): CsvRow[] => {
    const entry = zip.getEntry(filename);

    if (!entry) {
      throw new Error(`Expected ${filename} in GTFS archive but it was not found.`);
    }

    const content = entry.getData().toString("utf-8");
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CsvRow[];
  };

  return {
    stops: parseFile("stops.txt"),
    stopTimes: parseFile("stop_times.txt"),
    trips: parseFile("trips.txt"),
    calendar: parseFile("calendar.txt"),
    calendarDates: parseFile("calendar_dates.txt"),
    routes: parseFile("routes.txt"),
  };
}

function normalise(str: string): string {
  return str
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/smart|station|ctr|center|platform|northbound|southbound|north|south|nb|sb|bound|terminal/g, "")
    .replace(/[^a-z]/g, "")
    .trim();
}

function toTimeString(raw: string): string {
  const [hours, minutes] = raw.split(":");
  const hourNumber = Number(hours);
  const adjustedHours = ((hourNumber % 24) + 24) % 24; // guard against negatives
  return `${adjustedHours.toString().padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}

function deriveServiceTypes(calendarRows: CsvRow[]): Map<string, ScheduleType> {
  const serviceTypes = new Map<string, ScheduleType>();

  for (const row of calendarRows) {
    const weekdayActive = ["monday", "tuesday", "wednesday", "thursday", "friday"].some(
      (day) => row[day] === "1"
    );
    const weekendActive = ["saturday", "sunday"].some((day) => row[day] === "1");

    if (weekdayActive && !weekendActive) {
      serviceTypes.set(row.service_id, "weekday");
    } else if (weekendActive && !weekdayActive) {
      serviceTypes.set(row.service_id, "weekend");
    }
  }

  return serviceTypes;
}

function allTimesPresent(times: (string | undefined)[]): times is string[] {
  return times.every((time): time is string => typeof time === "string");
}

function buildStopIdToStationMap(stops: CsvRow[]): Map<string, string> {
  const stationMap = new Map<string, string>();
  const normalizedStations = new Map<string, string>();

  for (const station of stations) {
    normalizedStations.set(normalise(station), station);
  }

  for (const stop of stops) {
    const { stop_id: stopId, stop_name: stopName } = stop;
    if (!stopId || !stopName) continue;

    const normalizedStop = normalise(stopName);
    const match = normalizedStations.get(normalizedStop);

    if (match) {
      stationMap.set(stopId, match);
      continue;
    }

    // Fallback: try to match if station name is contained in stop name (handles NB/SB variants).
    for (const [normalizedStation, originalStation] of normalizedStations.entries()) {
      if (normalizedStop.includes(normalizedStation)) {
        stationMap.set(stopId, originalStation);
        break;
      }
    }
  }

  return stationMap;
}

function buildTrainSchedules(gtfs: GtfsFiles): TrainSchedulesOutput {
  const serviceTypes = deriveServiceTypes(gtfs.calendar);
  const stopToStation = buildStopIdToStationMap(gtfs.stops);

  const stopTimesByTrip = new Map<string, CsvRow[]>();
  for (const stopTime of gtfs.stopTimes) {
    const tripStopTimes = stopTimesByTrip.get(stopTime.trip_id) ?? [];
    tripStopTimes.push(stopTime);
    stopTimesByTrip.set(stopTime.trip_id, tripStopTimes);
  }

  const schedules: TrainSchedulesOutput = {
    weekday: { northbound: [], southbound: [] },
    weekend: { northbound: [], southbound: [] },
  };

  for (const trip of gtfs.trips) {
    const { trip_id: tripId, service_id: serviceId } = trip;
    if (!tripId || !serviceId) continue;

    const scheduleType = serviceTypes.get(serviceId);
    if (!scheduleType) continue; // Ignore service IDs that do not map cleanly to weekday/weekend

    const tripStopTimes = stopTimesByTrip.get(tripId);
    if (!tripStopTimes || tripStopTimes.length === 0) continue;

    const sortedStopTimes = [...tripStopTimes].sort(
      (a, b) => Number(a.stop_sequence) - Number(b.stop_sequence)
    );

    const stationTimes = new Array<string | undefined>(EXPECTED_TRAIN_STATIONS).fill(undefined);
    let firstStationIndex: number | undefined;
    let lastStationIndex: number | undefined;

    for (const stopTime of sortedStopTimes) {
      const stationName = stopToStation.get(stopTime.stop_id);
      if (!stationName) continue;

      const stationIndex = stations.indexOf(stationName);
      if (stationIndex === -1) continue;

      const timeRaw = stopTime.departure_time || stopTime.arrival_time;
      if (!timeRaw) continue;

      stationTimes[stationIndex] = toTimeString(timeRaw);

      if (firstStationIndex === undefined) {
        firstStationIndex = stationIndex;
      }

      lastStationIndex = stationIndex;
    }

    if (!allTimesPresent(stationTimes)) {
      continue; // Skip trips that do not serve every SMART station
    }

    if (firstStationIndex === undefined || lastStationIndex === undefined) {
      continue;
    }

    const direction: TrainDirection = firstStationIndex < lastStationIndex ? "southbound" : "northbound";
    const times = stationTimes.slice();

    const bucket = schedules[scheduleType][direction];
    const duplicateTrip = bucket.find((existing) =>
      existing.times.every((value, index) => value === times[index])
    );

    if (duplicateTrip) {
      continue;
    }

    const tripIdentifier = trip.trip_short_name || trip.trip_id;
    const numericId = Number(tripIdentifier.replace(/[^0-9]/g, ""));
    const tripNumber = Number.isFinite(numericId) && numericId > 0 ? numericId : bucket.length + 1;

    bucket.push({
      trip: tripNumber,
      times,
    });
  }

  for (const scheduleType of Object.keys(schedules) as ScheduleType[]) {
    for (const direction of ["northbound", "southbound"] as TrainDirection[]) {
      schedules[scheduleType][direction].sort((a, b) => {
        const index = direction === "southbound" ? 0 : stations.length - 1;
        const [aHours, aMinutes] = a.times[index].split(":").map(Number);
        const [bHours, bMinutes] = b.times[index].split(":").map(Number);
        return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
      });
    }
  }

  return schedules;
}

function buildFerrySchedules(gtfs: GtfsFiles): FerrySchedulesOutput {
  const serviceTypes = deriveServiceTypes(gtfs.calendar);

  const stopRoleMap = new Map<string, "larkspur" | "sf">();

  for (const stop of gtfs.stops) {
    const stopName = stop.stop_name?.toLowerCase() ?? "";
    if (stopName.includes("larkspur") && stopName.includes("ferry")) {
      stopRoleMap.set(stop.stop_id, "larkspur");
    } else if (stopName.includes("san francisco") && stopName.includes("ferry")) {
      stopRoleMap.set(stop.stop_id, "sf");
    }
  }

  const stopTimesByTrip = new Map<string, CsvRow[]>();
  for (const stopTime of gtfs.stopTimes) {
    const list = stopTimesByTrip.get(stopTime.trip_id) ?? [];
    list.push(stopTime);
    stopTimesByTrip.set(stopTime.trip_id, list);
  }

  const ferrySchedules: FerrySchedulesOutput = {
    weekdayFerries: [],
    weekendFerries: [],
    weekdayInboundFerries: [],
    weekendInboundFerries: [],
  };

  for (const trip of gtfs.trips) {
    const serviceType = serviceTypes.get(trip.service_id ?? "");
    if (!serviceType) continue;

    const tripStopTimes = stopTimesByTrip.get(trip.trip_id ?? "");
    if (!tripStopTimes) continue;

    const sortedStops = [...tripStopTimes].sort(
      (a, b) => Number(a.stop_sequence) - Number(b.stop_sequence)
    );

    const withRoles = sortedStops
      .map((stopTime) => ({
        role: stopRoleMap.get(stopTime.stop_id ?? ""),
        stopTime,
      }))
      .filter((item) => item.role);

    const larkspurStop = withRoles.find((item) => item.role === "larkspur");
    const sfStop = withRoles.find((item) => item.role === "sf");

    if (!larkspurStop || !sfStop) continue;

    const larkspurSequence = Number(larkspurStop.stopTime.stop_sequence);
    const sfSequence = Number(sfStop.stopTime.stop_sequence);

    const departStop = larkspurSequence < sfSequence ? larkspurStop : sfStop;
    const arriveStop = larkspurSequence < sfSequence ? sfStop : larkspurStop;
    const arrayKeyPrefix = departStop.role === "larkspur" ? "" : "Inbound";

    const departureTimeRaw = departStop.stopTime.departure_time || departStop.stopTime.arrival_time;
    const arrivalTimeRaw = arriveStop.stopTime.arrival_time || arriveStop.stopTime.departure_time;

    if (!departureTimeRaw || !arrivalTimeRaw) continue;

    const depart = toTimeString(departureTimeRaw);
    const arrive = toTimeString(arrivalTimeRaw);

    if (arrayKeyPrefix === "") {
      ferrySchedules[`${serviceType}Ferries` as keyof FerrySchedulesOutput].push({ depart, arrive });
    } else {
      ferrySchedules[`${serviceType}${arrayKeyPrefix}Ferries` as keyof FerrySchedulesOutput].push({
        depart,
        arrive,
      });
    }
  }

  for (const key of Object.keys(ferrySchedules) as (keyof FerrySchedulesOutput)[]) {
    ferrySchedules[key].sort((a, b) => {
      const [aHours, aMinutes] = a.depart.split(":").map(Number);
      const [bHours, bMinutes] = b.depart.split(":").map(Number);
      return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
    });
  }

  return ferrySchedules;
}

function emitTrainSchedulesFile(data: TrainSchedulesOutput): void {
  const outputPath = path.resolve(OUTPUT_DIR, "trainSchedules.generated.ts");
  const content = `// Auto-generated by scripts/updateTransitFeeds.ts
// Do not edit manually.
import type { TrainSchedule } from "@/types/smartSchedule";

export type ScheduleType = "weekday" | "weekend";

export const trainSchedules: Record<ScheduleType, TrainSchedule> = ${JSON.stringify(
    data,
    null,
    2
  )};

export default trainSchedules;
`;

  fs.writeFileSync(outputPath, content, "utf-8");
}

function emitFerrySchedulesFile(data: FerrySchedulesOutput): void {
  const outputPath = path.resolve(OUTPUT_DIR, "ferrySchedule.generated.ts");
  const content = `// Auto-generated by scripts/updateTransitFeeds.ts
// Do not edit manually.
import type { FerryConnection } from "@/types/smartSchedule";

export const weekdayFerries: FerryConnection[] = ${JSON.stringify(
    data.weekdayFerries,
    null,
    2
  )};

export const weekendFerries: FerryConnection[] = ${JSON.stringify(
    data.weekendFerries,
    null,
    2
  )};

export const weekdayInboundFerries: FerryConnection[] = ${JSON.stringify(
    data.weekdayInboundFerries,
    null,
    2
  )};

export const weekendInboundFerries: FerryConnection[] = ${JSON.stringify(
    data.weekendInboundFerries,
    null,
    2
  )};

export default {
  weekdayFerries,
  weekendFerries,
  weekdayInboundFerries,
  weekendInboundFerries,
};
`;

  fs.writeFileSync(outputPath, content, "utf-8");
}

async function updateFeeds(): Promise<void> {
  const apiKey = process.env.TRANSIT_511_API_KEY;

  if (!apiKey) {
    throw new Error("TRANSIT_511_API_KEY environment variable is required to update transit feeds.");
  }

  assertOutputDir();

  console.log("Fetching SMART GTFS feed...");
  const smartZip = await fetchZip(SMART_FEED_URL(apiKey));
  const smartGtfs = loadGtfs(smartZip);
  console.log("Processing SMART GTFS feed...");
  const trainSchedules = buildTrainSchedules(smartGtfs);
  emitTrainSchedulesFile(trainSchedules);

  console.log("Fetching Golden Gate Ferry GTFS feed...");
  const ferryZip = await fetchZip(FERRY_FEED_URL(apiKey));
  const ferryGtfs = loadGtfs(ferryZip);
  console.log("Processing Golden Gate Ferry GTFS feed...");
  const ferrySchedules = buildFerrySchedules(ferryGtfs);
  emitFerrySchedulesFile(ferrySchedules);

  const trainTripCounts = {
    weekdaySouthbound: trainSchedules.weekday.southbound.length,
    weekdayNorthbound: trainSchedules.weekday.northbound.length,
    weekendSouthbound: trainSchedules.weekend.southbound.length,
    weekendNorthbound: trainSchedules.weekend.northbound.length,
  };

  console.log("Generated SMART train schedules", trainTripCounts);
  console.log("Generated ferry schedules", {
    weekday: ferrySchedules.weekdayFerries.length,
    weekend: ferrySchedules.weekendFerries.length,
    weekdayInbound: ferrySchedules.weekdayInboundFerries.length,
    weekendInbound: ferrySchedules.weekendInboundFerries.length,
  });
}

updateFeeds().catch((error) => {
  console.error("Failed to update transit feeds:", error);
  process.exitCode = 1;
});
