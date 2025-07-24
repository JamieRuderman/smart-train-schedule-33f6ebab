import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, Clock, MapPin, Calendar, Train, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// SMART Train stations in order from north to south
const stations = [
  "Windsor",
  "Sonoma County Airport", 
  "Santa Rosa North",
  "Santa Rosa Downtown",
  "Rohnert Park",
  "Cotati",
  "Petaluma North",
  "Petaluma Downtown",
  "Novato San Marin",
  "Novato Downtown", 
  "Novato Hamilton",
  "Marin Civic Center",
  "San Rafael",
  "Larkspur"
];

// Schedule data structure
const weekdaySchedule = {
  southbound: {
    am: [
      { trip: 1, times: ["~~4:35~~", "4:39", "4:46", "4:50", "4:58", "5:01", "5:11", "5:16", "5:28", "5:31", "5:39", "5:45", "5:51", "5:58"], ferry: { depart: "6:30", arrive: "7:05" } },
      { trip: 3, times: ["~~4:58~~", "5:02", "5:09", "5:13", "5:21", "5:24", "5:34", "5:39", "5:51", "5:54", "6:02", "6:08", "6:14", "6:21"], ferry: { depart: "6:30*", arrive: "7:05" } },
      { trip: 5, times: ["~~5:30~~", "5:34", "5:41", "5:45", "5:53", "5:56", "6:06", "6:11", "6:23", "6:26", "6:34", "6:40", "6:46", "6:53"], ferry: { depart: "7:15", arrive: "7:50" } },
      { trip: 7, times: ["6:02", "6:06", "6:13", "6:17", "6:25", "6:28", "6:38", "6:43", "6:55", "6:58", "7:06", "7:12", "7:18", "7:25"], ferry: { depart: "7:55", arrive: "8:30" } },
      { trip: 9, times: ["6:34", "6:38", "6:45", "6:49", "6:57", "7:00", "7:10", "7:15", "7:27", "7:30", "7:38", "7:44", "7:50", "7:57"], ferry: { depart: "8:40", arrive: "9:15" } },
      { trip: 11, times: ["7:06", "7:10", "7:17", "7:21", "7:29", "7:32", "7:42", "7:47", "7:59", "8:02", "8:10", "8:16", "8:22", "8:29"], ferry: { depart: "8:40*", arrive: "9:15" } },
      { trip: 13, times: ["7:38", "7:42", "7:49", "7:53", "8:01", "8:04", "8:14", "8:19", "8:31", "8:34", "8:42", "8:48", "8:54", "9:01"], ferry: { depart: "9:25", arrive: "10:00" } },
      { trip: 15, times: ["8:10", "8:14", "8:21", "8:25", "8:33", "8:36", "8:46", "8:51", "9:03", "9:06", "9:14", "9:20", "9:26", "9:33"], ferry: { depart: "10:10", arrive: "10:45" } },
      { trip: 17, times: ["9:14", "9:18", "9:25", "9:29", "9:37", "9:40", "9:50", "9:55", "10:07", "10:10", "10:18", "10:24", "10:30", "10:37"], ferry: { depart: "11:50", arrive: "12:25" } },
      { trip: 19, times: ["10:18", "10:22", "10:29", "10:33", "10:41", "10:44", "10:54", "10:59", "11:11", "11:14", "11:22", "11:28", "11:34", "11:41"], ferry: { depart: "11:50*", arrive: "12:25" } },
      { trip: 21, times: ["10:50", "10:54", "11:01", "11:05", "11:13", "11:16", "11:26", "11:31", "11:43", "11:46", "11:54", "12:00", "12:06", "12:13"], ferry: { depart: "1:30", arrive: "2:05" } }
    ],
    pm: [
      { trip: 23, times: ["12:41", "12:45", "12:52", "12:56", "1:04", "1:07", "1:17", "1:22", "1:34", "1:37", "1:45", "1:51", "1:57", "2:04"] },
      { trip: 25, times: ["1:13", "1:17", "1:24", "1:28", "1:36", "1:39", "1:49", "1:54", "2:06", "2:09", "2:17", "2:23", "2:29", "2:36"], ferry: { depart: "3:05", arrive: "3:40" } },
      { trip: 27, times: ["2:17", "2:21", "2:28", "2:32", "2:40", "2:43", "2:53", "2:58", "3:10", "3:13", "3:21", "3:27", "3:33", "3:40"] },
      { trip: 29, times: ["2:49", "2:53", "3:00", "3:04", "3:12", "3:15", "3:25", "3:30", "3:42", "3:45", "3:53", "3:59", "4:05", "4:12"], ferry: { depart: "4:35", arrive: "5:10" } },
      { trip: 31, times: ["3:21", "3:25", "3:32", "3:36", "3:44", "3:47", "3:57", "4:02", "4:14", "4:17", "4:25", "4:31", "4:37", "4:44"], ferry: { depart: "5:15", arrive: "5:50" } },
      { trip: 33, times: ["3:53", "3:57", "4:04", "4:08", "4:16", "4:19", "4:29", "4:34", "4:46", "4:49", "4:57", "5:03", "5:09", "5:16"] },
      { trip: 35, times: ["4:57", "5:01", "5:08", "5:12", "5:20", "5:23", "5:33", "5:38", "5:50", "5:53", "6:01", "6:07", "6:13", "6:20"] },
      { trip: 37, times: ["5:29", "5:33", "5:40", "5:44", "5:52", "5:55", "6:05", "6:10", "6:22", "6:25", "6:33", "6:39", "6:45", "6:52"], ferry: { depart: "7:15", arrive: "7:50" } },
      { trip: 39, times: ["6:01", "6:05", "6:12", "6:16", "6:24", "6:27", "6:37", "6:42", "6:54", "6:57", "7:05", "7:11", "7:17", "7:24"] },
      { trip: 41, times: ["7:05", "7:09", "7:16", "7:20", "7:28", "7:31", "7:41", "7:46", "7:58", "8:01", "8:09", "8:15", "8:21", "8:28"] }
    ]
  },
  northbound: {
    am: [
      { trip: 2, times: ["6:08", "6:15", "6:20", "6:26", "6:32", "6:35", "6:48", "6:53", "7:01", "7:05", "7:13", "7:17", "7:23", "7:28"] },
      { trip: 4, times: ["6:40", "6:47", "6:52", "6:58", "7:04", "7:07", "7:20", "7:25", "7:33", "7:37", "7:45", "7:49", "7:55", "8:00"] },
      { trip: 6, times: ["7:12", "7:19", "7:24", "7:30", "7:36", "7:39", "7:52", "7:57", "8:05", "8:09", "8:17", "8:21", "8:27", "8:32"], ferry: { depart: "6:30", arrive: "7:05" } },
      { trip: 8, times: ["7:44", "7:51", "7:56", "8:02", "8:08", "8:11", "8:24", "8:29", "8:37", "8:41", "8:49", "8:53", "8:59", "9:04"], ferry: { depart: "7:15", arrive: "7:45" } },
      { trip: 10, times: ["8:16", "8:23", "8:28", "8:34", "8:40", "8:43", "8:56", "9:01", "9:09", "9:13", "9:21", "9:25", "9:31", "9:36"] },
      { trip: 12, times: ["9:20", "9:27", "9:32", "9:38", "9:44", "9:47", "10:00", "10:05", "10:13", "10:17", "10:25", "10:29", "10:35", "10:40"], ferry: { depart: "8:40", arrive: "9:15" } },
      { trip: 14, times: ["9:52", "9:59", "10:04", "10:10", "10:16", "10:19", "10:32", "10:37", "10:45", "10:49", "10:57", "11:01", "11:07", "11:12"] },
      { trip: 16, times: ["10:56", "11:03", "11:08", "11:14", "11:20", "11:23", "11:36", "11:41", "11:49", "11:53", "12:01", "12:05", "12:11", "12:16"], ferry: { depart: "10:10", arrive: "10:45*" } }
    ],
    pm: [
      { trip: 18, times: ["12:15", "12:22", "12:27", "12:33", "12:39", "12:42", "12:55", "1:00", "1:08", "1:12", "1:20", "1:24", "1:30", "1:35"] },
      { trip: 20, times: ["12:47", "12:54", "12:59", "1:05", "1:11", "1:14", "1:27", "1:32", "1:40", "1:44", "1:52", "1:56", "2:02", "2:07"], ferry: { depart: "11:50", arrive: "12:25" } },
      { trip: 22, times: ["2:23", "2:30", "2:35", "2:41", "2:47", "2:50", "3:03", "3:08", "3:16", "3:20", "3:28", "3:32", "3:38", "3:43"] },
      { trip: 24, times: ["2:55", "3:02", "3:07", "3:13", "3:19", "3:22", "3:35", "3:40", "3:48", "3:52", "4:00", "4:04", "4:10", "4:15"] },
      { trip: 26, times: ["3:27", "3:34", "3:39", "3:45", "3:51", "3:54", "4:07", "4:12", "4:20", "4:24", "4:32", "4:36", "4:42", "4:47"], ferry: { depart: "2:15", arrive: "2:50" } },
      { trip: 28, times: ["3:59", "4:06", "4:11", "4:17", "4:23", "4:26", "4:39", "4:44", "4:52", "4:56", "5:04", "5:08", "5:14", "5:19"], ferry: { depart: "2:55", arrive: "3:30" } },
      { trip: 30, times: ["4:31", "4:38", "4:43", "4:49", "4:55", "4:58", "5:11", "5:16", "5:24", "5:28", "5:36", "5:40", "5:46", "5:51"] },
      { trip: 32, times: ["5:03", "5:10", "5:15", "5:21", "5:27", "5:30", "5:43", "5:48", "5:56", "6:00", "6:08", "6:12", "6:18", "6:23"], ferry: { depart: "3:50", arrive: "4:25" } },
      { trip: 34, times: ["5:35", "5:42", "5:47", "5:53", "5:59", "6:02", "6:15", "6:20", "6:28", "6:32", "6:40", "6:44", "6:50", "6:55"], ferry: { depart: "4:30", arrive: "5:05" } },
      { trip: 36, times: ["6:39", "6:46", "6:51", "6:57", "7:03", "7:06", "7:19", "7:24", "7:32", "7:36", "7:44", "7:48", "7:54", "7:59"], ferry: { depart: "5:25", arrive: "6:00" } },
      { trip: 38, times: ["7:11", "7:18", "7:23", "7:29", "7:35", "7:38", "7:51", "7:56", "8:04", "8:08", "8:16", "8:20", "8:26", "8:31"], ferry: { depart: "6:00", arrive: "6:35" } },
      { trip: 40, times: ["7:43", "7:50", "7:55", "8:01", "8:07", "8:10", "8:23", "8:28", "8:36", "8:40", "8:48", "8:52", "8:58", "9:03"], ferry: { depart: "6:55", arrive: "7:25" } },
      { trip: 42, times: ["8:50", "8:57", "9:02", "9:08", "9:14", "9:17", "9:30", "9:35", "9:43", "9:47", "9:55", "9:59", "10:05", "10:10"], ferry: { depart: "8:00", arrive: "8:30" } }
    ]
  }
};

