import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { calculateFare, getAllFareOptions } from "@/lib/scheduleUtils";
import { FareSelect } from "./FareSelect";
import type { Station, FareType } from "@/types/smartSchedule";

interface FareSectionProps {
  fromStation: Station | "";
  toStation: Station | "";
  selectedFareType: FareType | "none";
  onFareTypeChange: (fareType: FareType | "none") => void;
}

export function FareSection({
  fromStation,
  toStation,
  selectedFareType,
  onFareTypeChange,
}: FareSectionProps) {
  // Don't render if stations aren't selected
  if (!fromStation || !toStation) {
    return null;
  }

  const fareOptions = getAllFareOptions(fromStation, toStation);
  const currentFare =
    selectedFareType !== "none"
      ? calculateFare(fromStation, toStation, selectedFareType)
      : null;

  return (
    <Card className="border-0 shadow-none md:border md:shadow-sm rounded-none md:rounded-lg max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          Fare Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-4">
            {/* Fare Type Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Select your fare type:
              </label>
              <FareSelect
                selectedFareType={selectedFareType}
                onFareTypeChange={onFareTypeChange}
                className="w-full max-w-xs"
              />
            </div>

            {/* Current Fare Display */}
            {currentFare && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{currentFare.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentFare.zones} zone
                      {currentFare.zones !== 1 ? "s" : ""} • {fromStation} →{" "}
                      {toStation}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {currentFare.price === 0
                        ? "Free"
                        : `$${currentFare.price.toFixed(2)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">One-way</p>
                  </div>
                </div>
              </div>
            )}

            {/* All Fare Options */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                All fare options for this route:
              </h4>
              <div className="grid gap-2">
                {fareOptions.map((option) => (
                  <div
                    key={option.fareType}
                    className={`flex justify-between items-center p-3 rounded border ${
                      selectedFareType === option.fareType
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <span className="text-sm">{option.description}</span>
                    <span className="font-medium">
                      {option.price === 0
                        ? "Free"
                        : `$${option.price.toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
              <p>• Fares are zone-based ($1.50 per zone for adults)</p>
              <p>• Youth (0-18) and seniors (65+) ride free</p>
              <p>
                • Discounts available for disabled/Medicare and low-income
                riders
              </p>
              <p>
                • For payment options and passes, visit sonomamarintrain.org
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
