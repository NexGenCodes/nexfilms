"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

type SortOption = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

export default function Sorting() {
  const [value, setValue] = useState<string>("asc");
  const [open, setOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const sortOptions: SortOption[] = useMemo(
    () => [
      {
        label: "A-Z",
        value: "asc",
        icon: <ArrowDownAZ className="h-4 w-4 text-muted-foreground" />,
      },
      {
        label: "Z-A",
        value: "desc",
        icon: <ArrowUpAZ className="h-4 w-4 text-muted-foreground" />,
      },
    ],
    []
  );

  useEffect(() => {
    const currentSortOrder = searchParams.get("sortOrder");
    if (
      currentSortOrder &&
      sortOptions.find((option) => option.value === currentSortOrder)
    ) {
      setValue(currentSortOrder);
    }
  }, [searchParams, sortOptions]);

  const handleSelect = useCallback(
    (selected: string) => {
      setValue(selected);
      setOpen(false);
      const params = new URLSearchParams(searchParams.toString());
      params.set("sortOrder", selected);
      const page = searchParams.get("page");
      if (page) {
        params.set("page", page);
      }
      router.push(`${window.location.pathname}?${params.toString()}`);
    },
    [searchParams, router]
  );

  const selectedOption = sortOptions.find((option) => option.value === value);

  // Animation variants for dropdown
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

  // Animation variants for menu items
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.2, ease: "easeOut" },
    }),
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[100px] justify-between"
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : "Sort by"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <AnimatePresence>
          {open && (
            <DropdownMenuContent asChild align="end" className="w-[100px] p-2">
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-background border border-border rounded-md shadow-lg"
              >
                {sortOptions.map((option, index) => (
                  <motion.div
                    key={option.value}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <DropdownMenuItem
                      onSelect={() => handleSelect(option.value)}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer p-2",
                        value === option.value && "bg-primary/10 text-primary"
                      )}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </DropdownMenuItem>
                  </motion.div>
                ))}
              </motion.div>
            </DropdownMenuContent>
          )}
        </AnimatePresence>
      </DropdownMenu>
    </div>
  );
}
