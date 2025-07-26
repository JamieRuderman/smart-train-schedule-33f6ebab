import { memo } from "react";
import { cn } from "@/lib/utils";
import type { ProcessedTrip } from "@/lib/scheduleUtils";
import { TimeDisplay } from "./TimeDisplay";
import { TrainBadge, NextTrainBadge } from "./TrainBadge";
import { FerryConnection } from "./FerryConnection";

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
  const departureTime = trip.times[fromIndex];
  const arrivalTime = trip.times[toIndex];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 rounded-lg border transition-all space-y-2 md:space-y-0",
        "bg-gradient-card hover:shadow-md active:scale-[0.98] md:active:scale-100",
        "touch-manipulation", // Improve touch responsiveness
        isNextTrip && "ring-2 ring-smart-green/50 bg-smart-green/5"
      )}
      role="listitem"
      aria-label={`Train ${
        trip.trip
      }, departs ${departureTime}, arrives ${arrivalTime}${
        isNextTrip ? " - Next train" : ""
      }${isPastTrip ? " - Departed" : ""}`}
      tabIndex={0}
    >
      {/* Mobile Layout */}
      <div className="flex flex-col space-y-2 md:hidden">
        {/* Train # and Next Train badge */}
        <div className="flex items-center justify-between">
          <TrainBadge
            tripNumber={trip.trip}
            isNextTrip={isNextTrip}
            isPastTrip={isPastTrip}
            showAllTrips={showAllTrips}
          />
          {isNextTrip && <NextTrainBadge />}
        </div>

        {/* Times */}
        <div className="flex items-center gap-2 text-sm">
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

        {/* Ferry info - only if ferry exists */}
        {showFerry && trip.ferry && (
          <FerryConnection
            ferry={trip.ferry}
            isMobile={true}
            timeFormat={timeFormat}
          />
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:items-center md:gap-4">
        <TrainBadge
          tripNumber={trip.trip}
          isNextTrip={isNextTrip}
          isPastTrip={isPastTrip}
          showAllTrips={showAllTrips}
        />
        <div className="flex items-center gap-2 text-sm">
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
        <div className="hidden md:block">
          <FerryConnection
            ferry={trip.ferry}
            isMobile={false}
            timeFormat={timeFormat}
          />
        </div>
      )}
    </div>
  );
});
