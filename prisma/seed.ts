import prisma from "@/lib/prisma";
import { ContentType, UserRole, VideoQualityType } from "@prisma/client";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";

// Type Definitions
interface UserSeed {
  name: string;
  email: string;
  rawPassword: string;
  role: UserRole;
}

interface ContentSeed {
  id: string;
  title: string;
  type: ContentType;
  isAnimation: boolean;
}

interface SeedResult {
  name: string;
  status: "Success" | "Failed";
  reason?: unknown;
}

// Predefined genre pools
const genrePool = {
  nonAnimated: [
    "Action",
    "Adventure",
    "Drama",
    "Comedy",
    "Thriller",
    "Sci-Fi",
    "Mystery",
    "Horror",
    "Romance",
    "Crime",
  ],
  animated: ["Family", "Comedy", "Adventure", "Fantasy"],
};

// Utility Functions
const generateGenres = (isAnimation: boolean): string[] => {
  const pool = isAnimation ? genrePool.animated : genrePool.nonAnimated;
  const count = Math.floor(Math.random() * 3) + 1; // 1–3 genres
  return pool.sort(() => 0.5 - Math.random()).slice(0, count);
};

const generateRating = (): number => {
  const whole = Math.floor(Math.random() * 6); // 0–5 stars
  const decimal = Math.random() < 0.5 ? 0.5 : 0;
  return Math.min(parseFloat((whole + decimal).toFixed(1)), 5); // Enforce 0–5
};

const generateReleaseDate = (): Date => {
  const startYear = 2000;
  const endYear = new Date().getFullYear();
  const randomYear =
    Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const randomMonth = Math.floor(Math.random() * 12) + 1;
  const randomDay = Math.floor(Math.random() * 28) + 1; // To avoid invalid dates
  return new Date(
    `${randomYear}-${String(randomMonth).padStart(2, "0")}-${String(
      randomDay
    ).padStart(2, "0")}`
  );
};

const generateImageUrl = (
  type: "poster" | "backdrop" | "season-poster" | "episode-thumbnail",
  isAnimation: boolean,
  title?: string
): string => {
  const baseUrl = "https://placehold.co";
  const config = {
    poster: { size: "500x750", bgColor: isAnimation ? "blue" : "gray" },
    backdrop: { size: "1280x720", bgColor: isAnimation ? "blue" : "gray" },
    "season-poster": {
      size: "500x750",
      bgColor: isAnimation ? "green" : "black",
    },
    "episode-thumbnail": {
      size: "1280x720",
      bgColor: isAnimation ? "purple" : "black",
    },
  }[type];

  const text =
    type.includes("season") || type.includes("episode")
      ? type.split("-")[0]
      : title?.replace(/ /g, "+");
  const url = `${baseUrl}/${config.size}/${config.bgColor}/white`;
  return text ? `${url}?text=${text}` : url;
};

const generateVideoQualities = (movieId?: string, episodeId?: string) => {
  const qualities: VideoQualityType[] = [
    VideoQualityType.Q240P,
    VideoQualityType.Q480P,
    VideoQualityType.Q720P,
    VideoQualityType.Q1080P,
  ];
  const count = Math.floor(Math.random() * qualities.length) + 1; // 1–4 qualities
  return qualities.slice(0, count).map((quality) => ({
    id: nanoid(),
    quality,
    url: `https://example.com/video-${quality}.mp4`,
    movieId,
    episodeId,
  }));
};

async function seedUsers() {
  try {
    const users: UserSeed[] = [
      {
        name: "Admin User",
        email: "admin@example.com",
        rawPassword: "admin123",
        role: UserRole.ADMIN,
      },
      {
        name: "Regular User",
        email: "user@example.com",
        rawPassword: "user123",
        role: UserRole.USER,
      },
    ];

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await hash(user.rawPassword, 12),
      }))
    );

    await prisma.user.createMany({
      data: hashedUsers.map((user) => ({
        id: nanoid(),
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })),
      skipDuplicates: true,
    });
    console.log("Users seeded successfully");
  } catch (error) {
    throw new Error(`Failed to seed users: ${error}`);
  }
}

