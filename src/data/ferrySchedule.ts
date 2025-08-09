import type { FerryConnection } from "@/types/smartSchedule";

// Weekday ferry departures from Larkspur and their arrivals
export const weekdayFerries: FerryConnection[] = [
  // Larkspur → San Francisco (Weekdays)
  { depart: "05:45", arrive: "06:20" },
  { depart: "06:30", arrive: "07:05" },
  { depart: "07:15", arrive: "07:50" },
  { depart: "07:55", arrive: "08:30" },
  { depart: "08:40", arrive: "09:15" },
  { depart: "09:25", arrive: "10:00" },
  { depart: "10:10", arrive: "10:45" },
  { depart: "11:50", arrive: "12:25" },
  { depart: "13:30", arrive: "14:05" },
  { depart: "14:10", arrive: "14:45" },
  { depart: "15:05", arrive: "15:40" },
  { depart: "15:45", arrive: "16:20" },
  { depart: "16:35", arrive: "17:10" },
  { depart: "17:15", arrive: "17:50" },
  { depart: "18:10", arrive: "18:45" },
  { depart: "19:15", arrive: "19:50" },
];

// Weekend ferry departures from Larkspur and their arrivals
export const weekendFerries: FerryConnection[] = [
  // Larkspur → San Francisco (Weekends & Holidays)
  { depart: "09:00", arrive: "10:00" },
  { depart: "10:00", arrive: "10:35" },
  { depart: "11:30", arrive: "12:05" },
  { depart: "13:30", arrive: "14:05" },
  { depart: "15:00", arrive: "15:35" },
  { depart: "16:30", arrive: "17:05" },
  { depart: "18:00", arrive: "18:35" },
];


