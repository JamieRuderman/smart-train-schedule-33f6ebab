import type { Station, StationZone } from "@/types/smartSchedule";

// Zone mapping based on SMART train route
export const stationZones: StationZone[] = [
  { station: "Windsor", zone: 1 },
  { station: "Sonoma County Airport", zone: 1 },
  { station: "Santa Rosa North", zone: 2 },
  { station: "Santa Rosa Downtown", zone: 2 },
  { station: "Rohnert Park", zone: 3 },
  { station: "Cotati", zone: 3 },
  { station: "Petaluma North", zone: 3 },
  { station: "Petaluma Downtown", zone: 3 },
  { station: "Novato San Marin", zone: 4 },
  { station: "Novato Downtown", zone: 4 },
  { station: "Novato Hamilton", zone: 4 },
  { station: "Marin Civic Center", zone: 5 },
  { station: "San Rafael", zone: 5 },
  { station: "Larkspur", zone: 5 },
];

// Derive stations from stationZones to avoid duplication
const stations: Station[] = stationZones.map(({ station }) => station);

// Quick lookup for station zones
export const stationZoneMap: Record<Station, number> = stationZones.reduce(
  (acc, { station, zone }) => {
    acc[station] = zone;
    return acc;
  },
  {} as Record<Station, number>
);

export default stations;
