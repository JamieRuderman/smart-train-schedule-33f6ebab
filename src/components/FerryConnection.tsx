import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FerryConnection as FerryConnectionType } from "@/types/smartSchedule";
import { TimeDisplay } from "./TimeDisplay";
import { Ship, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface FerryConnectionProps {
  ferry: FerryConnectionType;
  trainArrivalTime: string;
  isMobile?: boolean;
  timeFormat?: "12h" | "24h";
  onQuickConnectionClick?: () => void;
}

export function FerryConnection({
  ferry,
  trainArrivalTime,
  isMobile = false,
  timeFormat = "12h",
  onQuickConnectionClick,
}: FerryConnectionProps) {
  // Calculate transfer time in minutes
  const calculateTransferTime = (
    trainTime: string,
    ferryTime: string
  ): number => {
    // Remove any formatting like * or ~~ from times
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

  const transferTime = calculateTransferTime(trainArrivalTime, ferry.depart);
  const isShortConnection = transferTime < 10;
  if (isMobile) {
    return (
      <div className="flex-grow w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-smart-train-green text-sm">
            <Ship className="h-4 w-4 mr-2" />
            <TimeDisplay time={ferry.depart} format={timeFormat} />
            <span className="mx-1 opacity-60">→</span>
            <TimeDisplay time={ferry.arrive} format={timeFormat} />
            <span className="ml-2 opacity-80 text-xs">Ferry</span>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 text-xs",
              isShortConnection
                ? "text-smart-gold font-medium"
                : "text-muted-foreground"
            )}
          >
            {isShortConnection ? (
              <AlertTriangle className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {transferTime} min transfer
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-end gap-3">
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center text-sm text-smart-train-green">
          <TimeDisplay time={ferry.depart} format={timeFormat} />
          <span className="opacity-60">→</span>
          <TimeDisplay
            time={ferry.arrive}
            format={timeFormat}
            className="text-right"
          />
        </div>
        <div
          className={cn(
            "flex items-center gap-2 text-xs leading-none",
            isShortConnection
              ? "text-smart-gold font-medium"
              : "text-muted-foreground"
          )}
        >
          {isShortConnection ? (
            <AlertTriangle className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          {transferTime} min transfer
        </div>
      </div>
      <div className="flex flex-col justify-center items-center px-1 ml-1 gap-1 text-smart-train-green">
        <Ship className="h-5 w-5 ml-1" />
        <span className="text-[10px] uppercase">Ferry</span>
      </div>
    </div>
  );
}
