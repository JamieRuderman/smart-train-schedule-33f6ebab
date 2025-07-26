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

export function StationSelector({
  value,
  onValueChange,
  placeholder,
  label,
}: StationSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {stations.map((station) => (
            <SelectItem key={station} value={station}>
              {station}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
