import { memo } from "react";
import { cn } from "@/lib/utils";
import type { ProcessedTrip } from "@/lib/scheduleUtils";
import { TimeDisplay } from "./TimeDisplay";
import { TrainBadge, NextTrainBadge } from "./TrainBadge";
import { FerryConnection } from "./FerryConnection";
import { useIsMobile } from "@/hooks/use-mobile";

interface TripCardProps {
  trip: ProcessedTrip;
  fromIndex: number;
  toIndex: number;
  isNextTrip: boolean;
  isPastTrip: boolean;
  showAllTrips: boolean;
  showFerry: boolean;
  timeFormat: "12h" | "24h";
}

export const TripCard = memo(function TripCard({
  trip,
  fromIndex,
  toIndex,
  isNextTrip,
  isPastTrip,
  showAllTrips,
  showFerry,
  timeFormat,
}: TripCardProps) {
  const isMobile = useIsMobile();
  const departureTime = trip.times[fromIndex];
  const arrivalTime = trip.times[toIndex];

  return (
    <div
      className={cn(
        "flex items-center px-4 py-2 rounded-lg border transition-all ",
        "bg-gradient-card",
        "touch-manipulation", // Improve touch responsiveness
        isNextTrip && "ring-2 ring-smart-train-green/50 bg-smart-train-green/5"
      )}
      role="listitem"
      aria-label={`Train ${
        trip.trip
      }, departs ${departureTime}, arrives ${arrivalTime}${
        isNextTrip ? " - Next train" : ""
      }${isPastTrip ? " - Departed" : ""}`}
      tabIndex={0}
    >
      <TrainBadge
        tripNumber={trip.trip}
        isNextTrip={isNextTrip}
        isPastTrip={isPastTrip}
        showAllTrips={showAllTrips}
      />
      {isMobile ? (
        <div className="flex flex-col items-center ml-4 w-full">
          <div className="flex flex-row gap-2 w-full items-center">
            <div className="flex flex-row gap-2 items-center text-sm whitespace-nowrap">
              <TimeDisplay
                time={trip.times[fromIndex]}
                isNextTrip={isNextTrip}
                format={timeFormat}
              />
              <span className="text-muted-foreground">→</span>
              <TimeDisplay
                time={trip.times[toIndex]}
                isNextTrip={isNextTrip}
                format={timeFormat}
              />
            </div>
            {isNextTrip && <NextTrainBadge />}
          </div>
          {showFerry && trip.ferry && (
            <FerryConnection
              ferry={trip.ferry}
              timeFormat={timeFormat}
              isMobile
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-4 ml-4 w-full">
          <div className="flex flex-row gap-2 text-sm">
            <TimeDisplay
              time={trip.times[fromIndex]}
              isNextTrip={isNextTrip}
              format={timeFormat}
            />
            <span className="text-muted-foreground">→</span>
            <TimeDisplay
              time={trip.times[toIndex]}
              isNextTrip={isNextTrip}
              format={timeFormat}
            />
          </div>
          {isNextTrip && <NextTrainBadge />}
          {showFerry && trip.ferry && (
            <FerryConnection ferry={trip.ferry} timeFormat={timeFormat} />
          )}
        </div>
      )}
    </div>
  );
});