async function seedContent(contents: ContentSeed[], name: string) {
  try {
    // Prepare movie data
    const movieData = contents.map((content) => {
      return {
        id: content.id,
        title: content.title,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        type: content.type,
        isAnimation: content.isAnimation,
        posterUrl: generateImageUrl(
          "poster",
          content.isAnimation,
          content.title
        ),
        genres: generateGenres(content.isAnimation),
        backdropUrl: generateImageUrl(
          "backdrop",
          content.isAnimation,
          content.title
        ),
        releaseDate: generateReleaseDate(),
        rating: generateRating(),
        duration:
          content.type === ContentType.MOVIES
            ? Math.floor(Math.random() * 60) + 90
            : Math.floor(Math.random() * 30) + 20,
        trailerUrl: "https://example.com/trailer.mp4",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
    });

    const videoQualityData = contents
      .filter((content) => content.type === ContentType.MOVIES)
      .flatMap((content) => generateVideoQualities(content.id));

    // Batch create movies, genres, and video qualities
    await prisma.$transaction([
      prisma.movie.createMany({
        data: movieData,
        skipDuplicates: true,
      }),

      prisma.videoQuality.createMany({
        data: videoQualityData,
        skipDuplicates: true,
      }),
    ]);

    // Batch create seasons and episodes for series
    const series = contents.filter((c) => c.type === ContentType.SERIES);
    if (series.length > 0) {
      const seasonData = series.flatMap((content) => {
        const seasonCount = Math.floor(Math.random() * 3) + 1;
        return Array.from({ length: seasonCount }, (_, j) => ({
          id: nanoid(),
          seasonNumber: j + 1,
          title: `Season ${j + 1}`,
          posterUrl: generateImageUrl("season-poster", content.isAnimation),
          movieId: content.id,
          overview: "Season overview placeholder.",
          releaseDate: new Date(`${2015 + j}-01-01`),
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        }));
      });

      const episodeData = seasonData.flatMap((season) => {
        const episodeCount = Math.floor(Math.random() * 6) + 5;
        return Array.from({ length: episodeCount }, (_, k) => ({
          id: nanoid(),
          episodeNumber: k + 1,
          title: `Episode ${k + 1}`,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          duration: Math.floor(Math.random() * 30) + 20,
          thumbnailUrl: generateImageUrl("episode-thumbnail", false),
          rating: generateRating(),
          trailerUrl: "https://example.com/trailer.mp4",
          releaseDate: new Date(
            `${2015 + season.seasonNumber}-01-${(k + 1)
              .toString()
              .padStart(2, "0")}`
          ),
          seasonId: season.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        }));
      });

      const videoQualityDataEpisodes = episodeData.flatMap((episode) =>
        generateVideoQualities(undefined, episode.id)
      );

      await prisma.$transaction([
        prisma.season.createMany({ data: seasonData, skipDuplicates: true }),
        prisma.episode.createMany({ data: episodeData, skipDuplicates: true }),
        prisma.videoQuality.createMany({
          data: videoQualityDataEpisodes,
          skipDuplicates: true,
        }),
      ]);
    }
    console.log(`${name} seeded successfully: ${contents.length} items`);
  } catch (error) {
    throw new Error(`Failed to seed content: ${error}`);
  }
}

async function seedWatchlist(): Promise<void> {
  try {
    const [allMovies, allUsers] = await Promise.all([
      prisma.movie.findMany({ select: { id: true } }),
      prisma.user.findMany({ select: { id: true } }),
    ]);

    const watchlistData = allUsers.flatMap((user) => {
      const watchlistMovies = allMovies
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 3);
      return watchlistMovies.map((movie) => ({
        id: nanoid(),
        userId: user.id,
        movieId: movie.id,
        addedAt: new Date(),
      }));
    });

    await prisma.$transaction([
      prisma.watchlist.deleteMany(),
      prisma.watchlist.createMany({
        data: watchlistData,
        skipDuplicates: true,
      }),
    ]);
    console.log("Watchlists seeded successfully");
  } catch (error) {
    throw new Error(`Failed to seed watchlist: ${error}`);
  }
}

