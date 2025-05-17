/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PrismaClient,
  ContentType,
  PgRating,
  VideoQualityType,
  Genre,
  Cast,
} from "@prisma/client";

const prisma = new PrismaClient();

// Configuration for video qualities
const videoQualities: {
  quality: VideoQualityType;
  url: (id: string) => string;
}[] = [
  {
    quality: "Q240P" as VideoQualityType,
    url: (id: string) => `http://example.com/video/${id}/240p.mp4`,
  },
  {
    quality: "Q480P" as VideoQualityType,
    url: (id: string) => `http://example.com/video/${id}/480p.mp4`,
  },
  {
    quality: "Q720P" as VideoQualityType,
    url: (id: string) => `http://example.com/video/${id}/720p.mp4`,
  },
  {
    quality: "Q1080P" as VideoQualityType,
    url: (id: string) => `http://example.com/video/${id}/1080p.mp4`,
  },
];

// Helper function to generate image URLs
const getImageUrl = (
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
  const text = type.includes("-")
    ? type.split("-")[0]
    : title?.replace(/ /g, "+");
  return text
    ? `${baseUrl}/${config.size}/${config.bgColor}/white?text=${text}`
    : `${baseUrl}/${config.size}/${config.bgColor}/white`;
};

// Helper function to get random items from an array
const getRandomItems = <T>(items: T[], count = 3): T[] => {
  return [...items].sort(() => 0.5 - Math.random()).slice(0, count);
};

// Generate random duration between 60 and 120 minutes
const getRandomDuration = (): number => Math.floor(Math.random() * 60) + 60;

// Generate random rating between 0 and 5
const getRating = (): number => {
  const whole = Math.floor(Math.random() * 6);
  const half = Math.random() < 0.5 ? 0.5 : 0;
  return Math.min(whole + half, 5);
};

// Get random PG rating
const getRandomPgRating = (): PgRating => {
  const values = Object.values(PgRating);
  return values[Math.floor(Math.random() * values.length)] as PgRating;
};

// Generate random release date between 2000 and 2025
const getReleaseDate = (): Date => {
  const randomYear = Math.floor(Math.random() * (2025 - 2000 + 1)) + 2000;
  return new Date(
    Date.UTC(
      randomYear,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    )
  );
};

// Improved logging function
const logResults = (
  singularType: string,
  totalCount: number,
  successes: number,
  errors: string[],
  isAnimation?: boolean,
  startTime?: number
): void => {
  const duration = startTime ? (performance.now() - startTime) / 1000 : 0;
  const pluralType =
    singularType === "Series"
      ? "Series"
      : successes !== 1
      ? `${singularType}s`
      : singularType;
  const animationPrefix = isAnimation ? "animated " : "";
  console.log(
    `✅ Created ${successes} ${animationPrefix}${pluralType} out of ${totalCount} in ${duration.toFixed(
      2
    )} seconds.`
  );
  if (errors.length > 0) {
    console.warn(`⚠️ ${errors.length} ${animationPrefix}${pluralType} failed:`);
    errors.forEach((error, i) =>
      console.warn(`  - ${singularType} ${i + 1}: ${error}`)
    );
  }
};

// Data Creation Functions
async function createGenres(): Promise<number> {
  const genresList = [
    { name: "Action", slug: "action" },
    { name: "Comedy", slug: "comedy" },
    { name: "Drama", slug: "drama" },
    { name: "Sci-Fi", slug: "sci-fi" },
    { name: "Horror", slug: "horror" },
    { name: "Animation", slug: "animation" },
  ];
  console.log("📋 Creating genres...");
  const startTime = performance.now();
  try {
    await prisma.genre.createMany({
      data: genresList,
      skipDuplicates: true,
    });
    logResults(
      "Genre",
      genresList.length,
      genresList.length,
      [],
      undefined,
      startTime
    );
    return genresList.length;
  } catch (error: any) {
    logResults(
      "Genre",
      genresList.length,
      0,
      [error.message],
      undefined,
      startTime
    );
    return 0;
  }
}

async function createCast(): Promise<number> {
  const castList = [
    "Emma Stone",
    "Ryan Gosling",
    "Chris Evans",
    "Scarlett Johansson",
    "Tom Hanks",
    "Zendaya",
    "Viola Davis",
    "Hugh Jackman",
  ];
  console.log("📋 Creating cast...");
  const startTime = performance.now();
  try {
    await prisma.cast.createMany({
      data: castList.map((name) => ({ name })),
      skipDuplicates: true,
    });
    logResults(
      "Cast",
      castList.length,
      castList.length,
      [],
      undefined,
      startTime
    );
    return castList.length;
  } catch (error: any) {
    logResults(
      "Cast",
      castList.length,
      0,
      [error.message],
      undefined,
      startTime
    );
    return 0;
  }
}

