"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Separator = () => (
  <DropdownMenuSeparator className="border-t border-gray-500/55 my-2" />
);

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="p-2 w-40">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={theme === "light" ? "bg-primary/50" : ""}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "bg-primary/50" : ""}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={theme === "system" ? "bg-primary/50" : ""}
        >
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
