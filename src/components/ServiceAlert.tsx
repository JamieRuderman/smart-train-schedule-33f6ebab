import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ServiceAlertProps {
  showServiceAlert: boolean;
  onToggleServiceAlert: () => void;
}

export function ServiceAlert({
  showServiceAlert,
  onToggleServiceAlert,
}: ServiceAlertProps) {
  if (showServiceAlert) {
    return (
      <Card className="mb-6 ring-2 ring-smart-gold/50 bg-smart-gold/5 border border-smart-gold">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-smart-gold mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium text-smart-gold">Service Alert</p>
              <p className="text-sm text-muted-foreground">
                Effective Monday, June 23, 2025, the first three Southbound
                weekday trips departing from Windsor are temporarily suspended.
                These trips will depart from Sonoma County Airport Station at
                their regularly scheduled times.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={onToggleServiceAlert}
              >
                Hide Service Alert
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-6 flex justify-center">
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start font-medium gap-2 border border-smart-gold ring-2 ring-smart-gold/50 bg-smart-gold/5 text-smart-gold"
        onClick={onToggleServiceAlert}
      >
        <AlertCircle className="h-5 w-5 text-smart-gold" />
        Service Alert
      </Button>
    </div>
  );
}
