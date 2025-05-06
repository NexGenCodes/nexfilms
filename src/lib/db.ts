"server only";

import { DEFAULT_PAGE_SIZE, OTP_EXPIRATION, OTP_LENGTH } from "@/constants";
import prisma from "./prisma";
import { SortOrder } from "@/types";
import { ContentType, Prisma, Movie } from "@prisma/client";
import { AppError } from "./appError";

// Constants
const CACHE_TTL = OTP_EXPIRATION;
const CACHE_TAGS = {
  MOVIES: "movies",
  SERIES: "series",
  ANIMATIONS: "animations",
  RECOMMENDED: "recommended",
  TRENDING: "trending",
  NEW_RELEASES: "new-releases",
  SIMILAR_MOVIES: "similar-movies",
  USER_WATCHLIST: "user-watchlist",
  USER_EMAIL: "user-email",
  USER_ID: "user-id",
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
    console.error(errorMessage, error);
    throw new AppError(`${errorMessage}: ${(error as Error).message}`, 500);
  }
}

// Generic fetch content function
async function fetchContent(
  page: number,
  sortOrder: SortOrder,
  where: Prisma.MovieWhereInput,
  cacheTag: string,
  sortField: keyof Movie = "title"
) {
  if (page < 1) throw new AppError("Page number must be positive", 400);
  if (!["asc", "desc"].includes(sortOrder))
    throw new AppError("Invalid sort order", 400);

  const itemsPerPage = DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * itemsPerPage;

  return handleDatabaseOperation(async () => {
    const [items, totalItems] = await Promise.all([
      prisma.movie.findMany({
        where,
        skip,
        take: itemsPerPage,
        orderBy: { [sortField]: sortOrder },
        cacheStrategy: applyCacheStrategy([cacheTag]),
        include: { movieGenres: { include: { genre: true } } },
      }),
      prisma.movie.count({
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
    CACHE_TAGS.MOVIES
  );
}

// Fetch paginated series
export async function fetchSeries(page: number, sortOrder: SortOrder) {
  return fetchContent(
    page,
    sortOrder,
    { type: ContentType.SERIES },
    CACHE_TAGS.SERIES
  );
}

// Fetch paginated animations
export async function fetchAnimations(page: number, sortOrder: SortOrder) {
  return fetchContent(
    page,
    sortOrder,
    { isAnimation: true },
    CACHE_TAGS.ANIMATIONS
  );
}

// Fetch recommended content (high-rated)
export async function getRecommended() {
  const itemsPerPage = DEFAULT_PAGE_SIZE;
  return handleDatabaseOperation(async () => {
    const [items, totalItems] = await Promise.all([
      prisma.movie.findMany({
        where: { rating: { gte: 4.0 } }, // Adjustable threshold
        include: { movieGenres: { include: { genre: true } } },
        orderBy: [{ rating: "desc" }],
        skip: Math.floor(Math.random() * itemsPerPage), // Random offset
        take: itemsPerPage,
        cacheStrategy: applyCacheStrategy([CACHE_TAGS.RECOMMENDED]),
      }),
      itemsPerPage,
    ]);
    return { items, totalItems };
  }, "Failed to fetch recommended content");
}

// Fetch trending content
export async function getTrending() {
  const itemsPerPage = DEFAULT_PAGE_SIZE;
  return handleDatabaseOperation(async () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 14);
    const [items, totalItems] = await Promise.all([
      prisma.movie.findMany({
        where: {
          createdAt: { gte: cutoffDate },
          rating: { gte: 3.0 }, // Adjustable threshold
        },
        include: { movieGenres: { include: { genre: true } } },
        orderBy: [{ title: "asc" }], // Then alphabetically
        skip: Math.floor(Math.random() * itemsPerPage),
        take: itemsPerPage,
        cacheStrategy: applyCacheStrategy([CACHE_TAGS.TRENDING]),
      }),
      itemsPerPage,
    ]);
    return { items, totalItems };
  }, "Failed to fetch trending content");
}

// Fetch new releases (last 30 days)
export async function getNewReleases() {
  const itemsPerPage = DEFAULT_PAGE_SIZE;
  return handleDatabaseOperation(async () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    const [items, totalItems] = await Promise.all([
      prisma.movie.findMany({
        where: { createdAt: { gte: cutoffDate, lte: new Date() } },
        include: { movieGenres: { include: { genre: true } } },
        orderBy: [{ createdAt: "desc" }], // Then most recent
        take: itemsPerPage,
        cacheStrategy: applyCacheStrategy([CACHE_TAGS.NEW_RELEASES]),
      }),
      itemsPerPage,
    ]);
    return { items, totalItems };
  }, "Failed to fetch new releases");
}

// Fetch movie by ID
export async function getMovieById(id: string) {
  if (!id) throw new AppError("Movie ID is required", 400);
  return handleDatabaseOperation(async () => {
    const movie = await prisma.movie.findUnique({
      where: { id, type: ContentType.MOVIES },
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.MOVIES]),
      include: { movieGenres: { include: { genre: true } } },
    });
    if (!movie) throw new AppError("Movie not found", 404);
    return movie;
  }, "Failed to fetch movie");
}

