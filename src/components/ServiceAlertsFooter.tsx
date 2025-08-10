import React from "react";

export function ServiceAlertsFooter() {
  return (
    <footer className="container mx-auto px-4 pb-8 text-center text-sm text-muted-foreground">
      <div className="mx-auto max-w-3xl rounded-md border bg-background px-4 py-3">
        Receive Service Alerts by texting the word{" "}
        <span className="font-semibold">SMART</span> to
        <span className="font-semibold"> 888777</span> or
        <span> </span>
        <a
          href="https://member.everbridge.net/index/892807736728379#/login"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          click here
        </a>
        <span> to sign-up.</span>
      </div>
    </footer>
  );
}

export default ServiceAlertsFooter;
