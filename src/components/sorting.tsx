"use client";

import { cn, debounce } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { FC, memo, useCallback } from "react";

interface SortingProps {
  className?: string;
}

type SortOder = "asc" | "desc";

export const Sorting: FC<SortingProps> = memo(({ className = "" }) => {
  const searchParams = useSearchParams();

  const currentSortOrder = searchParams.get("sortOrder") || "asc";

  const updateUrl = useCallback((params: URLSearchParams) => {
    debounce(() => {
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.location.href = newUrl; // Reload the page with the new URL
    }, 300)();
  }, []);

  const handleSortOrderChange = useCallback(
    (sortOrder: SortOder) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sortOrder", sortOrder);
      params.delete("page"); // Reset to page 1
      updateUrl(params);
    },
    [searchParams, updateUrl]
  );

  return (
    <div
      className={cn("flex items-center space-x-2 sm:space-x-4", className)}
      role="region"
      aria-label="Sort controls"
    >
      <div className="flex space-x-1">
        <Button
          size="sm"
          variant="outline"
          disabled={currentSortOrder === "asc"}
          className={cn(
            "hover:bg-primary capitalize",
            currentSortOrder === "asc"
              ? "bg-primary dark:bg-primary/50 text-primary-foreground"
              : "bg-transparent"
          )}
          onClick={() => handleSortOrderChange("asc")}
          aria-label="Sort ascending"
        >
          Asc
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={currentSortOrder === "desc"}
          className={cn(
            "hover:bg-primary capitalize",
            currentSortOrder === "desc"
              ? "bg-primary dark:bg-primary/50 text-primary-foreground"
              : "bg-transparent"
          )}
          onClick={() => handleSortOrderChange("desc")}
          aria-label="Sort descending"
        >
          Desc
        </Button>
      </div>
    </div>
  );
});

Sorting.displayName = "Sorting";
