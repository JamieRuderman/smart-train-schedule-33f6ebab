import React from "react";
import { Bell, Printer } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function BottomInfoBar() {
  return (
    <div className="container max-w-4xl mx-auto px-3 md:px-0 pb-8 space-y-3">
      <div className="rounded-md border bg-background px-4 py-3 flex items-start justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex flex-col gap-2 text-left flex-1">
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
          <div className="flex items-start gap-2 justify-center sm:justify-start">
            <Printer
              aria-hidden
              className="h-4 w-4 mt-0.5 shrink-0 text-foreground/70"
            />
            <p>
              To view a printable version of the schedule beginning August 11,
              2025, please{" "}
              <a
                href="https://www.sonomamarintrain.org/sites/default/files/Images/PRINTABLE%20_Schedule_Aug_2025.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                click here
              </a>
              .
            </p>
          </div>
        </div>
        <div className="ml-auto shrink-0 self-center">
          <ThemeToggle />
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">
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
  );
}

export default BottomInfoBar;
