import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { calculateFare, getAllFareOptions } from "@/lib/scheduleUtils";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { FARE_CONSTANTS } from "@/lib/fareConstants";
import type { Station, FareType } from "@/types/smartSchedule";

interface FareSectionProps {
  fromStation: Station | "";
  toStation: Station | "";
}

export function FareSection({ fromStation, toStation }: FareSectionProps) {
  const { preferences, updateSelectedFareType } = useUserPreferences();
  const selectedFareType = preferences.selectedFareType;

  // Don't render if stations aren't selected
  if (!fromStation || !toStation) {
    return null;
  }

  const fareOptions = getAllFareOptions(fromStation, toStation);
  const currentFare =
    selectedFareType !== "none"
      ? calculateFare(fromStation, toStation, selectedFareType)
      : null;

  const handleFareSelect = (fareType: FareType) => {
    updateSelectedFareType(fareType);
  };

  const handleClearFare = () => {
    updateSelectedFareType("none");
  };

  return (
    <Card className="border-0 shadow-none md:border md:shadow-sm max-w-4xl mx-auto">
      <CardHeader className="p-3 md:p-6 pb-0 md:pb-0">
        <CardTitle className="flex items-center justify-between gap-2">
          Fare Information
          {selectedFareType === "none" && (
            <span className="text-sm font-medium text-muted-foreground">
              Select your fare
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 p-3 md:p-6">
        {/* Selected Fare Display */}
        {selectedFareType !== "none" && currentFare ? (
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
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

            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFare}
              className="mt-2 w-full"
            >
              Show all fares
            </Button>
          </div>
        ) : (
          /* All Fare Options - Clickable Cards */
          <div className="grid gap-2">
            {fareOptions.map((option) => (
              <Button
                key={option.fareType}
                variant="outline"
                onClick={() => handleFareSelect(option.fareType)}
                className="flex justify-between items-center p-4 h-auto rounded-lg border border-border hover:border-primary hover:bg-primary/10 hover:shadow-sm transition-all duration-200 text-left w-full group"
              >
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {option.description}
                </span>
                <span className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {option.price === 0 ? "Free" : `$${option.price.toFixed(2)}`}
                </span>
              </Button>
            ))}
          </div>
        )}

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground py-2">
          <p>
            • Fares are zone-based ($
            {FARE_CONSTANTS.ADULT_FARE_PER_ZONE.toFixed(2)} per zone for adults)
          </p>
          <p>• Youth (0-18) and seniors (65+) ride free</p>
          <p>• Discounts for disabled / Medicare and low-income riders</p>
          <p>
            • For payment options and passes, visit{" "}
            <a
              href="https://sonomamarintrain.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              sonomamarintrain.org
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
