import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) =>
            setTheme(value as "light" | "dark" | "system")
          }
        >
          <DropdownMenuRadioItem
            value="light"
            className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
          >
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="dark"
            className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="system"
            className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
          >
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
