import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import smartLogo from "@/assets/smart-logo.svg";
import type { Station } from "@/types/smartSchedule";
import { getFilteredTrips, getStationIndex } from "@/lib/scheduleUtils";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { RouteSelector } from "./RouteSelector";
import { ServiceAlert } from "./ServiceAlert";
import { ScheduleResults } from "./ScheduleResults";

export function TrainScheduleApp() {
  const {
    preferences,
    isLoaded,
    updateLastSelected,
    updateDefaultScheduleType,
    updateShowAllTrips,
  } = useUserPreferences();

  const [fromStation, setFromStation] = useState<Station | "">("");
  const [toStation, setToStation] = useState<Station | "">("");
  const [scheduleType, setScheduleType] = useState<"weekday" | "weekend">(
    "weekday"
  );
  const [showAllTrips, setShowAllTrips] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(
    new Date("2025-07-25T16:00:00")
  );
  const [showServiceAlert, setShowServiceAlert] = useState(false);

  // Initialize state from user preferences once loaded
  useEffect(() => {
    if (isLoaded) {
      setFromStation(preferences.lastSelectedStations.from);
      setToStation(preferences.lastSelectedStations.to);
      setScheduleType(preferences.defaultScheduleType);
      setShowAllTrips(preferences.showAllTrips);
    }
  }, [isLoaded, preferences]);

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
    const newFrom = toStation;
    const newTo = temp;
    setFromStation(newFrom);
    setToStation(newTo);
    // Save to preferences
    updateLastSelected(newFrom, newTo);
  };

  const handleFromStationChange = (station: Station) => {
    setFromStation(station);
    updateLastSelected(station, toStation);
  };

  const handleToStationChange = (station: Station) => {
    setToStation(station);
    updateLastSelected(fromStation, station);
  };

  const handleScheduleTypeChange = (type: "weekday" | "weekend") => {
    setScheduleType(type);
    updateDefaultScheduleType(type);
  };

  const toggleShowAllTrips = () => {
    const newValue = !showAllTrips;
    setShowAllTrips(newValue);
    updateShowAllTrips(newValue);
  };

  const toggleServiceAlert = () => {
    setShowServiceAlert(!showServiceAlert);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className="container mx-auto px-4 py-6 flex flex-col items-center gap-3 bg-smart-gold"
        role="banner"
      >
        <img
          src={smartLogo}
          alt="Sonoma-Marin Area Rail Transit Logo"
          className="h-auto w-72 sm:w-96 max-w-full"
        />
        <h1 className="sr-only">SMART Train Schedule Application</h1>
      </header>

      <main
        className="container mx-auto px-4 py-4 md:py-6"
        role="main"
        aria-label="Train schedule planning interface"
      >
        {/* Service Alerts */}
        <ServiceAlert
          showServiceAlert={showServiceAlert}
          onToggleServiceAlert={toggleServiceAlert}
        />
        {/* Route Selector */}
        <RouteSelector
          fromStation={fromStation}
          toStation={toStation}
          scheduleType={scheduleType}
          onFromStationChange={handleFromStationChange}
          onToStationChange={handleToStationChange}
          onScheduleTypeChange={handleScheduleTypeChange}
          onSwapStations={swapStations}
        />
        @TODO: add way to change the now time or remove it
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
            timeFormat={preferences.timeFormat}
          />
        )}
        {fromStation && toStation && filteredTrips.length === 0 && (
          <Card className="text-center py-8" role="status" aria-live="polite">
            <CardContent>
              <p className="text-muted-foreground">
                No trains found for this route.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}