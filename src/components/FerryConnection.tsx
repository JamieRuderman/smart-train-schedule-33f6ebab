import { Badge } from "@/components/ui/badge";
import type { FerryConnection as FerryConnectionType } from "@/types/smartSchedule";
import { TimeDisplay } from "./TimeDisplay";

interface FerryConnectionProps {
  ferry: FerryConnectionType;
  isMobile?: boolean;
  timeFormat?: "12h" | "24h";
}

export function FerryConnection({
  ferry,
  isMobile = false,
  timeFormat = "12h",
}: FerryConnectionProps) {
  if (isMobile) {
    return (
      <div className="flex-grow text-left w-full">
        <Badge className="text-xs text-white">Ferry</Badge>
        <span className="text-xs text-muted-foreground ml-2">
          Departs <TimeDisplay time={ferry.depart} format={timeFormat} />
        </span>
      </div>
    );
  }

  return (
    <div className="flex-grow text-right">
      <span className="text-xs text-muted-foreground mr-2">
        Departs <TimeDisplay time={ferry.depart} format={timeFormat} />
      </span>
      <Badge className="text-xs text-white">Ferry</Badge>
    </div>
  );
}