const weekendSchedule = {
  southbound: [
    { trip: 1, times: ["7:12", "7:16", "7:23", "7:27", "7:35", "7:38", "7:48", "7:53", "8:05", "8:08", "8:16", "8:22", "8:28", "8:35"], ferry: { depart: "9:00", arrive: "10:00" } },
    { trip: 3, times: ["8:17", "8:21", "8:28", "8:32", "8:40", "8:43", "8:53", "8:58", "9:10", "9:13", "9:21", "9:27", "9:33", "9:40"], ferry: { depart: "10:00", arrive: "10:35" } },
    { trip: 5, times: ["9:28", "9:32", "9:39", "9:43", "9:51", "9:54", "10:04", "10:09", "10:21", "10:24", "10:32", "10:38", "10:44", "10:51"], ferry: { depart: "11:30", arrive: "12:05" } },
    { trip: 7, times: ["11:37", "11:41", "11:48", "11:52", "12:00", "12:03", "12:13", "12:18", "12:30", "12:33", "12:41", "12:47", "12:53", "1:00"], ferry: { depart: "1:30", arrive: "2:05" } },
    { trip: 9, times: ["12:33", "12:37", "12:44", "12:48", "12:56", "12:59", "1:09", "1:14", "1:26", "1:29", "1:37", "1:43", "1:49", "1:56"] },
    { trip: 11, times: ["2:51", "2:55", "3:02", "3:06", "3:14", "3:17", "3:27", "3:32", "3:44", "3:47", "3:55", "4:01", "4:07", "4:14"], ferry: { depart: "4:30", arrive: "5:05" } },
    { trip: 13, times: ["3:56", "4:00", "4:07", "4:11", "4:19", "4:22", "4:32", "4:37", "4:49", "4:52", "5:00", "5:06", "5:12", "5:19"], ferry: { depart: "6:00", arrive: "6:35" } },
    { trip: 15, times: ["6:06", "6:10", "6:17", "6:21", "6:29", "6:32", "6:42", "6:47", "6:59", "7:02", "7:10", "7:16", "7:22", "7:29"] }
  ],
  northbound: [
    { trip: 2, times: ["9:30", "9:38", "9:43", "9:50", "9:56", "9:59", "10:12", "10:17", "10:25", "10:29", "10:37", "10:41", "10:47", "10:52"] },
    { trip: 4, times: ["10:36", "10:44", "10:49", "10:56", "11:02", "11:05", "11:18", "11:23", "11:31", "11:35", "11:43", "11:47", "11:53", "11:58"] },
    { trip: 6, times: ["11:40", "11:48", "11:53", "12:00", "12:06", "12:09", "12:22", "12:27", "12:35", "12:39", "12:47", "12:51", "12:57", "1:02"], ferry: { depart: "10:45", arrive: "11:20" } },
    { trip: 8, times: ["1:10", "1:18", "1:23", "1:30", "1:36", "1:39", "1:52", "1:57", "2:05", "2:09", "2:17", "2:21", "2:27", "2:32"], ferry: { depart: "12:15", arrive: "12:50" } },
    { trip: 10, times: ["2:55", "3:03", "3:08", "3:15", "3:21", "3:24", "3:37", "3:42", "3:50", "3:54", "4:02", "4:06", "4:12", "4:17"] },
    { trip: 12, times: ["4:35", "4:43", "4:48", "4:55", "5:01", "5:04", "5:17", "5:22", "5:30", "5:34", "5:42", "5:46", "5:52", "5:57"], ferry: { depart: "3:45", arrive: "4:20" } },
    { trip: 14, times: ["6:10", "6:18", "6:23", "6:30", "6:36", "6:39", "6:52", "6:57", "7:05", "7:09", "7:17", "7:21", "7:27", "7:32"], ferry: { depart: "5:15", arrive: "5:50" } },
    { trip: 16, times: ["7:45", "7:53", "7:58", "8:05", "8:11", "8:14", "8:27", "8:32", "8:40", "8:44", "8:52", "8:59", "9:02", "9:07"], ferry: { depart: "6:45", arrive: "7:20" } }
  ]
};

