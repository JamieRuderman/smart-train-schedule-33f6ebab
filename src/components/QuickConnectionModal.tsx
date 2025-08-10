import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface QuickConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInbound?: boolean;
}

export function QuickConnectionModal({
  isOpen,
  onClose,
  isInbound = false,
}: QuickConnectionModalProps) {
  const content = (
    <div className="flex items-start gap-3 p-1">
      <AlertTriangle className="h-4 w-4 text-smart-gold mt-1 flex-shrink-0" />
      <div className="flex-1">
        <DialogTitle className="font-medium text-smart-gold mb-2">
          Quick Transfer Warning
        </DialogTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This tight connection is
          <strong className="text-foreground"> not recommended</strong> for
          passengers walking between the train station and Ferry Terminal.
          Consider taking
          {isInbound ? " a later train" : " an earlier train"} for a more
          comfortable transfer.
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[calc(100vw-2rem)] ring-2 ring-smart-gold/50 bg-background border border-smart-gold rounded-lg p-0">
        <div className="bg-smart-gold/5 p-6">{content}</div>
      </DialogContent>
    </Dialog>
  );
}
