"use client";

import React from "react";
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
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const themes = [
  {
    key: "light",
    label: "Light",
    icon: Sun,
  },
  {
    key: "dark",
    label: "Dark",
    icon: Moon,
  },
  {
    key: "system",
    label: "System",
    icon: Laptop,
  },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.2, ease: "easeOut" },
  }),
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          className="relative"
        >
          <span className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                "absolute transition-all duration-300 ease-in-out",
                "opacity-100 scale-100 rotate-0",
                "dark:opacity-0 dark:scale-0 dark:rotate-90"
              )}
            >
              <Sun className="h-6 w-6" />
            </span>
            <span
              className={cn(
                "absolute transition-all duration-300 ease-in-out",
                "opacity-0 scale-0 -rotate-90",
                "dark:opacity-100 dark:scale-100 dark:rotate-0"
              )}
            >
              <Moon className="h-6 w-6" />
            </span>
          </span>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {open && (
          <DropdownMenuContent asChild align="end" forceMount>
            <motion.div
              className="p-2 w-40 bg-background border border-border rounded-md shadow-lg"
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {themes.map((t, i) => (
                <motion.div
                  key={t.key}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <DropdownMenuItem
                    onClick={() => setTheme(t.key)}
                    className={cn(
                      "flex items-center cursor-pointer rounded-sm p-2",
                      theme === t.key && "bg-primary/10 text-primary"
                    )}
                  >
                    <t.icon className="mr-2 h-4 w-4" />
                    <span>{t.label}</span>
                  </DropdownMenuItem>
                  {i < themes.length - 1 && (
                    <DropdownMenuSeparator className="my-2 border-t border-gray-500/55" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
}
