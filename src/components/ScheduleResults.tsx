import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle } from "lucide-react";
import { TripCard } from "./TripCard";
import type { ProcessedTrip } from "@/lib/scheduleUtils";
import { isTimeInPast, getNextTripIndex } from "@/lib/scheduleUtils";
import type { Station } from "@/types/smartSchedule";

interface ScheduleResultsProps {
  filteredTrips: ProcessedTrip[];
  fromStation: Station;
  toStation: Station;
  scheduleType: "weekday" | "weekend";
  fromIndex: number;
  toIndex: number;
  currentTime: Date;
  showAllTrips: boolean;
  onToggleShowAllTrips: () => void;
}

export function ScheduleResults({
  filteredTrips,
  fromStation,
  toStation,
  scheduleType,
  fromIndex,
  toIndex,
  currentTime,
  showAllTrips,
  onToggleShowAllTrips,
}: ScheduleResultsProps) {
  const nextTripIndex =
    filteredTrips.length > 0
      ? getNextTripIndex(filteredTrips, fromIndex, currentTime)
      : -1;

  const displayedTrips = showAllTrips
    ? filteredTrips
    : filteredTrips.slice(nextTripIndex >= 0 ? nextTripIndex : 0);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Schedule Results
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {fromStation} → {toStation} •{" "}
          {scheduleType === "weekday" ? "Weekday" : "Weekend/Holiday"}
        </p>
        {nextTripIndex > 0 && !showAllTrips && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleShowAllTrips}
            className="mt-2"
          >
            Show earlier trains ({nextTripIndex} hidden)
          </Button>
        )}
        {showAllTrips && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleShowAllTrips}
            className="mt-2"
          >
            Hide earlier trains
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {nextTripIndex === -1 && !showAllTrips && (
          <div className="mb-4 p-3 bg-smart-gold/10 border border-smart-gold/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-smart-gold" />
              <p className="text-smart-gold font-medium">
                No more trains today
              </p>
            </div>
            <p className="text-sm text-smart-gold/80 mt-1 ml-6">
              All scheduled trains for today have departed
            </p>
          </div>
        )}
        <div className="space-y-3">
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
                currentTime={currentTime}
                isNextTrip={isNextTrip}
                isPastTrip={isPastTrip}
                showAllTrips={showAllTrips}
                showFerry={showFerry}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
