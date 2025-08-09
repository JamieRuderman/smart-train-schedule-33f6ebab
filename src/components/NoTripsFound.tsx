import { Card, CardContent } from "@/components/ui/card";

export function NoTripsFound() {
  return (
    <Card
      className="text-center py-8 max-w-4xl mx-auto"
      role="status"
      aria-live="polite"
    >
      <CardContent>
        <p className="text-muted-foreground">No trains found for this route.</p>
      </CardContent>
    </Card>
  );
}
