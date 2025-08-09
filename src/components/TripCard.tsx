import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import type { ProcessedTrip } from "@/lib/scheduleUtils";
import { TimeDisplay } from "./TimeDisplay";
import { TrainBadge, NextTrainBadge } from "./TrainBadge";
import { FerryConnection } from "./FerryConnection";
import { QuickConnectionModal } from "./QuickConnectionModal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate transfer time for quick connection detection
  const calculateTransferTime = (
    trainTime: string,
    ferryTime: string
  ): number => {
    const cleanTrainTime = trainTime.replace(/[*~]/g, "");
    const cleanFerryTime = ferryTime.replace(/[*~]/g, "");

    const parseTime = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const trainMinutes = parseTime(cleanTrainTime);
    const ferryMinutes = parseTime(cleanFerryTime);

    return ferryMinutes - trainMinutes;
  };

  const hasQuickConnection =
    showFerry &&
    trip.ferry &&
    calculateTransferTime(trip.times[13], trip.ferry.depart) < 10;

  return (
    <>
      <div
        className={cn(
          "flex items-center px-4 py-2 rounded-lg border transition-all ",
          "bg-gradient-card",
          "touch-manipulation", // Improve touch responsiveness
          hasQuickConnection && "cursor-pointer hover:bg-amber-50/50",
          isNextTrip
            ? "ring-2 ring-smart-train-green/50 bg-smart-train-green/5"
            : "focus:bg-none focus:ring-2 focus:ring-smart-gold focus:bg-smart-gold/5 focus:border-smart-gold/20"
        )}
        role="listitem"
        aria-label={`Train ${
          trip.trip
        }, departs ${departureTime}, arrives ${arrivalTime}${
          isNextTrip ? " - Next train" : ""
        }${isPastTrip ? " - Departed" : ""}${
          hasQuickConnection ? " - Tap for transfer warning" : ""
        }`}
        tabIndex={0}
        onClick={hasQuickConnection ? () => setIsModalOpen(true) : undefined}
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
              <div className="flex flex-row gap-2 items-center text-md whitespace-nowrap">
                <TimeDisplay time={trip.times[fromIndex]} format={timeFormat} />
                <span className="text-muted-foreground">→</span>
                <TimeDisplay time={trip.times[toIndex]} format={timeFormat} />
              </div>
              {isNextTrip && <NextTrainBadge />}
            </div>
            {showFerry && trip.ferry && (
              <FerryConnection
                ferry={trip.ferry}
                trainArrivalTime={trip.times[13]}
                timeFormat={timeFormat}
                isMobile
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
            <div className="flex flex-row gap-2 text-md">
              <TimeDisplay
                time={trip.times[fromIndex]}
                isNextTrip={isNextTrip}
                format={timeFormat}
                className="text-right"
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
              <FerryConnection
                ferry={trip.ferry}
                trainArrivalTime={trip.times[13]}
                timeFormat={timeFormat}
              />
            )}
          </div>
        )}
      </div>

      {hasQuickConnection && trip.ferry && (
        <QuickConnectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
});
