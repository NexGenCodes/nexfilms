import prisma from "@/lib/prisma";
import { ContentType, UserRole } from "@prisma/client";
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
  genres: string[];
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
  const whole = Math.floor(Math.random() * 5) + 1; // 1–5 stars
  const decimal = Math.random() < 0.5 ? 0.5 : 0;
  return parseFloat((whole + decimal).toFixed(1));
};

const generateYear = (): string => `${2015 + Math.floor(Math.random() * 10)}`;

const generateReleaseDate = (year: string): string => `${year}-01-01`;

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
      bgColor: isAnimation ? "green" : "darkgray",
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

// Seeding Functions
async function seedUsers(): Promise<void> {
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

  await prisma.$transaction(
    hashedUsers.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          id: nanoid(),
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          emailVerified: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    )
  );
  console.log("Users seeded successfully");
}

async function seedContent(contents: ContentSeed[]): Promise<void> {
  // Batch create movies/series
  await prisma.$transaction(
    contents.map((content) => {
      const year = generateYear();
      return prisma.movie.upsert({
        where: { id: content.id },
        update: {},
        create: {
          id: content.id,
          title: content.title,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          type: content.type,
          isAnimation: content.isAnimation,
          posterUrl: generateImageUrl(
            "poster",
            content.isAnimation,
            content.title
          ),
          backdropUrl: generateImageUrl(
            "backdrop",
            content.isAnimation,
            content.title
          ),
          year,
          releaseDate: new Date(generateReleaseDate(year)),
          rating: generateRating(),
          genres: content.genres,
          duration:
            content.type === ContentType.MOVIES
              ? Math.floor(Math.random() * 60) + 90
              : Math.floor(Math.random() * 30) + 20,
          videoUrl: "https://example.com/video.mp4",
          trailerUrl: "https://example.com/trailer.mp4",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    })
  );

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
      }));
    });

    const episodeData = seasonData.flatMap((season) => {
      const episodeCount = Math.floor(Math.random() * 6) + 5;
      return Array.from({ length: episodeCount }, (_, k) => ({
        id: nanoid(),
        episodeNumber: k + 1,
        title: `Episode ${k + 1}`,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        duration: Math.floor(Math.random() * 30) + 20,
        thumbnailUrl: generateImageUrl("episode-thumbnail", false),
        videoUrl: "https://example.com/video.mp4",
        trailerUrl: "https://example.com/trailer.mp4",
        releaseDate: new Date(
          `${2015 + season.seasonNumber}-01-${(k + 1)
            .toString()
            .padStart(2, "0")}`
        ),
        seasonId: season.id,
      }));
    });

    await prisma.$transaction([
      ...seasonData.map((season) => prisma.season.create({ data: season })),
      ...episodeData.map((episode) => prisma.episode.create({ data: episode })),
    ]);
  }
  console.log(`Content seeded successfully: ${contents.length} items`);
}

async function seedWatchlist(): Promise<void> {
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
    prisma.watchlist.createMany({ data: watchlistData }),
  ]);
  console.log("Watchlists seeded successfully");
}

// Content Generation Functions
const generateMovies = (count: number): ContentSeed[] =>
  Array.from({ length: count }, (_, i) => ({
    id: nanoid(),
    title: `Movie Title ${i + 1}`,
    type: ContentType.MOVIES,
    isAnimation: false,
    genres: generateGenres(false),
  }));

const generateSeries = (count: number): ContentSeed[] =>
  Array.from({ length: count }, (_, i) => ({
    id: nanoid(),
    title: `Series Title ${i + 1}`,
    type: ContentType.SERIES,
    isAnimation: false,
    genres: generateGenres(false),
  }));

const generateAnimationMovies = (count: number): ContentSeed[] =>
  Array.from({ length: count }, (_, i) => ({
    id: nanoid(),
    title: `Animation Title ${i + 1}`,
    type: ContentType.MOVIES,
    isAnimation: true,
    genres: generateGenres(true),
  }));

const generateAnimationSeries = (count: number): ContentSeed[] =>
  Array.from({ length: count }, (_, i) => ({
    id: nanoid(),
    title: `Animation Series ${i + 1}`,
    type: ContentType.SERIES,
    isAnimation: true,
    genres: generateGenres(true),
  }));

// Main Seeding Logic
interface SeedResult {
  name: string;
  status: "Success" | "Failed";
  reason?: unknown;
}

async function main(): Promise<void> {
  console.log("Starting database seeding...");

  // Generate content
  const movies = generateMovies(20);
  const series = generateSeries(15);
  const animationMovies = generateAnimationMovies(5);
  const animationSeries = generateAnimationSeries(5);

  // Define seeding operations
  const seedingOperations = [
    { name: "Users", promise: () => seedUsers() },
    { name: "Movies", promise: () => seedContent(movies) },
    { name: "Series", promise: () => seedContent(series) },
    { name: "Animation Movies", promise: () => seedContent(animationMovies) },
    { name: "Animation Series", promise: () => seedContent(animationSeries) },
  ];

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
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
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
  const isTransientError = (error: any) => {
    return (
      error.code === "P1001" || // Database unreachable
      error.code === "P1003" || // Database does not exist
      error.message.includes("timeout") ||
      error.message.includes("connection")
    );
  };

  // Run content seeding concurrently
  const contentResults = await Promise.all(
    seedingOperations.map((op) => executeWithRetry(op.name, op.promise))
  );

  // Log content seeding results
  console.log("Content Seeding Report:");
  contentResults.forEach((r) => {
    if (r.status === "Success") {
      console.log(`${r.name}: Succeeded`);
    } else {
      console.error(`${r.name}: Failed - ${r.reason || r.reason}`);
    }
  });

  // Check for critical failures
  const failed = contentResults.filter((r) => r.status === "Failed");
  if (failed.length > 0) {
    console.warn(
      `Warning: Seeding failed for: ${failed.map((f) => f.name).join(", ")}`
    );
    if (
      failed.some(
        (f) =>
          f.name === "Users" ||
          f.name.includes("Movies") ||
          f.name.includes("Series")
      )
    ) {
      throw new Error(
        "Cannot seed watchlist due to failed user or content seeding"
      );
    }
  }

  // Seed watchlist (dependent on users and content)
  const watchlistResult = await executeWithRetry("Watchlist", seedWatchlist);
  contentResults.push(watchlistResult);

  // Log watchlist result
  console.log("Watchlist Seeding Report:");
  console.log(
    `${watchlistResult.name}: ${watchlistResult.status}${
      watchlistResult.reason ? ` - ${watchlistResult.reason}` : ""
    }`
  );

  // Final report
  console.log("\nFinal Seeding Report:");
  contentResults.forEach((r) => {
    if (r.status === "Success") {
      console.log(`${r.name}: Succeeded`);
    } else {
      console.error(`${r.name}: Failed - ${r.reason}`);
    }
  });

  // Throw if any operation failed
  const finalFailed = contentResults.filter((r) => r.status === "Failed");
  if (finalFailed.length > 0) {
    throw new Error(
      `Seeding failed for: ${finalFailed.map((f) => f.name).join(", ")}`
    );
  }
}

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
