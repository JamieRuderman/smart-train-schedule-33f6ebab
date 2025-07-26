import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpDown,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import smartLogo from "@/assets/smart-logo.svg";
// --- DATA IMPORTS ---
// The train stations and schedules are now stored in JSON files in src/data.
// To update the schedule or stations, edit the corresponding JSON file.
// No code changes are needed for simple data updates.
import stations from "@/data/stations";
import weekdaySchedule from "@/data/weekdaySchedule";
import weekendSchedule from "@/data/weekendSchedule";
import type {
  FerryConnection,
  TrainTrip,
  DirectionSchedule,
  WeekdaySchedule,
  WeekendSchedule,
  STATION_COUNT,
  TupleOf,
  Station,
} from "@/types/smartSchedule";

// --- Helper Functions ---
/**
 * Determines if a trip is AM or PM based on the direction schedule.
 */
function getTripPeriod(
  trip: TrainTrip,
  directionSchedule: DirectionSchedule
): "am" | "pm" {
  if (directionSchedule.am.some((t) => t.trip === trip.trip)) return "am";
  if (directionSchedule.pm.some((t) => t.trip === trip.trip)) return "pm";
  // fallback, should not happen
  return "am";
}

/**
 * Formats a time string (e.g., "4:35") into 12-hour format with AM/PM.
 */
const formatTime = (time: string, period: "am" | "pm") => {
  const cleanTime = time.replace(/\*/g, "");
  const [hoursRaw, minutesRaw] = cleanTime.split(":").map(Number);
  let displayHours = hoursRaw;
  if (period === "pm" && hoursRaw < 12) displayHours += 12;
  if (period === "am" && hoursRaw === 12) displayHours = 0;
  const shownHours =
    displayHours === 0
      ? 12
      : displayHours > 12
      ? displayHours - 12
      : displayHours;
  const shownPeriod = displayHours >= 12 ? "PM" : "AM";
  return `${shownHours}:${minutesRaw
    .toString()
    .padStart(2, "0")} ${shownPeriod}`;
};

/**
 * Returns true if the given time (in AM/PM) is in the past compared to currentTimeParam.
 */
