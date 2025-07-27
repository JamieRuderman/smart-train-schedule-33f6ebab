import type { Station, StationZone } from "@/types/smartSchedule";

const stations: Station[] = [
  "Windsor",
  "Sonoma County Airport",
  "Santa Rosa North",
  "Santa Rosa Downtown",
  "Rohnert Park",
  "Cotati",
  "Petaluma North",
  "Petaluma Downtown",
  "Novato San Marin",
  "Novato Downtown",
  "Novato Hamilton",
  "Marin Civic Center",
  "San Rafael",
  "Larkspur",
];

// Zone mapping based on SMART train route
export const stationZones: StationZone[] = [
  { station: "Windsor", zone: 1 },
  { station: "Sonoma County Airport", zone: 1 },
  { station: "Santa Rosa North", zone: 2 },
  { station: "Santa Rosa Downtown", zone: 2 },
  { station: "Rohnert Park", zone: 3 },
  { station: "Cotati", zone: 3 },
  { station: "Petaluma North", zone: 4 },
  { station: "Petaluma Downtown", zone: 4 },
  { station: "Novato San Marin", zone: 5 },
  { station: "Novato Downtown", zone: 5 },
  { station: "Novato Hamilton", zone: 5 },
  { station: "Marin Civic Center", zone: 6 },
  { station: "San Rafael", zone: 6 },
  { station: "Larkspur", zone: 6 },
];

// Quick lookup for station zones
export const stationZoneMap: Record<Station, number> = stationZones.reduce(
  (acc, { station, zone }) => {
    acc[station] = zone;
    return acc;
  },
  {} as Record<Station, number>
);

export default stations;
