// Number of stations (keep in sync with stations.json)
export type Station =
  | "Windsor"
  | "Sonoma County Airport"
  | "Santa Rosa North"
  | "Santa Rosa Downtown"
  | "Rohnert Park"
  | "Cotati"
  | "Petaluma North"
  | "Petaluma Downtown"
  | "Novato San Marin"
  | "Novato Downtown"
  | "Novato Hamilton"
  | "Marin Civic Center"
  | "San Rafael"
  | "Larkspur";

export const STATION_COUNT = 14;

export interface FerryConnection {
  depart: string;
  arrive: string;
}

// Helper type for a tuple of N strings
export type TupleOf<
  T,
  N extends number,
  R extends T[] = []
> = R["length"] extends N ? R : TupleOf<T, N, [T, ...R]>;

export interface TrainTrip {
  trip: number;
  times: TupleOf<string, typeof STATION_COUNT>;
  ferry?: FerryConnection;
}

export interface DirectionSchedule {
  trips: TrainTrip[];
}

export interface WeekdaySchedule {
  southbound: DirectionSchedule;
  northbound: DirectionSchedule;
}

export interface WeekendSchedule {
  southbound: DirectionSchedule;
  northbound: DirectionSchedule;
}
