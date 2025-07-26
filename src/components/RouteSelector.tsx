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

export function RouteSelector({
  fromStation,
  toStation,
  scheduleType,
  onFromStationChange,
  onToStationChange,
  onScheduleTypeChange,
  onSwapStations,
}: RouteSelectorProps) {
  return (
    <Card className="mb-6 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Plan Your Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StationSelector
            value={fromStation}
            onValueChange={onFromStationChange}
            placeholder="Select departure station"
            label="From"
          />

          <div className="flex items-end">
            <Button
              variant="outline"
              size="icon"
              onClick={onSwapStations}
              className="mb-2 mr-4"
              disabled={!fromStation || !toStation}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <StationSelector
                value={toStation}
                onValueChange={onToStationChange}
                placeholder="Select arrival station"
                label="To"
              />
            </div>
          </div>
        </div>

        <Tabs value={scheduleType} onValueChange={onScheduleTypeChange}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="weekday" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Weekday
            </TabsTrigger>
            <TabsTrigger value="weekend" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Weekend
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
}
