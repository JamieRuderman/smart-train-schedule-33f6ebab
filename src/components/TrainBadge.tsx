import { TrainFront } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainBadgeProps {
  tripNumber: number;
  isNextTrip?: boolean;
  isPastTrip?: boolean;
  showAllTrips?: boolean;
}

export function TrainBadge({
  tripNumber,
  isNextTrip = false,
  isPastTrip = false,
  showAllTrips = false,
}: TrainBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 w-16",
        isNextTrip && "text-smart-train-green",
        isPastTrip && showAllTrips && "text-muted-foreground/60"
      )}
    >
      <TrainFront className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      <span className="text-2xl font-semibold min-w-[1.5rem]">
        {tripNumber}
      </span>
    </div>
  );
}

export function NextTrainBadge() {
  return (
    <div className="text-xs bg-primary text-white px-2 py-1 rounded-md font-medium whitespace-nowrap">
      Next Train
    </div>
  );
}
