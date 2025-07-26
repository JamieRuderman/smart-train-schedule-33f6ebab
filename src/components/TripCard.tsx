import { cn } from "@/lib/utils";
import type { ProcessedTrip } from "@/lib/scheduleUtils";
import { TimeDisplay } from "./TimeDisplay";
import { TrainBadge, NextTrainBadge } from "./TrainBadge";
import { FerryConnection } from "./FerryConnection";

interface TripCardProps {
  trip: ProcessedTrip;
  fromIndex: number;
  toIndex: number;
  currentTime: Date;
  isNextTrip: boolean;
  isPastTrip: boolean;
  showAllTrips: boolean;
  showFerry: boolean;
}

export function TripCard({
  trip,
  fromIndex,
  toIndex,
  currentTime,
  isNextTrip,
  isPastTrip,
  showAllTrips,
  showFerry,
}: TripCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-lg border transition-all space-y-2 md:space-y-0",
        "bg-gradient-card hover:shadow-md",
        isNextTrip && "ring-2 ring-smart-green/50 bg-smart-green/5"
      )}
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
          <TimeDisplay time={trip.times[fromIndex]} isNextTrip={isNextTrip} />
          <span className="text-muted-foreground">→</span>
          <TimeDisplay time={trip.times[toIndex]} isNextTrip={isNextTrip} />
        </div>

        {/* Ferry info - only if ferry exists */}
        {showFerry && trip.ferry && (
          <FerryConnection ferry={trip.ferry} isMobile={true} />
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
          <TimeDisplay time={trip.times[fromIndex]} isNextTrip={isNextTrip} />
          <span className="text-muted-foreground">→</span>
          <TimeDisplay time={trip.times[toIndex]} isNextTrip={isNextTrip} />
        </div>
        {isNextTrip && <NextTrainBadge />}
      </div>

      {showFerry && trip.ferry && (
        <div className="hidden md:block">
          <FerryConnection ferry={trip.ferry} isMobile={false} />
        </div>
      )}
    </div>
  );
}
