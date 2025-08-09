import { Card, CardContent } from "@/components/ui/card";
import { TripCard } from "./TripCard";
import { ScheduleHeader } from "./ScheduleHeader";
import { NoMoreTrainsAlert } from "./NoMoreTrainsAlert";
import type { ProcessedTrip } from "@/lib/scheduleUtils";
import { isTimeInPast, getNextTripIndex } from "@/lib/scheduleUtils";
import { useStationDirection } from "@/hooks/useStationDirection";
import type { Station } from "@/types/smartSchedule";

interface ScheduleResultsProps {
  filteredTrips: ProcessedTrip[];
  fromStation: Station;
  toStation: Station;
  fromIndex: number;
  toIndex: number;
  currentTime: Date;
  showAllTrips: boolean;
  onToggleShowAllTrips: () => void;
  timeFormat: "12h" | "24h";
}

export function ScheduleResults({
  filteredTrips,
  fromStation,
  toStation,
  fromIndex,
  toIndex,
  currentTime,
  showAllTrips,
  onToggleShowAllTrips,
  timeFormat,
}: ScheduleResultsProps) {
  const direction = useStationDirection(fromStation, toStation);

  const nextTripIndex =
    filteredTrips.length > 0
      ? getNextTripIndex(filteredTrips, fromIndex, currentTime)
      : -1;

  const displayedTrips = showAllTrips
    ? filteredTrips
    : filteredTrips.slice(nextTripIndex >= 0 ? nextTripIndex : 0);

  if (!direction) return null;

  return (
    <Card className="border-0 shadow-none md:border md:shadow-sm max-w-4xl mx-auto">
      <ScheduleHeader
        direction={direction.direction}
        currentTime={currentTime}
        timeFormat={timeFormat}
        nextTripIndex={nextTripIndex}
        showAllTrips={showAllTrips}
        onToggleShowAllTrips={onToggleShowAllTrips}
      />
      <CardContent className="p-3 md:p-6 md:pt-0">
        {nextTripIndex === -1 && !showAllTrips && <NoMoreTrainsAlert />}
        <div
          className="space-y-3"
          role="list"
          aria-label="Train schedule results"
        >
          {displayedTrips.map((trip, index) => {
            const isPastTrip = isTimeInPast(currentTime, trip.times[fromIndex]);
            // Find the next trip using the same time logic as isPastTrip
            const isNextTrip =
              !isPastTrip &&
              displayedTrips.slice(0, index).every((prevTrip) => {
                return isTimeInPast(currentTime, prevTrip.times[fromIndex]);
              });
            const showFerry = trip.ferry && toStation === "Larkspur";

            return (
              <TripCard
                key={trip.trip}
                trip={trip}
                fromIndex={fromIndex}
                toIndex={toIndex}
                isNextTrip={isNextTrip}
                isPastTrip={isPastTrip}
                showAllTrips={showAllTrips}
                showFerry={showFerry}
                timeFormat={timeFormat}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