// Content Generation Functions
const generateMovies = (count: number): ContentSeed[] =>
  Array.from({ length: count }, (_, i) => ({
    id: nanoid(),
    title: `Movie Title ${i + 1}`,
    type: ContentType.MOVIES,
    isAnimation: false,
  }));

const generateSeries = (count: number): ContentSeed[] =>
  Array.from({ length: count }, (_, i) => ({
    id: nanoid(),
    title: `Series Title ${i + 1}`,
    type: ContentType.SERIES,
    isAnimation: false,
  }));

const generateAnimationMovies = (count: number): ContentSeed[] =>
  Array.from({ length: count }, (_, i) => ({
    id: nanoid(),
    title: `Animation Title ${i + 1}`,
    type: ContentType.MOVIES,
    isAnimation: true,
  }));

const generateAnimationSeries = (count: number): ContentSeed[] =>
  Array.from({ length: count }, (_, i) => ({
    id: nanoid(),
    title: `Animation Series ${i + 1}`,
    type: ContentType.SERIES,
    isAnimation: true,
  }));

async function main() {
  console.log("Starting database seeding...");

  // Generate content
  const movies = generateMovies(20);
  const series = generateSeries(15);
  const animationMovies = generateAnimationMovies(10);
  const animationSeries = generateAnimationSeries(10);

  // Seed dependencies sequentially

  const userResult = await executeWithRetry("Users", seedUsers);
  if (userResult.status === "Failed") {
    console.error("User seeding failed, aborting:", userResult.reason);
    process.exit(1);
  }

  // Seed content
  const contentOperations = [
    { name: "Movies", promise: () => seedContent(movies, "Movies") },
    { name: "Series", promise: () => seedContent(series, "series") },
    {
      name: "Animation Movies",
      promise: () => seedContent(animationMovies, "animationMovies"),
    },
    {
      name: "Animation Series",
      promise: () => seedContent(animationSeries, "animationSeries"),
    },
  ];

  const contentResults: SeedResult[] = [];
  for (const op of contentOperations) {
    const result = await executeWithRetry(op.name, op.promise);
    contentResults.push(result);
  }

  // Check for content failures
  const failedContent = contentResults.filter((r) => r.status === "Failed");
  if (failedContent.length > 0) {
    console.warn(
      `Warning: Content seeding failed for: ${failedContent
        .map((f) => f.name)
        .join(", ")}`
    );
    throw new Error("Cannot seed watchlist due to failed content seeding");
  }

  // Seed watchlist
  const watchlistResult = await executeWithRetry("Watchlist", seedWatchlist);

  // Final report
  const allResults = [userResult, watchlistResult, ...contentResults];
  console.log("\nFinal Seeding Report:");
  allResults.forEach((r) => {
    console.log(`${r.name}: ${r.status}${r.reason ? ` - ${r.reason}` : ""}`);
  });

  const failed = allResults.filter((r) => r.status === "Failed");
  if (failed.length > 0) {
    throw new Error(
      `Seeding failed for: ${failed.map((f) => f.name).join(", ")}`
    );
  }
}

// Retry logic for transient errors
const maxRetries = 3;
const executeWithRetry = async (
  name: string,
  promise: () => Promise<void>
): Promise<SeedResult> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await promise();
      return { name, status: "Success" };
    } catch (error) {
      console.warn(`${name}: Attempt ${attempt} failed - ${error}`);
      if (attempt === maxRetries || !isTransientError(error)) {
        return { name, status: "Failed", reason: error };
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  return {
    name,
    status: "Failed",
    reason: new Error("Unexpected retry failure"),
  };
};

// Check for transient Prisma errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTransientError = (error: any): boolean => {
  return (
    error.code === "P1001" || // Database unreachable
    error.code === "P1003" || // Database does not exist
    error.message.includes("timeout") ||
    error.message.includes("connection")
  );
};

// Execute Seeding
main()
  .then(() => {
    console.log("Seeding completed successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding process encountered errors:", err);
    process.exit(1);
  });
