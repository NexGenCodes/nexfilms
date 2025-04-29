"server only";

import { DEFAULT_PAGE_SIZE } from "@/constants";
import prisma from "./prisma";
import { SortOrder } from "@/types";
import { ContentType, Prisma, Movie } from "@prisma/client";

// Generic fetch content function
async function fetchContent(
  page: number,
  sortOrder: SortOrder,
  where: Prisma.MovieWhereInput,
  cacheTag: string,
  sortField: keyof Movie = "title"
): Promise<{ items: Movie[]; totalItems: number }> {
  if (page < 1) throw new Error("Page number must be positive");
  if (!["asc", "desc"].includes(sortOrder))
    throw new Error("Invalid sort order");

  const itemsPerPage = DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * itemsPerPage;

  try {
    const [items, totalItems] = await Promise.all([
      prisma.movie.findMany({
        where,
        skip,
        take: itemsPerPage,
        orderBy: { [sortField]: sortOrder },
        cacheStrategy: { ttl: 300, tags: [cacheTag] },
      }),
      prisma.movie.count({ where, cacheStrategy: { ttl: 3600 } }),
    ]);
    return { items, totalItems };
  } catch (error) {
    console.error(`Error fetching ${cacheTag}:`, error);
    throw new Error(`Failed to fetch ${cacheTag}: ${(error as Error).message}`);
  }
}

// Fetch paginated movies
export async function fetchMovies(page: number, sortOrder: SortOrder) {
  return fetchContent(page, sortOrder, { type: ContentType.MOVIES }, "movies");
}

// Fetch paginated series
export async function fetchSeries(page: number, sortOrder: SortOrder) {
  return fetchContent(page, sortOrder, { type: ContentType.SERIES }, "series");
}

// Fetch paginated animations
export async function fetchAnimations(page: number, sortOrder: SortOrder) {
  return fetchContent(page, sortOrder, { isAnimation: true }, "animations");
}

// Fetch all content (paginated)
export async function fetchAllContent(page: number, sortOrder: SortOrder) {
  return fetchContent(page, sortOrder, {}, "all-content");
}

// Fetch recommended content (high-rated)
export async function getRecommended() {
  const itemsPerPage = DEFAULT_PAGE_SIZE;
  try {
    const [items, totalItems] = await Promise.all([
      prisma.movie.findMany({
        where: {
          rating: { gte: 4.0 }, // Adjustable threshold
        },
        orderBy: [
          { rating: "desc" }, // Highest rated first
          { createdAt: "desc" }, // Then most recent
        ],
        skip: Math.floor(Math.random() * itemsPerPage), // Random offset
        take: itemsPerPage,
        cacheStrategy: { ttl: 300, tags: ["recommended"] },
      }),
      itemsPerPage,
    ]);
    return { items, totalItems };
  } catch (error) {
    console.error("Error fetching recommended:", error);
    throw new Error(
      `Failed to fetch recommended content: ${(error as Error).message}`
    );
  }
}

// Fetch trending content
export async function getTrending() {
  const itemsPerPage = DEFAULT_PAGE_SIZE;
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 14);
    const [items, totalItems] = await Promise.all([
      prisma.movie.findMany({
        where: {
          createdAt: { gte: cutoffDate },
          rating: { gte: 4.0 },
        },
        orderBy: [
          { createdAt: "desc" }, // Most recent first
          { rating: "desc" }, // Then highest rated
        ],
        skip: Math.floor(Math.random() * itemsPerPage),
        take: itemsPerPage,
        cacheStrategy: { ttl: 300, tags: ["trending"] },
      }),
      itemsPerPage,
    ]);
    return { items, totalItems };
  } catch (error) {
    console.error("Error fetching trending:", error);
    throw new Error(
      `Failed to fetch trending content: ${(error as Error).message}`
    );
  }
}

// Fetch new releases (last 30 days)
export async function getNewReleases() {
  const itemsPerPage = DEFAULT_PAGE_SIZE;
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    const [items, totalItems] = await Promise.all([
      prisma.movie.findMany({
        where: {
          createdAt: {
            gte: cutoffDate,
            lte: new Date(),
          },
        },
        orderBy: [
          { rating: "desc" }, // Highest rated first
          { createdAt: "desc" }, // Then most recent
        ],
        take: itemsPerPage,
        cacheStrategy: { ttl: 300, tags: ["new-releases"] },
      }),
      itemsPerPage,
    ]);
    return { items, totalItems };
  } catch (error) {
    console.error("Error fetching new releases:", error);
    throw new Error(
      `Failed to fetch new releases: ${(error as Error).message}`
    );
  }
}

// Fetch movie by ID
export async function getMovieById(id: string) {
  if (!id) throw new Error("Movie ID is required");
  try {
    const movie = await prisma.movie.findUnique({
      where: { id, type: ContentType.MOVIES },
      cacheStrategy: { ttl: 300 },
    });
    if (!movie) throw new Error("Movie not found");
    return movie;
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    throw new Error(`Failed to fetch movie: ${(error as Error).message}`);
  }
}

// Fetch series by ID with seasons and episodes
export async function getSeriesById(id: string) {
  if (!id) throw new Error("Series ID is required");
  try {
    const series = await prisma.movie.findUnique({
      where: { id, type: ContentType.SERIES },
      include: { seasons: true },
      cacheStrategy: { ttl: 300 },
    });
    if (!series) throw new Error("Series not found");
    return series;
  } catch (error) {
    console.error("Error fetching series by ID:", error);
    throw new Error(`Failed to fetch series: ${(error as Error).message}`);
  }
}

// Fetch season by ID with episodes
export async function getSeasonById(seasonId: string) {
  if (!seasonId) throw new Error("Season ID is required");
  try {
    const season = await prisma.season.findUnique({
      where: { id: seasonId },
      include: { episodes: true },
      cacheStrategy: { ttl: 300 },
    });
    if (!season) throw new Error("Season not found");
    return season;
  } catch (error) {
    console.error("Error fetching season by ID:", error);
    throw new Error(`Failed to fetch season: ${(error as Error).message}`);
  }
}

// Fetch episode by ID
export async function getEpisodeById(episodeId: string) {
  if (!episodeId) throw new Error("Episode ID is required");
  try {
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
      cacheStrategy: { ttl: 300 },
    });
    if (!episode) throw new Error("Episode not found");
    return episode;
  } catch (error) {
    console.error("Error fetching episode by ID:", error);
    throw new Error(`Failed to fetch episode: ${(error as Error).message}`);
  }
}
