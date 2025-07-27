import { DollarSign } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import type { FareType } from "@/types/smartSchedule";

interface FareSelectProps {
  selectedFareType: FareType | "none";
  onFareTypeChange: (fareType: FareType | "none") => void;
  className?: string;
}

const fareTypeOptions = [
  { value: "none", label: "None (hide fare)", title: "Show Fare" },
  { value: "adult", label: "Adult (19-64)", title: "Adult" },
  { value: "youth", label: "Youth (0-18) - Free", title: "Youth" },
  { value: "senior", label: "Senior (65+) - Free", title: "Senior" },
  {
    value: "disabled",
    label: "Disabled/Medicare - 50% off",
    title: "Disabled",
  },
  {
    value: "clipper-start",
    label: "Clipper START - 50% off",
    title: "START",
  },
];

export function FareSelect({
  selectedFareType,
  onFareTypeChange,
  className,
}: FareSelectProps) {
  const isFareActive = selectedFareType !== "none";

  const handleFareTypeChange = (value: string) => {
    onFareTypeChange(value as FareType | "none");
  };

  const currentOption = fareTypeOptions.find(
    (option) => option.value === selectedFareType
  );
  const displayTitle = currentOption?.title || "Fare";

  return (
    <Select value={selectedFareType} onValueChange={handleFareTypeChange}>
      <SelectTrigger
        className={
          //   `${
          //   isFareActive
          //     ? "border-smart-green bg-smart-green/10 text-smart-green"
          //     : "border-muted-foreground/20 text-muted-foreground hover:text-foreground"
          // } ${
          className
        }
        aria-label="Select fare type"
        title="Select fare type"
      >
        {displayTitle}
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          <SelectLabel>Select fare type</SelectLabel>
          {fareTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