async function seedMovies(
  count: number,
  isAnimation: boolean,
  genres: Genre[],
  casts: Cast[]
): Promise<{ successes: number; failures: number }> {
  const errors: string[] = [];
  let successes = 0;
  const startTime = performance.now();
  console.log(
    `🎬 Seeding ${isAnimation ? "Animated " : ""}Movies (${count} planned)`
  );

  for (let i = 1; i <= count; i++) {
    try {
      const title = `Movie Title ${isAnimation ? "Anime " : ""}${i}`;
      await prisma.content.create({
        data: {
          title,
          description:
            "A thrilling adventure unfolds as a diverse group of unlikely heroes embarks on a high-stakes mission to save their world from an impending threat, uncovering hidden truths and forging unbreakable bonds along the way.",
          releaseDate: getReleaseDate(),
          director: `Director ${i}`,
          duration: getRandomDuration(),
          pgRating: getRandomPgRating(),
          type: ContentType.MOVIES,
          isAnimation,
          posterUrl: getImageUrl("poster", isAnimation, title),
          backdropUrl: getImageUrl("backdrop", isAnimation, title),
          cast: { connect: getRandomItems(casts).map((c) => ({ id: c.id })) },
          genres: {
            create: getRandomItems(genres).map((g) => ({
              genre: { connect: { slug: g.slug } },
            })),
          },
          movie: {
            create: {
              rating: getRating(),
              trailerUrl: "https://youtu.be/oFkbsEKaoSE?si=2GokxlB1Bd1nI2qm",
              videoQualities: {
                create: videoQualities.map((q) => ({
                  quality: q.quality,
                  url: q.url(title),
                })),
              },
            },
          },
        },
      });
      successes++;
      console.log(`✅ Created movie ${i}`);
    } catch (err: any) {
      errors.push(`Movie ${i}: ${err.message}`);
      console.error(`❌ Failed to create movie ${i}: ${err.message}`);
    }
  }

  logResults("Movie", count, successes, errors, isAnimation, startTime);
  return { successes, failures: errors.length };
}

async function seedSeries(
  count: number,
  isAnimation: boolean,
  genres: Genre[],
  casts: Cast[]
): Promise<{
  successes: number;
  failures: number;
  seasons: number;
  episodes: number;
}> {
  const errors: string[] = [];
  let successes = 0;
  let totalSeasons = 0;
  let totalEpisodes = 0;
  const seasonsPerSeries = 3;
  const episodesPerSeason = 3;
  const startTime = performance.now();
  console.log(
    `📺 Seeding ${
      isAnimation ? "Animated " : ""
    }Series (${count} planned, ${seasonsPerSeries} seasons each, ${episodesPerSeason} episodes per season)`
  );

  for (let i = 1; i <= count; i++) {
    try {
      const title = `Series Title ${isAnimation ? "Anime " : ""}${i}`;
      await prisma.content.create({
        data: {
          title,
          description:
            "A thrilling adventure unfolds as a diverse group of unlikely heroes embarks on a high-stakes mission to save their world from an impending threat, uncovering hidden truths and forging unbreakable bonds along the way.",
          releaseDate: getReleaseDate(),
          director: `Director ${i}`,
          duration: getRandomDuration(),
          pgRating: getRandomPgRating(),
          type: ContentType.SERIES,
          isAnimation,
          posterUrl: getImageUrl("poster", isAnimation, title),
          backdropUrl: getImageUrl("backdrop", isAnimation, title),
          cast: { connect: getRandomItems(casts).map((c) => ({ id: c.id })) },
          genres: {
            create: getRandomItems(genres).map((g) => ({
              genre: { connect: { slug: g.slug } },
            })),
          },
          series: {
            create: {
              seasons: {
                create: Array.from({ length: seasonsPerSeries }, (_, sIdx) => {
                  const seasonNumber = sIdx + 1;
                  totalSeasons++;
                  return {
                    number: seasonNumber,
                    title: `Season ${seasonNumber}`,
                    posterUrl: getImageUrl(
                      "season-poster",
                      isAnimation,
                      `Season ${seasonNumber}`
                    ),
                    episodes: {
                      create: Array.from(
                        { length: episodesPerSeason },
                        (_, eIdx) => {
                          const episodeNumber = eIdx + 1;
                          totalEpisodes++;
                          return {
                            number: episodeNumber,
                            title: `Episode ${episodeNumber}`,
                            description: `Episode ${episodeNumber} description`,
                            duration: getRandomDuration(),
                            rating: getRating(),
                            posterUrl: getImageUrl(
                              "episode-thumbnail",
                              isAnimation,
                              `Episode ${episodeNumber}`
                            ),
                            trailerUrl:
                              "https://youtu.be/oFkbsEKaoSE?si=2GokxlB1Bd1nI2qm",
                            videoQualities: {
                              create: videoQualities.map((q) => ({
                                quality: q.quality,
                                url: q.url(`Episode ${episodeNumber}`),
                              })),
                            },
                          };
                        }
                      ),
                    },
                  };
                }),
              },
            },
          },
        },
      });
      successes++;
      console.log(`✅ Created series ${i}`);
    } catch (err: any) {
      errors.push(`Series ${i}: ${err.message}`);
      console.error(`❌ Failed to create series ${i}: ${err.message}`);
    }
  }

  logResults("Series", count, successes, errors, isAnimation, startTime);
  return {
    successes,
    failures: errors.length,
    seasons: totalSeasons,
    episodes: totalEpisodes,
  };
}

