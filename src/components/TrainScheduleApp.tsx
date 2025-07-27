import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import smartLogo from "@/assets/smart-logo.svg";
import type { Station, FareType } from "@/types/smartSchedule";
import { getFilteredTrips, getStationIndex } from "@/lib/scheduleUtils";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { RouteSelector } from "./RouteSelector";
import { ServiceAlert } from "./ServiceAlert";
import { ScheduleResults } from "./ScheduleResults";
import { FareSection } from "./FareSection";

// Helper function to determine if today is a weekend
const isWeekend = (): boolean => {
  const today = new Date().getDay();
  return today === 0 || today === 6; // Sunday = 0, Saturday = 6
};

export function TrainScheduleApp() {
  const { preferences, isLoaded, updateLastSelected } = useUserPreferences();

  const [fromStation, setFromStation] = useState<Station | "">("");
  const [toStation, setToStation] = useState<Station | "">("");
  const [scheduleType, setScheduleType] = useState<"weekday" | "weekend">(
    isWeekend() ? "weekend" : "weekday"
  );
  const [showAllTrips, setShowAllTrips] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showServiceAlert, setShowServiceAlert] = useState(false);
  const [selectedFareType, setSelectedFareType] = useState<FareType | "none">(
    "none"
  );

  // Initialize state from user preferences once loaded
  useEffect(() => {
    if (isLoaded) {
      setFromStation(preferences.lastSelectedStations.from);
      setToStation(preferences.lastSelectedStations.to);
      // Don't load schedule type from preferences - always use day-based default
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
    // Don't persist schedule type - it should be determined by current day
  };

  const toggleShowAllTrips = () => {
    const newValue = !showAllTrips;
    setShowAllTrips(newValue);
  };

  const toggleServiceAlert = () => {
    setShowServiceAlert(!showServiceAlert);
  };

  const handleFareTypeChange = (fareType: FareType | "none") => {
    setSelectedFareType(fareType);
  };

  return (
    <div className="min-h-screen bg-white md:bg-background">
      {/* Header */}
      <header
        className="container mx-auto px-4 pt-4 pb-36 flex flex-col items-center bg-smart-train-green"
        role="banner"
      >
        <img
          src={smartLogo}
          alt="Sonoma-Marin Area Rail Transit Logo"
          className="h-auto w-64 sm:w-96 max-w-full"
        />
        <h1 className="sr-only">SMART Train Schedule Application</h1>
      </header>

      <main
        className="container mx-auto px-4 py-4 md:py-6 space-y-4"
        role="main"
        aria-label="Train schedule planning interface"
      >
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
            timeFormat="12h"
          />
        )}
        {fromStation && toStation && filteredTrips.length === 0 && (
          <Card
            className="text-center py-8 max-w-4xl mx-auto"
            role="status"
            aria-live="polite"
          >
            <CardContent>
              <p className="text-muted-foreground">
                No trains found for this route.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Fare Section */}
        {fromStation && toStation && (
          <FareSection
            fromStation={fromStation}
            toStation={toStation}
            selectedFareType={selectedFareType}
            onFareTypeChange={handleFareTypeChange}
          />
        )}
      </main>
    </div>
  );
}