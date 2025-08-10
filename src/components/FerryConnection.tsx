import type { FerryConnection as FerryConnectionType } from "@/types/smartSchedule";
import { TimeDisplay } from "./TimeDisplay";
import { APP_CONSTANTS, FARE_CONSTANTS } from "@/lib/fareConstants";
import { Ship, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface FerryConnectionProps {
  ferry: FerryConnectionType;
  trainArrivalTime?: string; // for outbound (train -> ferry)
  trainDepartureTime?: string; // for inbound (ferry -> train)
  isMobile?: boolean;
  timeFormat?: "12h" | "24h";
  inbound?: boolean; // when true, show ferry arrival then train departure
}

export function FerryConnection({
  ferry,
  trainArrivalTime,
  trainDepartureTime,
  isMobile = false,
  timeFormat = APP_CONSTANTS.DEFAULT_TIME_FORMAT,
  inbound = false,
}: FerryConnectionProps) {
  // Calculate transfer time in minutes
  const calculateDelta = (a: string, b: string): number => {
    const clean = (t: string) => t.replace(/[*~]/g, "");
    const parseTime = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };
    return parseTime(clean(b)) - parseTime(clean(a));
  };

  const transferTime = inbound
    ? trainDepartureTime
      ? calculateDelta(ferry.arrive, trainDepartureTime)
      : 0
    : trainArrivalTime
    ? calculateDelta(trainArrivalTime, ferry.depart)
    : 0;
  const isShortConnection =
    transferTime < FARE_CONSTANTS.QUICK_CONNECTION_THRESHOLD;

  return (
    <div
      className={cn(
        "flex-grow flex items-center justify-end gap-3 text-muted-foreground",
        isMobile && "flex-row-reverse items-start pt-2"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-end gap-1",
          isMobile && "flex-col-reverse items-start"
        )}
      >
        <div className="flex items-center text-sm">
          <TimeDisplay time={ferry.depart} format={timeFormat} />
          <span className="opacity-60">→</span>
          <TimeDisplay
            time={ferry.arrive}
            format={timeFormat}
            className="text-right"
          />
        </div>
        <div
          className={cn(
            "flex items-center gap-2 text-xs leading-none",
            isShortConnection && "text-smart-gold font-medium"
          )}
        >
          {isShortConnection ? (
            <AlertTriangle className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          {transferTime} min transfer
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col justify-center items-center gap-1",
          isMobile ? "border-r pr-4 mr-1" : "border-l pl-4 ml-1"
        )}
      >
        <Ship className="h-5 w-5" />
        <span className="text-[10px] uppercase">
          {inbound ? "Inbound" : "Outbound"}
        </span>
      </div>
    </div>
  );
}