async function main() {
  console.log("🚀 Seeding started");
  const start = performance.now();

  // Define planned counts
  const movieCount = 10;
  const animatedMovieCount = 10;
  const seriesCount = 10;
  const animatedSeriesCount = 6;
  const seasonsPerSeries = 3;
  const episodesPerSeason = 3;

  // Log planned totals
  console.log(`📊 Planned Seeding Totals:`);
  console.log(
    `  - Movies: ${movieCount} non-animated, ${animatedMovieCount} animated`
  );
  console.log(
    `  - Series: ${seriesCount} non-animated, ${animatedSeriesCount} animated`
  );
  console.log(
    `  - Seasons: ${
      (seriesCount + animatedSeriesCount) * seasonsPerSeries
    } total ` + `(${seasonsPerSeries} per series)`
  );
  console.log(
    `  - Episodes: ${
      (seriesCount + animatedSeriesCount) * seasonsPerSeries * episodesPerSeason
    } total ` + `(${episodesPerSeason} per season)`
  );

  try {
    // Create genres and cast
    const genresCreated = await createGenres();
    const castCreated = await createCast();

    if (!genresCreated || !castCreated) {
      throw new Error("Cannot proceed: Genres or cast creation failed.");
    }

    const genreRecords = await prisma.genre.findMany();
    const castRecords = await prisma.cast.findMany();

    // Seed movies and series in parallel
    const results = await Promise.allSettled([
      seedMovies(movieCount, false, genreRecords, castRecords),
      seedMovies(animatedMovieCount, true, genreRecords, castRecords),
      seedSeries(seriesCount, false, genreRecords, castRecords),
      seedSeries(animatedSeriesCount, true, genreRecords, castRecords),
    ]);

    // Summarize results
    const summary = {
      movies: { successes: 0, failures: 0 },
      animatedMovies: { successes: 0, failures: 0 },
      series: { successes: 0, failures: 0 },
      animatedSeries: { successes: 0, failures: 0 },
      seasons: 0,
      episodes: 0,
    };

    results.forEach((result, idx) => {
      if (result.status === "fulfilled") {
        if (idx === 0) {
          summary.movies = result.value as {
            successes: number;
            failures: number;
          };
        } else if (idx === 1) {
          summary.animatedMovies = result.value as {
            successes: number;
            failures: number;
          };
        } else if (idx === 2) {
          const seriesResult = result.value as {
            successes: number;
            failures: number;
            seasons: number;
            episodes: number;
          };
          summary.series = {
            successes: seriesResult.successes,
            failures: seriesResult.failures,
          };
          summary.seasons += seriesResult.seasons;
          summary.episodes += seriesResult.episodes;
        } else if (idx === 3) {
          const seriesResult = result.value as {
            successes: number;
            failures: number;
            seasons: number;
            episodes: number;
          };
          summary.animatedSeries = {
            successes: seriesResult.successes,
            failures: seriesResult.failures,
          };
          summary.seasons += seriesResult.seasons;
          summary.episodes += seriesResult.episodes;
        }
        console.log(`✅ Task ${idx + 1} completed`);
      } else {
        console.error(`❌ Task ${idx + 1} failed:`, result.reason);
      }
    });

    // Log final summary
    console.log(`📊 Final Seeding Summary:`);
    console.log(
      `  - Movies: ${summary.movies.successes} created, ${summary.movies.failures} failed`
    );
    console.log(
      `  - Animated Movies: ${summary.animatedMovies.successes} created, ${summary.animatedMovies.failures} failed`
    );
    console.log(
      `  - Series: ${summary.series.successes} created, ${summary.series.failures} failed`
    );
    console.log(
      `  - Animated Series: ${summary.animatedSeries.successes} created, ${summary.animatedSeries.failures} failed`
    );
    console.log(`  - Seasons: ${summary.seasons} created`);
    console.log(`  - Episodes: ${summary.episodes} created`);
  } catch (error: any) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("🔌 Disconnected.");
    console.log(
      `✅ completed ${((performance.now() - start) / 1000).toFixed(2)}s`
    );
  }
}

main();
