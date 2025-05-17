"use client";

import { useOnClickOutside } from "@/hooks/use-click-outside";
import { useState, useRef } from "react";
import { SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSearchContent } from "@/hooks/useSearch";
import LoadingSpinner from "./spinner";

export function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { results, isSearching, error } = useSearchContent(searchTerm);

  useOnClickOutside(searchRef, () => setIsFocused(false));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsFocused(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative lg:w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative w-full max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search movies, series, genres..."
          className="w-full pl-9 pr-8 bg-muted transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </form>

      {/* Search results dropdown */}
      {isFocused && searchTerm.trim().length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-[70vh] overflow-auto">
          {error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : isSearching ? (
            <div className="p-4 text-center">
              <LoadingSpinner />
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.slice(0, 6).map((result) => (
                <Link
                  key={result.id}
                  href={`/${result.type}/${result.id}`}
                  className="flex items-center gap-3 p-2 hover:bg-muted transition-colors"
                  onClick={() => setIsFocused(false)}
                >
                  <div className="relative h-12 w-8 flex-shrink-0 overflow-hidden rounded">
                    <Image
                      src={result.posterUrl}
                      alt={result.title}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{result.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {result.type.charAt(0).toUpperCase() +
                        result.type.slice(1)}{" "}
                      • {result.releaseDate.getFullYear()}
                    </p>
                  </div>
                </Link>
              ))}
              {results.length > 6 && (
                <Link
                  href={`/search?q=${encodeURIComponent(searchTerm)}`}
                  className="block p-2 text-center text-sm text-green-500 hover:underline"
                  onClick={() => setIsFocused(false)}
                >
                  View all {results.length} results
                </Link>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No results found for &quot;{searchTerm}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