interface TrainTrip {
  trip: number;
  times: string[];
  ferry?: {
    depart: string;
    arrive: string;
  };
}

export function TrainScheduleApp() {
  const [fromStation, setFromStation] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [scheduleType, setScheduleType] = useState<"weekday" | "weekend">("weekday");
  const [direction, setDirection] = useState<"southbound" | "northbound">("southbound");

  const filteredTrips = useMemo(() => {
    if (!fromStation || !toStation) return [];

    const fromIndex = stations.indexOf(fromStation);
    const toIndex = stations.indexOf(toStation);
    
    if (fromIndex === -1 || toIndex === -1) return [];

    const isActuallySouthbound = fromIndex < toIndex;
    const actualDirection = isActuallySouthbound ? "southbound" : "northbound";
    
    let schedule: TrainTrip[];
    if (scheduleType === "weekday") {
      if (actualDirection === "southbound") {
        schedule = [...weekdaySchedule.southbound.am, ...weekdaySchedule.southbound.pm];
      } else {
        schedule = [...weekdaySchedule.northbound.am, ...weekdaySchedule.northbound.pm];
      }
    } else {
      schedule = weekendSchedule[actualDirection];
    }

    return schedule.map(trip => ({
      ...trip,
      departureTime: trip.times[Math.min(fromIndex, toIndex)],
      arrivalTime: trip.times[Math.max(fromIndex, toIndex)],
      fromStation: isActuallySouthbound ? fromStation : toStation,
      toStation: isActuallySouthbound ? toStation : fromStation
    })).filter(trip => 
      !trip.departureTime.includes("~~") && 
      !trip.arrivalTime.includes("~~")
    );
  }, [fromStation, toStation, scheduleType, direction]);

  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const formatTime = (time: string) => {
    // Remove any markup like asterisks
    return time.replace(/\*/g, '');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Train className="h-8 w-8" />
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
                <label className="text-sm font-medium text-muted-foreground">From</label>
                <Select value={fromStation} onValueChange={setFromStation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select departure station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station} value={station}>{station}</SelectItem>
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
                  <label className="text-sm font-medium text-muted-foreground">To</label>
                  <Select value={toStation} onValueChange={setToStation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select arrival station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station} value={station}>{station}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Tabs value={scheduleType} onValueChange={(v) => setScheduleType(v as "weekday" | "weekend")}>
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

        {/* Service Alerts */}
        <Card className="mb-6 border-delay/20 bg-delay/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-delay mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium text-delay">Service Alert</p>
                <p className="text-sm text-muted-foreground">
                  Effective Monday, June 23, 2025, the first three Southbound weekday trips departing from Windsor are temporarily suspended. 
                  These trips will depart from Sonoma County Airport Station at their regularly scheduled times.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Results */}
        {filteredTrips.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Schedule Results
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {fromStation} → {toStation} • {scheduleType === "weekday" ? "Weekday" : "Weekend/Holiday"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTrips.map((trip) => (
                  <div
                    key={trip.trip}
                    className="flex items-center justify-between p-4 rounded-lg border bg-gradient-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="font-mono">
                        Train {trip.trip}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{formatTime(trip.departureTime)}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium">{formatTime(trip.arrivalTime)}</span>
                      </div>
                    </div>
                    
                    {trip.ferry && (
                      <div className="text-right">
                        <Badge variant="secondary" className="text-xs">
                          Ferry Connection
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Departs {trip.ferry.depart}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {fromStation && toStation && filteredTrips.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-muted-foreground">No trains found for this route.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}