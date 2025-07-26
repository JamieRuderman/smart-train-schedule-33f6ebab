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
      <div className="flex items-center justify-between">
        <Badge className="text-xs text-white">Ferry Connection</Badge>
        <p className="text-xs text-muted-foreground">
          Departs <TimeDisplay time={ferry.depart} format={timeFormat} />
        </p>
      </div>
    );
  }

  return (
    <div className="text-right">
      <span className="text-xs text-muted-foreground mr-4">
        Departs <TimeDisplay time={ferry.depart} format={timeFormat} />
      </span>
      <Badge className="text-xs text-white">Ferry Connection</Badge>
    </div>
  );
}
