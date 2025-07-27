import { memo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, MapPin, Calendar, Target } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import stations from "@/data/stations";
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
    <Card className="-mt-36 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle
          id="route-planning-title"
          className="flex items-center gap-2"
        >
          Plan Your Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Compact Route Selection */}
        <div className="flex items-center gap-4">
          {/* Visual Indicators */}
          <div className="flex flex-col items-center">
            <MapPin className="h-5 w-5 text-primary fill-primary" />
            <div className="w-px h-6 border-l border-dotted border-muted-foreground my-2"></div>
            <Target className="h-5 w-5 text-primary" />
          </div>

          {/* Station Selectors */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Select value={fromStation} onValueChange={onFromStationChange}>
                  <SelectTrigger
                    className="h-11"
                    aria-label="Select departure station"
                  >
                    <SelectValue placeholder="Your location" />
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
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Select value={toStation} onValueChange={onToStationChange}>
                  <SelectTrigger
                    className="h-11"
                    aria-label="Select arrival station"
                  >
                    <SelectValue placeholder="Destination" />
                  </SelectTrigger>
                  <SelectContent role="listbox" aria-label="Available stations">
                    {stations
                      .filter((station) => station !== fromStation)
                      .map((station) => (
                        <SelectItem key={station} value={station} role="option">
                          {station}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onSwapStations}
            className="shrink-0"
            disabled={!fromStation || !toStation}
            aria-label="Swap departure and arrival stations"
            title="Swap departure and arrival stations"
          >
            <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Schedule Type Tabs */}
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
