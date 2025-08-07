import { Badge } from "@/components/ui/badge";
import type { FerryConnection as FerryConnectionType } from "@/types/smartSchedule";
import { TimeDisplay } from "./TimeDisplay";
import { Ship, Link2 } from "lucide-react";

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
      <div className="flex-grow w-full text-smart-train-green text-sm mt-1">
        <Ship className="h-4 w-4 inline-block mr-2 -mt-1" />
        <TimeDisplay time={ferry.depart} format={timeFormat} />
        <span className="ml-2 opacity-80">Ferry</span>
      </div>
    );
  }

  return (
    <div className="flex-grow text-right inline">
      <span className="inline-flex flex-col mx-3 text-sm text-smart-train-green leading-none gap-0.5">
        <TimeDisplay time={ferry.depart} format={timeFormat} />
        <span className="text-[10px] opacity-70 uppercase">Ferry</span>
      </span>
      <Ship className="h-6 w-6 inline-block text-smart-train-green" />
    </div>
  );
}
