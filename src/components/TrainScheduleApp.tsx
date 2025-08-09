import { useTrainScheduleState } from "@/hooks/useTrainScheduleState";
import { AppHeader } from "./AppHeader";
import { RouteSelector } from "./RouteSelector";
import { ServiceAlert } from "./ServiceAlert";
import { ScheduleResults } from "./ScheduleResults";
import { FareSection } from "./FareSection";
import { ThemeToggle } from "./ThemeToggle";
import { NoTripsFound } from "./NoTripsFound";

export function TrainScheduleApp() {
  const {
    fromStation,
    toStation,
    scheduleType,
    showAllTrips,
    currentTime,
    showServiceAlert,
    fromIndex,
    toIndex,
    filteredTrips,
    setFromStation,
    setToStation,
    setScheduleType,
    toggleShowAllTrips,
    toggleServiceAlert,
    swapStations,
  } = useTrainScheduleState();

  return (
    <div className="min-h-screen bg-card md:bg-background">
      <AppHeader />

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
            fromIndex={fromIndex}
            toIndex={toIndex}
            currentTime={currentTime}
            showAllTrips={showAllTrips}
            onToggleShowAllTrips={toggleShowAllTrips}
            timeFormat="12h"
          />
        )}
        {fromStation && toStation && filteredTrips.length === 0 && (
          <NoTripsFound />
        )}

        {/* Fare Section */}
        {fromStation && toStation && (
          <FareSection fromStation={fromStation} toStation={toStation} />
        )}
      </main>

      {/* Theme Toggle at Bottom */}
      <div className="container max-w-4xl mx-auto px-8 md:px-0 pb-8">
        <ThemeToggle />
      </div>
    </div>
  );
}
