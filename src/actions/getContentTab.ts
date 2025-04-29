"use server";
import { CONTENT_CATEGORIES } from "@/constants";
import { getNewReleases, getRecommended, getTrending } from "@/lib/db";
import { ContentTab } from "@/types";

export async function getContentByTab(tab: ContentTab) {
  if (!tab || !CONTENT_CATEGORIES.some((category) => category.id === tab)) {
    console.log(`Invalid or no tab provided: ${tab}`);
    return { items: [], totalItems: 0 };
  }
  try {
    switch (tab as ContentTab) {
      case "trending":
        return await getTrending();
      case "new":
        return await getNewReleases();
      case "recommended":
        return await getRecommended();
      default:
        return await getTrending();
    }
  } catch (error) {
    console.error(`Error fetching content for tab ${tab}:`, error);
    return { items: [], totalItems: 0 };
  }
}
