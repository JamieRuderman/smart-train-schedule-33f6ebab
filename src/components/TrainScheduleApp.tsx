import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import smartLogo from "@/assets/smart-logo.svg";
import type { Station } from "@/types/smartSchedule";
import { getFilteredTrips, getStationIndex } from "@/lib/scheduleUtils";
import { RouteSelector } from "./RouteSelector";
import { ServiceAlert } from "./ServiceAlert";
import { ScheduleResults } from "./ScheduleResults";

export function TrainScheduleApp() {
  const [fromStation, setFromStation] = useState<Station | "">("");
  const [toStation, setToStation] = useState<Station | "">("");
  const [scheduleType, setScheduleType] = useState<"weekday" | "weekend">(
    "weekday"
  );
  const [showAllTrips, setShowAllTrips] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(
    new Date("2025-07-25T10:00:00")
  );
  const [showServiceAlert, setShowServiceAlert] = useState(false);

  // Fast station index lookup using pre-processed data
  const fromIndex = fromStation ? getStationIndex(fromStation) : -1;
  const toIndex = toStation ? getStationIndex(toStation) : -1;

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fast trip lookup using pre-processed cache
  const filteredTrips = useMemo(() => {
    if (!fromStation || !toStation) return [];
    return getFilteredTrips(fromStation, toStation, scheduleType);
  }, [fromStation, toStation, scheduleType]);

  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const toggleShowAllTrips = () => {
    setShowAllTrips(!showAllTrips);
  };

  const toggleServiceAlert = () => {
    setShowServiceAlert(!showServiceAlert);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-6 flex flex-col items-center gap-3 bg-smart-gold">
        <img
          src={smartLogo}
          alt="Sonoma-Marin Area Rail Transit"
          className="h-auto w-72"
        />
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Route Selector */}
        <RouteSelector
          fromStation={fromStation}
          toStation={toStation}
          scheduleType={scheduleType}
          onFromStationChange={setFromStation}
          onToStationChange={setToStation}
          onScheduleTypeChange={setScheduleType}
          onSwapStations={swapStations}
        />

        {/* Service Alerts */}
        <ServiceAlert
          showServiceAlert={showServiceAlert}
          onToggleServiceAlert={toggleServiceAlert}
        />

        {/* Schedule Results */}
        {filteredTrips.length > 0 && fromStation && toStation && (
          <ScheduleResults
            filteredTrips={filteredTrips}
            fromStation={fromStation}
            toStation={toStation}
            scheduleType={scheduleType}
            fromIndex={fromIndex}
            toIndex={toIndex}
            currentTime={currentTime}
            showAllTrips={showAllTrips}
            onToggleShowAllTrips={toggleShowAllTrips}
          />
        )}

        {fromStation && toStation && filteredTrips.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-muted-foreground">
                No trains found for this route.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}