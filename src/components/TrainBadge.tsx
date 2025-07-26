import { Badge } from "@/components/ui/badge";
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
    <Badge
      variant="outline"
      className={cn(
        "font-mono",
        isNextTrip && "border-smart-green text-smart-green",
        isPastTrip && showAllTrips && "border-muted-foreground/30"
      )}
    >
      Train {tripNumber.toString()}
    </Badge>
  );
}

export function NextTrainBadge() {
  return (
    <Badge variant="secondary" className="text-xs bg-primary text-white">
      Next Train
    </Badge>
  );
} 