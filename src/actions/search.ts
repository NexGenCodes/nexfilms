"use server";

import { AppError } from "@/lib/appError";
import { getSearchResults } from "@/lib/db";

export default async function SearchContent(query: string) {
  try {
    return await getSearchResults(query);
  } catch (error) {
    console.error("Search error:", error);
    throw new AppError("Failed to search content", 500);
  }
}