const isTimeInPast = (
  currentTimeParam: Date,
  time: string,
  period: "am" | "pm"
) => {
  const [hoursRaw, minutesRaw] = time.replace(/\*/g, "").split(":").map(Number);
  let hours = hoursRaw;
  if (period === "pm" && hours < 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;
  const tripTime = new Date();
  tripTime.setHours(hours, minutesRaw, 0, 0);
  return tripTime < currentTimeParam;
};

export function TrainScheduleApp() {
  const [fromStation, setFromStation] = useState<Station | "">("");
  const [toStation, setToStation] = useState<Station | "">("");
  const [scheduleType, setScheduleType] = useState<"weekday" | "weekend">(
    "weekday"
  );
  const [showAllTrips, setShowAllTrips] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showServiceAlert, setShowServiceAlert] = useState(false);

  // Make fromIndex and toIndex available throughout the component
  const fromIndex = fromStation ? stations.indexOf(fromStation as Station) : -1;
  const toIndex = toStation ? stations.indexOf(toStation as Station) : -1;

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredTrips = useMemo(() => {
    if (!fromStation || !toStation) return [];
    if (fromIndex === -1 || toIndex === -1) return [];
    const southbound = fromIndex < toIndex;
    const direction = southbound ? "southbound" : "northbound";
    let schedule: TrainTrip[];
    if (scheduleType === "weekday") {
      if (direction === "southbound") {
        schedule = [
          ...weekdaySchedule.southbound.am,
          ...weekdaySchedule.southbound.pm,
        ];
      } else {
        schedule = [
          ...weekdaySchedule.northbound.am,
          ...weekdaySchedule.northbound.pm,
        ];
      }
    } else {
      if (direction === "southbound") {
        schedule = [
          ...weekendSchedule.southbound.am,
          ...weekendSchedule.southbound.pm,
        ];
      } else {
        schedule = [
          ...weekendSchedule.northbound.am,
          ...weekendSchedule.northbound.pm,
        ];
      }
    }
    return schedule
      .map((trip) => ({
        ...trip,
        departureTime: trip.times[Math.min(fromIndex, toIndex)],
        arrivalTime: trip.times[Math.max(fromIndex, toIndex)],
        fromStation: southbound ? fromStation : toStation,
        toStation: southbound ? toStation : fromStation,
      }))
      .filter(
        (trip) =>
          !trip.departureTime.includes("~~") && !trip.arrivalTime.includes("~~")
      );
  }, [fromStation, toStation, scheduleType, fromIndex, toIndex]);

  // getNextTripIndex and nextTripIndex must be declared after filteredTrips and currentTime
  const getNextTripIndex = (
    trips: TrainTrip[],
    directionSchedule: DirectionSchedule
  ) => {
    for (let i = 0; i < trips.length; i++) {
      const period = getTripPeriod(trips[i], directionSchedule);
      // Use the correct departure time based on fromIndex
      const departureTime = trips[i].times[fromIndex];
      if (!isTimeInPast(currentTime, departureTime, period)) {
        return i;
      }
    }
    return -1; // No future trips today
  };
  // Determine the correct directionSchedule for the current selection
  let directionSchedule: DirectionSchedule | undefined = undefined;
  if (fromIndex !== -1 && toIndex !== -1) {
    const southbound = fromIndex < toIndex;
    if (scheduleType === "weekday") {
      directionSchedule = southbound
        ? weekdaySchedule.southbound
        : weekdaySchedule.northbound;
    } else {
      directionSchedule = southbound
        ? weekendSchedule.southbound
        : weekendSchedule.northbound;
    }
  }
  const nextTripIndex = directionSchedule
    ? getNextTripIndex(filteredTrips, directionSchedule)
    : -1;

  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const displayedTrips = showAllTrips
    ? filteredTrips
    : filteredTrips.slice(nextTripIndex >= 0 ? nextTripIndex : 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={smartLogo}
              alt="SMART Train Logo"
              className="h-8 w-auto"
            />
            <h1 className="text-2xl font-bold">SMART Train</h1>
          </div>
          <p className="text-white/90">Sonoma-Marin Area Rail Transit</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Route Selector */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Plan Your Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  From
                </label>
                <Select
                  value={fromStation as Station | ""}
                  onValueChange={(v) => setFromStation(v as Station)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select departure station" />
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

              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapStations}
                  className="mb-2 mr-4"
                  disabled={!fromStation || !toStation}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    To
                  </label>
                  <Select
                    value={toStation as Station | ""}
                    onValueChange={(v) => setToStation(v as Station)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select arrival station" />
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
              </div>
            </div>

            <Tabs
              value={scheduleType}
              onValueChange={(v) => setScheduleType(v as "weekday" | "weekend")}
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger
                  value="weekday"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Weekday
                </TabsTrigger>
                <TabsTrigger
                  value="weekend"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Weekend
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Service Alerts */}
        {showServiceAlert ? (
          <Card className="mb-6 ring-2 ring-smart-gold/50 bg-smart-gold/5 border border-smart-gold">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-smart-gold mt-0.5" />
                <div className="space-y-2">
                  <p className="font-medium text-smart-gold">Service Alert</p>
                  <p className="text-sm text-muted-foreground">
                    Effective Monday, June 23, 2025, the first three Southbound
                    weekday trips departing from Windsor are temporarily
                    suspended. These trips will depart from Sonoma County
                    Airport Station at their regularly scheduled times.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowServiceAlert(false)}
                  >
                    Hide Service Alert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-6 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start font-medium gap-2 border border-smart-gold ring-2 ring-smart-gold/50 bg-smart-gold/5 text-smart-gold"
              onClick={() => setShowServiceAlert(true)}
            >
              <AlertCircle className="h-5 w-5 text-smart-gold" />
              Service Alert
            </Button>
          </div>
        )}

        {/* Schedule Results */}
        {filteredTrips.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Schedule Results
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {fromStation} → {toStation} •{" "}
                {scheduleType === "weekday" ? "Weekday" : "Weekend/Holiday"}
              </p>
              {nextTripIndex > 0 && !showAllTrips && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllTrips(true)}
                  className="mt-2"
                >
                  Show earlier trains ({nextTripIndex} hidden)
                </Button>
              )}
              {showAllTrips && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllTrips(false)}
                  className="mt-2"
                >
                  Hide earlier trains
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {displayedTrips.map((trip, index) => {
                  const period = directionSchedule
                    ? getTripPeriod(trip, directionSchedule)
                    : "am";
                  const isPastTrip = isTimeInPast(
                    currentTime,
                    trip.times[fromIndex],
                    period
                  );
                  // Find the next trip using the same time logic as isPastTrip
                  const isNextTrip = !isPastTrip && 
                    displayedTrips
                      .slice(0, index)
                      .every(prevTrip => {
                        const prevPeriod = directionSchedule
                          ? getTripPeriod(prevTrip, directionSchedule)
                          : "am";
                        return isTimeInPast(currentTime, prevTrip.times[fromIndex], prevPeriod);
                      });
                  const showFerry = trip.ferry && toStation === "Larkspur";

                  return (
                    <div
                      key={trip.trip}
                      className={cn(
                        "flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-lg border transition-all space-y-2 md:space-y-0",
                        isPastTrip && showAllTrips
                          ? "bg-muted/50 opacity-60 text-muted-foreground border-muted"
                          : "bg-gradient-card hover:shadow-md",
                        isNextTrip &&
                          "ring-2 ring-smart-gold/50 bg-smart-gold/5"
                      )}
                    >
                      {/* Mobile Layout */}
                      <div className="flex flex-col space-y-2 md:hidden">
                        {/* Train # and Next Train badge */}
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-mono",
                              isNextTrip && "border-smart-gold text-smart-gold",
                              isPastTrip &&
                                showAllTrips &&
                                "border-muted-foreground/30"
                            )}
                          >
                            Train {trip.trip}
                          </Badge>
                          {isNextTrip && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-smart-gold text-white"
                            >
                              Next Train
                            </Badge>
                          )}
                        </div>
                        
                        {/* Times */}
                        <div className="flex items-center gap-2 text-sm">
                          <span
                            className={cn(
                              "font-medium",
                              isNextTrip && "text-smart-gold"
                            )}
                          >
                            {formatTime(trip.times[fromIndex], period)}
                          </span>
                          <span className="text-muted-foreground">→</span>
                          <span
                            className={cn(
                              "font-medium",
                              isNextTrip && "text-smart-gold"
                            )}
                          >
                            {formatTime(trip.times[toIndex], period)}
                          </span>
                        </div>
                        
                        {/* Ferry info - only if ferry exists */}
                        {showFerry && (
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              Ferry Connection
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              Departs {formatTime(trip.ferry.depart, period)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:flex md:items-center md:gap-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-mono",
                            isNextTrip && "border-smart-gold text-smart-gold",
                            isPastTrip &&
                              showAllTrips &&
                              "border-muted-foreground/30"
                          )}
                        >
                          Train {trip.trip}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm">
                          <span
                            className={cn(
                              "font-medium",
                              isNextTrip && "text-smart-gold"
                            )}
                          >
                            {formatTime(trip.times[fromIndex], period)}
                          </span>
                          <span className="text-muted-foreground">→</span>
                          <span
                            className={cn(
                              "font-medium",
                              isNextTrip && "text-smart-gold"
                            )}
                          >
                            {formatTime(trip.times[toIndex], period)}
                          </span>
                        </div>
                        {isNextTrip && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-smart-gold text-white"
                          >
                            Next Train
                          </Badge>
                        )}
                      </div>

                      {showFerry && (
                        <div className="hidden md:block text-right">
                          <Badge variant="secondary" className="text-xs">
                            Ferry Connection
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Departs {formatTime(trip.ferry.depart, period)}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
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