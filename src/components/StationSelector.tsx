import { memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import stations from "@/data/stations";
import type { Station } from "@/types/smartSchedule";

interface StationSelectorProps {
  value: Station | "";
  onValueChange: (value: Station) => void;
  placeholder: string;
  label: string;
}

export const StationSelector = memo(function StationSelector({
  value,
  onValueChange,
  placeholder,
  label,
}: StationSelectorProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={`station-select-${label.toLowerCase()}`}
        className="text-sm font-medium text-muted-foreground"
      >
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={`station-select-${label.toLowerCase()}`}
          aria-label={`Select ${label.toLowerCase()} station`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent role="listbox" aria-label="Available stations">
          {stations.map((station) => (
            <SelectItem key={station} value={station} role="option">
              {station}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
