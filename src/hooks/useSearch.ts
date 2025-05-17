import { useState, useEffect } from "react";
import { Content } from "@prisma/client";
import searchContent from "@/actions/search";

export function useSearchContent(searchTerm: string, debounceDelay = 300) {
  const [results, setResults] = useState<Content[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        try {
          const data = await searchContent(searchTerm);
          setResults(data.items);
          
          setError(null);
        } catch (err) {
          console.error("Error fetching search results:", err);
          setError("Failed to fetch search results");
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      }, debounceDelay);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setError(null);
    }
  }, [searchTerm, debounceDelay]);

  return { results, isSearching, error };
}