// Fetch series by ID with seasons and episodes
export async function getSeriesById(id: string) {
  if (!id) throw new AppError("Series ID is required", 400);
  return handleDatabaseOperation(async () => {
    const series = await prisma.movie.findUnique({
      where: { id, type: ContentType.SERIES },
      include: {
        seasons: { include: { episodes: true } },
        movieGenres: { include: { genre: true } },
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
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.SERIES]),
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
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.SERIES]),
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
  if (!genres || genres.length === 0) {
    throw new AppError("At least one genre must be provided", 400);
  }

  return handleDatabaseOperation(async () => {
    const similarMovies = await prisma.movie.findMany({
      where: {
        type,
        rating: { gte: minRating },
        movieGenres: { some: { genre: { name: { in: genres } } } },
      },
      include: { movieGenres: { include: { genre: true } } },
      orderBy: [
        { rating: "desc" }, // Higher-rated movies first
        { title: "asc" }, // Alphabetical order as a secondary sort
      ],
      take: 10, // Limit the number of recommendations
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.SIMILAR_MOVIES]),
    });

    if (similarMovies.length === 0) {
      throw new AppError("No similar movies found", 404);
    }

    return similarMovies;
  }, "Failed to fetch similar movies");
}

// fetch user watchlist
export async function getUserWatchlist(userId: string) {
  if (!userId) throw new AppError("User ID is required", 400);
  return handleDatabaseOperation(async () => {
    const watchlist = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        watchlist: {
          include: {
            Movie: {
              include: { movieGenres: { include: { genre: true } } },
            },
          },
        },
      },
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.USER_WATCHLIST]),
    });
    return watchlist;
  }, "Failed to fetch user watchlist");
}

// fetch user by email
export async function getUserByEmail(email: string) {
  if (!email) throw new AppError("Email is required", 400);
  return handleDatabaseOperation(async () => {
    const user = await prisma.user.findUnique({
      where: { email },
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.USER_EMAIL]),
    });
    return user;
  }, "Failed to fetch user");
}

// fetch user by ID
export async function getUserById(id: string) {
  if (!id) throw new AppError("User ID is required", 400);
  return handleDatabaseOperation(async () => {
    const user = await prisma.user.findUnique({
      where: { id },
      cacheStrategy: applyCacheStrategy([CACHE_TAGS.USER_ID]),
    });
    return user;
  }, "Failed to fetch user");
}

export async function createUser(
  name: string,
  email: string,
  password: string
) {
  if (!name || !email || !password) {
    throw new AppError("All fields are required", 400);
  }
  if (password.length < OTP_LENGTH) {
    throw new AppError("Password must be at least 8 characters long", 400);
  }
  return handleDatabaseOperation(async () => {
    const user = await prisma.user.create({
      data: { name, email, password },
    });
    return user;
  }, "Failed to create user");
}

export async function updateUser(userId: string, data: Prisma.UserUpdateInput) {
  if (!userId || !data) {
    throw new AppError("User ID and data are required", 400);
  }
  return handleDatabaseOperation(async () => {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });
    return user;
  }, "Failed to update user");
}
