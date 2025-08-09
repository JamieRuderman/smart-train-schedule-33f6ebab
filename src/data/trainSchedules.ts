import type { TrainSchedule } from "@/types/smartSchedule";
import weekdaySchedule from "@/data/weekdaySchedule";
import weekendSchedule from "@/data/weekendSchedule";

export type ScheduleType = "weekday" | "weekend";

export const trainSchedules: Record<ScheduleType, TrainSchedule> = {
  weekday: weekdaySchedule,
  weekend: weekendSchedule,
};

export default trainSchedules;


