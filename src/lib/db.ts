("server only");

import { DEFAULT_PAGE_SIZE, CACHE_TTL } from "@/constants";
import prisma from "./prisma";
import { AppError } from "./appError";
import { Prisma, ContentType } from "@prisma/client";
import { ContentTabResult, SortOrder } from "@/type";

// Constants
const CACHE_TAGS = {
  MOVIES: "movies",
  SERIES: "series",
  SEASONS: "seasons",
  EPISODES: "episodes",
  ANIMATIONS: "animations",
  RECOMMENDED: "recommended",
  TRENDING: "trending",
  NEW_RELEASES: "new-releases",
  SIMILAR_MOVIES: "similar-movies",
  CONTENT: "content",
};

// Shared include object for content queries
const contentInclude = {
  movie: { select: { rating: true, trailerUrl: true } },
  series: { include: { seasons: { select: { id: true, number: true } } } },
  genres: { include: { genre: { select: { name: true, slug: true } } } },
  cast: { select: { name: true } },
};

// Utility: Apply cache strategy
function applyCacheStrategy(tags: string[], ttl = CACHE_TTL) {
  return { ttl, tags };
}

// Utility: Handle database operations with error handling
async function handleDatabaseOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    throw new AppError(`${errorMessage}: ${(error as Error).message}`, 500);
  }
}

// Generic fetch content function
async function fetchContent(
  page: number,
  sortOrder: SortOrder,
  where: Prisma.ContentWhereInput,
  cacheTag: string,
  includeMovie: boolean = false,
  includeSeries: boolean = false
) {
  if (page < 1) throw new AppError("Page number must be positive", 400);
  if (!["asc", "desc"].includes(sortOrder))
    throw new AppError("Invalid sort order", 400);

  const itemsPerPage = DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * itemsPerPage;

  return handleDatabaseOperation(async () => {
    const include = {
      movie: includeMovie,
      series: includeSeries && { include: { seasons: false } }, // Avoid deep nesting
    };

    const [items, totalItems] = await Promise.all([
      prisma.content.findMany({
        where,
        skip,
        take: itemsPerPage,
        orderBy: { title: sortOrder },
        include,
        cacheStrategy: applyCacheStrategy([cacheTag]),
      }),
      prisma.content.count({
        where,
        cacheStrategy: applyCacheStrategy([cacheTag], 3600),
      }),
    ]);
    return { items, totalItems };
  }, `Failed to fetch ${cacheTag}`);
}

// Fetch paginated movies
export async function fetchMovies(page: number, sortOrder: SortOrder) {
  return fetchContent(
    page,
    sortOrder,
    { type: ContentType.MOVIES },
    CACHE_TAGS.MOVIES,
    true // Include movie relation
  );
}

// Fetch paginated series
export async function fetchSeries(page: number, sortOrder: SortOrder) {
  return fetchContent(
    page,
    sortOrder,
    { type: ContentType.SERIES },
    CACHE_TAGS.SERIES,
    false,
    true // Include series relation
  );
}

// Fetch paginated animations
export async function fetchAnimations(page: number, sortOrder: SortOrder) {
  return fetchContent(
    page,
    sortOrder,
    { isAnimation: true },
    CACHE_TAGS.ANIMATIONS,
    true,
    true
  );
}

// Function to get 16 recommendations
export async function getRecommendations(): Promise<ContentTabResult> {
  return handleDatabaseOperation(async () => {
    const recommendations = await prisma.content.findMany({
      orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
      take: 16,
      include: contentInclude,
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.RECOMMENDED]),
    });

    if (recommendations.length < 16) {
      console.warn(
        `Only ${recommendations.length} items available for recommendations.`
      );
    }

    return { items: recommendations, totalItems: recommendations.length };
  }, "Failed to fetch recommendations");
}

// Fetch trending content
export async function getTrending(): Promise<ContentTabResult> {
  return handleDatabaseOperation(async () => {
    // Fetch top 8 movies by rating
    const topMovies = await prisma.content.findMany({
      where: {
        type: ContentType.MOVIES,
        movie: { rating: { gte: 3.5 } },
      },
      orderBy: [{ movie: { rating: "desc" } }, { createdAt: "desc" }],
      take: 8,
      include: contentInclude,
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.TRENDING]),
    });

    // Fetch top 8 series with at least one episode rated >= 3.5
    const topSeries = await prisma.content.findMany({
      where: {
        type: ContentType.SERIES,
        series: {
          seasons: {
            some: { episodes: { some: { rating: { gte: 3.5 } } } },
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
      take: 8,
      include: contentInclude,
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.TRENDING]),
    });

    // Combine and sort by rating (movies use movie.rating, series fallback to 3.5)
    const trending = [...topMovies, ...topSeries]
      .sort((a, b) => {
        const aRating = a.movie?.rating ?? (a.series ? 3.5 : 0);
        const bRating = b.movie?.rating ?? (b.series ? 3.5 : 0);
        return bRating - aRating;
      })
      .slice(0, 16);

    if (trending.length < 16) {
      console.warn(`Only ${trending.length} trending items available.`);
    }

    return { items: trending, totalItems: trending.length };
  }, "Failed to fetch trending content");
}

