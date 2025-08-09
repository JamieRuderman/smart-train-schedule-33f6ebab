import { AlertCircle } from "lucide-react";

export function NoMoreTrainsAlert() {
  return (
    <div
      className="mb-3 -mt-4 p-3 bg-smart-gold/10 border border-smart-gold/20 rounded-lg"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-smart-gold" aria-hidden="true" />
        <p className="text-smart-gold font-medium">No more trains today</p>
      </div>
      <p className="text-sm text-smart-gold/80 mt-1 ml-6">
        All scheduled trains for today have departed
      </p>
    </div>
  );
}
