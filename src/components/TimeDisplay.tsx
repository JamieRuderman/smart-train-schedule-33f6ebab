import { cn } from "@/lib/utils";

interface TimeDisplayProps {
  time: string;
  isNextTrip?: boolean;
}

/**
 * Formats a 24-hour time string (e.g., "14:35") into 12-hour format with AM/PM.
 */
function formatTime(time: string) {
  const cleanTime = time.replace(/\*/g, "");
  const [hoursStr, minutesStr] = cleanTime.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const period = hours >= 12 ? "PM" : "AM";

  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function TimeDisplay({ time, isNextTrip = false }: TimeDisplayProps) {
  return (
    <span className={cn("font-medium", isNextTrip && "text-smart-green")}>
      {formatTime(time)}
    </span>
  );
} 