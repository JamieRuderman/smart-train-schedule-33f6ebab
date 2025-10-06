import { Bell } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function BottomInfoBar() {
  return (
    <div className="container max-w-4xl mx-auto px-3 md:px-0 pb-8 space-y-3">
      <div className="rounded-md border bg-background px-4 py-3 flex items-start justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex flex-col gap-1 text-left flex-1">
          <div className="flex items-start gap-2 justify-center sm:justify-start">
            <Bell
              aria-hidden
              className="h-4 w-4 mt-0.5 shrink-0 text-foreground/70"
            />
            <p>
              Receive Service Alerts by texting the word{" "}
              <span className="font-semibold">SMART</span> to
              <span className="font-semibold"> 888777</span> or{" "}
              <a
                href="https://member.everbridge.net/index/892807736728379#/login"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                click here
              </a>{" "}
              <span>to sign-up.</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Data provided by{" "}
            <a
              href="https://511.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              511.org
            </a>
            .
          </p>
        </div>
        <div className="ml-auto shrink-0 self-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export default BottomInfoBar;
