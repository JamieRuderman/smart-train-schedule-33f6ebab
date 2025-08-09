import smartLogo from "@/assets/smart-logo.svg";

export function AppHeader() {
  return (
    <header
      className="container mx-auto px-4 pt-4 pb-36 flex flex-col items-center bg-smart-train-green xl:rounded-b-2xl"
      role="banner"
    >
      <img
        src={smartLogo}
        alt="Sonoma-Marin Area Rail Transit Logo"
        className="h-auto w-64 sm:w-96 max-w-full"
      />
      <h1 className="sr-only">SMART Train Schedule Application</h1>
    </header>
  );
}
