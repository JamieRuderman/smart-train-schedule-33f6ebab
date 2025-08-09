import { memo } from "react";
import { cn } from "@/lib/utils";
import { APP_CONSTANTS } from "@/lib/fareConstants";

interface TimeDisplayProps {
  time: string;
  isNextTrip?: boolean;
  format?: "12h" | "24h";
}

/**
 * Formats a 24-hour time string (e.g., "14:35") into the specified format.
 */
function formatTime(
  time: string,
  format: "12h" | "24h" = APP_CONSTANTS.DEFAULT_TIME_FORMAT
) {
  const cleanTime = time.replace(/\*/g, "");
  const [hoursStr, minutesStr] = cleanTime.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (format === "24h") {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  // 12-hour format
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const period = hours >= 12 ? "PM" : "AM";

  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export const TimeDisplay = memo(function TimeDisplay({
  time,
  isNextTrip = false,
  format = APP_CONSTANTS.DEFAULT_TIME_FORMAT,
  className,
}: TimeDisplayProps & { className?: string }) {
  return (
    <span
      className={cn(
        "font-medium",
        isNextTrip && "text-smart-train-green",
        "min-w-16",
        className
      )}
    >
      {formatTime(time, format)}
    </span>
  );
});
