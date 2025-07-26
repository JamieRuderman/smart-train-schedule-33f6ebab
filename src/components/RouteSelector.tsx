import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, MapPin, Calendar } from "lucide-react";
import { StationSelector } from "./StationSelector";
import type { Station } from "@/types/smartSchedule";

interface RouteSelectorProps {
  fromStation: Station | "";
  toStation: Station | "";
  scheduleType: "weekday" | "weekend";
  onFromStationChange: (station: Station) => void;
  onToStationChange: (station: Station) => void;
  onScheduleTypeChange: (type: "weekday" | "weekend") => void;
  onSwapStations: () => void;
}

export const RouteSelector = memo(function RouteSelector({
  fromStation,
  toStation,
  scheduleType,
  onFromStationChange,
  onToStationChange,
  onScheduleTypeChange,
  onSwapStations,
}: RouteSelectorProps) {
  return (
    <Card
      className="mb-6 shadow-card"
      role="region"
      aria-labelledby="route-planning-title"
    >
      <CardHeader>
        <CardTitle
          id="route-planning-title"
          className="flex items-center gap-2"
        >
          <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
          Plan Your Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <StationSelector
            value={fromStation}
            onValueChange={onFromStationChange}
            placeholder="Select departure station"
            label="From"
          />

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <StationSelector
                value={toStation}
                onValueChange={onToStationChange}
                placeholder="Select arrival station"
                label="To"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onSwapStations}
              className="mt-6 shrink-0"
              disabled={!fromStation || !toStation}
              aria-label="Swap departure and arrival stations"
              title="Swap departure and arrival stations"
            >
              <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <Tabs
          value={scheduleType}
          onValueChange={onScheduleTypeChange}
          aria-label="Select schedule type"
        >
          <TabsList className="grid grid-cols-2 w-full" role="tablist">
            <TabsTrigger
              value="weekday"
              className="flex items-center gap-2"
              aria-label="Weekday schedule"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Weekday
            </TabsTrigger>
            <TabsTrigger
              value="weekend"
              className="flex items-center gap-2"
              aria-label="Weekend and holiday schedule"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Weekend
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
});