// Fetch newly added content (sorted by createdAt)
export async function getNewReleases(): Promise<ContentTabResult> {
  return handleDatabaseOperation(async () => {
    const newAddedContent = await prisma.content.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 16,
      include: contentInclude,
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.NEW_RELEASES]),
    });

    if (newAddedContent.length < 16) {
      console.warn(
        `Only ${newAddedContent.length} newly added items available.`
      );
    }

    return { items: newAddedContent, totalItems: newAddedContent.length };
  }, "Failed to fetch newly added content");
}

// Fetch movie by ID
export async function getMovieById(id: string) {
  if (!id) throw new AppError("Movie ID is required", 400);
  return handleDatabaseOperation(async () => {
    const movie = await prisma.content.findUnique({
      where: { id, type: ContentType.MOVIES },
      include: {
        movie: {
          include: {
            videoQualities: true,
          },
        },
        genres: {
          include: {
            genre: true,
          },
        },
        cast: true,
      },
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.MOVIES]),
    });
    if (!movie) throw new AppError("Movie not found", 404);
    return movie;
  }, "Failed to fetch movie");
}

// Fetch series by ID with seasons and optional episodes
export async function getSeriesById(id: string, includeEpisodes = false) {
  if (!id) throw new AppError("Series ID is required", 400);
  return handleDatabaseOperation(async () => {
    const series = await prisma.content.findUnique({
      where: { id, type: ContentType.SERIES },
      include: {
        genres: { include: { genre: true } },
        cast: { select: { name: true } },
        series: {
          include: { seasons: { include: { episodes: includeEpisodes } } },
        },
      },
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.SERIES]),
    });
    if (!series) throw new AppError("Series not found", 404);
    return series;
  }, "Failed to fetch series");
}

// Fetch season by ID with episodes
export async function getSeasonById(seasonId: string) {
  if (!seasonId) throw new AppError("Season ID is required", 400);
  return handleDatabaseOperation(async () => {
    const season = await prisma.season.findUnique({
      where: { id: seasonId },
      include: { episodes: true },
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.SEASONS]),
    });
    if (!season) throw new AppError("Season not found", 404);
    return season;
  }, "Failed to fetch season");
}

// Fetch episode by ID
export async function getEpisodeById(episodeId: string) {
  if (!episodeId) throw new AppError("Episode ID is required", 400);
  return handleDatabaseOperation(async () => {
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
      include: {
        videoQualities: true,
      },
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.EPISODES]),
    });
    if (!episode) throw new AppError("Episode not found", 404);
    return episode;
  }, "Failed to fetch episode");
}

// Fetch similar movies based on genres and rating
export async function getSimilarMovies(
  type: ContentType,
  genres: string[],
  minRating: number
) {
  if (!genres?.length) {
    throw new AppError("At least one genre must be provided", 400);
  }
  return handleDatabaseOperation(async () => {
    const similarMovies = await prisma.content.findMany({
      where: {
        type,
        genres: { some: { genre: { name: { in: genres } } } },
        movie: { rating: { gte: minRating } },
      },
      orderBy: [{ movie: { rating: "desc" } }, { title: "asc" }],
      take: 10,
      include: { movie: true },
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.SIMILAR_MOVIES]),
    });
    if (!similarMovies.length) {
      throw new AppError("No similar movies found", 404);
    }
    return similarMovies;
  }, "Failed to fetch similar movies");
}

export async function getSearchResults(query?: string) {
  if (!query) return undefined;
  if (!query || query.trim() === "") return [];
  const sanitizedQuery = query.trim().slice(0, 100);
  return handleDatabaseOperation(async () => {
    const content = await prisma.content.findMany({
      where: {
        OR: [
          { title: { contains: sanitizedQuery, mode: "insensitive" } },
          { description: { contains: sanitizedQuery, mode: "insensitive" } },
          {
            genres: {
              some: {
                genre: {
                  name: { contains: sanitizedQuery, mode: "insensitive" },
                },
              },
            },
          },
        ],
      },
      orderBy: { title: "asc" },
      include: contentInclude,
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.CONTENT]),
    });
    return content;
  }, "Failed to fetch content");
}
