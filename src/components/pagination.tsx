// components/Pagination.tsx
"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, memo, useCallback, useMemo, useState } from "react";

interface PaginationProps {
  length: number;
  onPageChange?: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxDisplayed?: number;
}

export const Pagination: FC<PaginationProps> = memo(
  ({
    length,
    onPageChange,
    className = "",
    showFirstLast = false,
    maxDisplayed = 5,
  }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);
    const itemsPerPage = DEFAULT_PAGE_SIZE || 16;

    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const totalPages = Math.ceil(length / itemsPerPage);
    const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

    if (totalPages <= 1 || length <= 0) {
      return null;
    }

    const getPageNumbers = useMemo(() => {
      const pageNumbers: number[] = [];
      let startPage = Math.max(
        1,
        validCurrentPage - Math.floor(maxDisplayed / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxDisplayed - 1);

      if (endPage - startPage + 1 < maxDisplayed) {
        startPage = Math.max(1, endPage - maxDisplayed + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      return pageNumbers;
    }, [validCurrentPage, maxDisplayed, totalPages]);

    const handlePageChange = useCallback(
      (page: number) => {
        if (page < 1 || page > totalPages || page === validCurrentPage) return;

        setIsNavigating(true);
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`?${params.toString()}`, { scroll: false });

        if (onPageChange) {
          onPageChange(page);
        }
      },
      [router, searchParams, validCurrentPage, totalPages, onPageChange]
    );

    return (
      <nav
        className={`flex items-center justify-center space-x-2 mt-6 ${className}`}
        aria-label="Pagination"
        role="navigation"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(validCurrentPage - 1)}
          disabled={validCurrentPage <= 1 || isNavigating}
          aria-label="Previous page"
          className="h-10 w-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        {showFirstLast && getPageNumbers[0] > 1 && (
          <>
            <Button
              variant={validCurrentPage === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={isNavigating}
              aria-label="First page"
              className="h-10 w-10"
            >
              1
            </Button>
            {getPageNumbers[0] > 2 && (
              <span className="mx-1 text-gray-500" aria-hidden="true">
                ...
              </span>
            )}
          </>
        )}
        <div className="flex items-center gap-1">
          {getPageNumbers.map((number) => (
            <Button
              key={number}
              variant={validCurrentPage === number ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(number)}
              disabled={isNavigating}
              aria-label={`Page ${number}`}
              aria-current={validCurrentPage === number ? "page" : undefined}
              className="h-10 w-10"
            >
              {number}
            </Button>
          ))}
        </div>
        {showFirstLast &&
          getPageNumbers[getPageNumbers.length - 1] < totalPages && (
            <>
              {getPageNumbers[getPageNumbers.length - 1] < totalPages - 1 && (
                <span className="mx-1 text-gray-500" aria-hidden="true">
                  ...
                </span>
              )}
              <Button
                variant={
                  validCurrentPage === totalPages ? "default" : "outline"
                }
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={isNavigating}
                aria-label="Last page"
                className="h-10 w-10"
              >
                {totalPages}
              </Button>
            </>
          )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(validCurrentPage + 1)}
          disabled={validCurrentPage >= totalPages || isNavigating}
          aria-label="Next page"
          className="h-10 w-10"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";
