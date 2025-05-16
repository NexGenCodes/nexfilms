/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, ContentType, PgRating, VideoQualityType, Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

const config = {
  genres: [
    { name: 'Action', slug: 'action' },
    { name: 'Comedy', slug: 'comedy' },
    { name: 'Drama', slug: 'drama' },
    { name: 'Sci-Fi', slug: 'sci-fi' },
    { name: 'Horror', slug: 'horror' },
    { name: 'Animation', slug: 'animation' },
  ],
  cast: ['Emma Stone', 'Ryan Gosling', 'Chris Evans', 'Scarlett Johansson', 'Tom Hanks', 'Zendaya', 'Viola Davis', 'Hugh Jackman'],
  titles: ['Starlight Odyssey', 'Moonlit Shadows', 'City of Dreams', 'Neon Horizon', 'Skyward Bound', 'Crimson Tide', 'Golden Dawn', 'Frozen Empire', 'Lost Legends', 'Eternal Flame'],
  directors: ['Steven Spielberg', 'Greta Gerwig', 'Christopher Nolan', 'Ava DuVernay', 'James Cameron'],
  descriptions: ['A thrilling adventure.', 'A heartwarming tale.', 'An epic saga.', 'A gripping drama.', 'A comedic journey.'],
  pgRatings: ['G', 'PG', 'PG_13', 'R', 'TV_Y', 'TV_G', 'TV_PG', 'TV_14'] as PgRating[],
  videoQualities: [
    { quality: 'Q240P' as VideoQualityType, url: (id: string) => `http://example.com/video/${id}/240p.mp4` },
    { quality: 'Q480P' as VideoQualityType, url: (id: string) => `http://example.com/video/${id}/480p.mp4` },
    { quality: 'Q720P' as VideoQualityType, url: (id: string) => `http://example.com/video/${id}/720p.mp4` },
    { quality: 'Q1080P' as VideoQualityType, url: (id: string) => `http://example.com/video/${id}/1080p.mp4` },
  ],
  counts: {
    movies: 10,
    animatedMovies: 10,
    series: 10,
    animatedSeries: 10,
    episodesPerSeason: 3,
    seasonsPerSeries: 1,
    maxCastPerContent: 3,
    maxGenresPerContent: 3,
  },
  batchSize: 4, // Increased to 4 for concurrency
};

// Utility Functions
const generateId = () => nanoid();

const getImageUrl = (type: 'poster' | 'backdrop' | 'season-poster' | 'episode-thumbnail', isAnimation: boolean, title?: string) => {
  const baseUrl = 'https://placehold.co';
  const config = {
    poster: { size: '500x750', bgColor: isAnimation ? 'blue' : 'gray' },
    backdrop: { size: '1280x720', bgColor: isAnimation ? 'blue' : 'gray' },
    'season-poster': { size: '500x750', bgColor: isAnimation ? 'green' : 'black' },
    'episode-thumbnail': { size: '1280x720', bgColor: isAnimation ? 'purple' : 'black' },
  }[type];
  const text = type.includes('-') ? type.split('-')[0] : title?.replace(/ /g, '+');
  return text ? `${baseUrl}/${config.size}/${config.bgColor}/white?text=${text}` : `${baseUrl}/${config.size}/${config.bgColor}/white`;
};

const getRating = () => Math.min(Math.floor(Math.random() * 6) + (Math.random() < 0.5 ? 0.5 : 0), 5);

const getReleaseDate = () => {
  const randomYear = Math.floor(Math.random() * (2025 - 2000 + 1)) + 2000;
  return new Date(Date.UTC(randomYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1));
};

const logResults = (type: string, count: number, errors: string[], isAnimation?: boolean, startTime?: number) => {
  const successCount = count - errors.length;
  const duration = startTime ? (performance.now() - startTime) / 1000 : 0;
  console.log(`✅ Created ${successCount} ${isAnimation !== undefined ? (isAnimation ? 'animated ' : '') : ''}${type.toLowerCase()} in ${duration.toFixed(2)} seconds.`);
  if (errors.length > 0) {
    console.warn(`⚠️ ${errors.length} ${type.toLowerCase()} creation(s) failed:`);
    errors.forEach((error, i) => console.warn(`  - ${type} ${i + 1}: ${error}`));
  }
  return successCount;
};

// Batch Processing Utility
async function processBatch<T>(items: T[], fn: (item: T, index: number) => Promise<void>, batchSize: number) {
  const errors: string[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (item, index) => {
        try {
          await fn(item, i + index);
        } catch (error: any) {
          const message = error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
            ? `Unique constraint failed: ${error.meta?.target}`
            : error.message;
          errors.push(message);
        }
      })
    );
    await results;
  }
  return errors;
}

// Data Creation Functions
async function createGenres() {
  console.log('📋 Creating genres...');
  const startTime = performance.now();
  try {
    await prisma.genre.createMany({ data: config.genres, skipDuplicates: true });
    return logResults('Genres', config.genres.length, [], undefined, startTime);
  } catch (error: any) {
    return logResults('Genres', config.genres.length, [error.message], undefined, startTime);
  }
}

async function createCast() {
  console.log('📋 Creating cast...');
  const startTime = performance.now();
  try {
    await prisma.cast.createMany({ data: config.cast.map((name) => ({ name })), skipDuplicates: true });
    return logResults('Cast', config.cast.length, [], undefined, startTime);
  } catch (error: any) {
    return logResults('Cast', config.cast.length, [error.message], undefined, startTime);
  }
}

async function createContent(
  type: ContentType,
  isAnimation: boolean,
  index: number,
  genres: { id: string; slug: string }[],
  cast: { id: string }[]
) {
  const id = generateId();
  const title = `${config.titles[index % config.titles.length]} ${isAnimation ? '(Animated)' : ''}`;
  const selectedGenres = new Set<string>();
  const contentGenres = [
    Math.random() < 0.5 ? genres[0] : genres[1],
    genres[Math.floor(Math.random() * 4) + 2],
    ...(isAnimation ? [genres.find((g) => g.slug === 'animation')!] : []),
  ].filter((genre) => {
    if (selectedGenres.has(genre.id)) return false;
    selectedGenres.add(genre.id);
    return true;
  }).slice(0, config.counts.maxGenresPerContent);

  const contentCast = cast.slice(0, Math.min(config.counts.maxCastPerContent, cast.length));

  const contentData = {
    id,
    title,
    description: config.descriptions[Math.floor(Math.random() * config.descriptions.length)],
    releaseDate: getReleaseDate(),
    director: config.directors[Math.floor(Math.random() * config.directors.length)],
    duration: type === 'MOVIES' ? Math.floor(Math.random() * (180 - 60 + 1)) + 60 : Math.floor(Math.random() * (60 - 20 + 1)) + 20,
    pgRating: config.pgRatings[Math.floor(Math.random() * config.pgRatings.length)],
    posterUrl: getImageUrl('poster', isAnimation, title),
    backdropUrl: getImageUrl('backdrop', isAnimation, title),
    type,
    isAnimation,
    genres: { create: contentGenres.map((genre) => ({ genreId: genre.id })) }, // Batch GenreContent
    cast: { connect: contentCast.map((c) => ({ id: c.id })) },
  };

  const content = await prisma.content.create({ data: contentData });

  if (type === 'MOVIES') {
    const videoQualitiesData = config.videoQualities.map((vq) => ({
      id: generateId(),
      movieId: content.id,
      quality: vq.quality,
      url: vq.url(id),
    }));
    await prisma.videoQuality.createMany({ data: videoQualitiesData }); // Batch VideoQuality
    await prisma.movie.create({
      data: {
        id: content.id,
        rating: getRating(),
        trailerUrl: `http://example.com/trailer/${id}.mp4`,
      },
    });
  } else {
    const seasonsData = Array.from({ length: config.counts.seasonsPerSeries }, (_, sIndex) => ({
      id: generateId(),
      seriesId: content.id,
      number: sIndex + 1,
      title: `Season ${sIndex + 1}`,
      posterUrl: getImageUrl('season-poster', isAnimation),
      episodes: {
        createMany: {
          data: Array.from({ length: config.counts.episodesPerSeason }, (_, epIndex) => ({
            id: generateId(),
            number: epIndex + 1,
            title: `Episode ${epIndex + 1}`,
            description: config.descriptions[Math.floor(Math.random() * config.descriptions.length)],
            duration: Math.floor(Math.random() * (60 - 20 + 1)) + 20,
            posterUrl: getImageUrl('episode-thumbnail', isAnimation),
            rating: getRating(),
            trailerUrl: `http://example.com/trailer/${id}-${epIndex}.mp4`,
          })),
        },
      },
    }));

    await prisma.series.create({
      data: {
        id: content.id,
        seasons: { create: seasonsData },
      },
    });

    // Batch VideoQuality for episodes
    const episodeIds = await prisma.episode.findMany({
      where: { season: { seriesId: content.id } },
      select: { id: true },
    });
    const videoQualitiesData = episodeIds.flatMap((ep) =>
      config.videoQualities.map((vq) => ({
        id: generateId(),
        episodeId: ep.id,
        quality: vq.quality,
        url: vq.url(`${id}-${ep.id}`),
      }))
    );
    await prisma.videoQuality.createMany({ data: videoQualitiesData });
  }
}

async function createMovies(count: number, isAnimation: boolean, genres: { id: string; slug: string }[], cast: { id: string }[]) {
  console.log(`📽️ Creating ${count} ${isAnimation ? 'animated ' : ''}movies...`);
  const startTime = performance.now();
  const items = Array.from({ length: count }, (_, i) => i);
  const errors = await processBatch(
    items,
    async (index) => await createContent('MOVIES', isAnimation, index, genres, cast),
    config.batchSize
  );
  return logResults('Movies', count, errors, isAnimation, startTime);
}

async function createSeries(count: number, isAnimation: boolean, genres: { id: string; slug: string }[], cast: { id: string }[]) {
  console.log(`📺 Creating ${count} ${isAnimation ? 'animated ' : ''}series...`);
  const startTime = performance.now();
  const items = Array.from({ length: count }, (_, i) => i);
  const errors = await processBatch(
    items,
    async (index) => await createContent('SERIES', isAnimation, index, genres, cast),
    config.batchSize
  );
  return logResults('Series', count, errors, isAnimation, startTime);
}

async function main() {
  console.log('🚀 Seeding started at', new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
  const startTime = performance.now();

  try {
    // Optimize database for seeding
    console.log('🧹 Clearing existing data...');
    await prisma.$executeRaw`TRUNCATE TABLE "Content", "Movie", "Series", "Season", "Episode", "VideoQuality", "Genre", "Cast", "GenreContent" RESTART IDENTITY CASCADE;`;

    // Temporarily disable indexes to speed up writes
    await prisma.$executeRaw`ALTER TABLE "VideoQuality" DROP CONSTRAINT "unique_episode_quality", DROP CONSTRAINT "unique_movie_quality";`;

    const genresCreated = await createGenres();
    const castCreated = await createCast();

    if (!genresCreated || !castCreated) throw new Error('Cannot proceed: Genres or cast creation failed.');

    const genreRecords = await prisma.genre.findMany();
    const castRecords = await prisma.cast.findMany();

    let totalCreated = 0;
    totalCreated += await createMovies(config.counts.movies, false, genreRecords, castRecords);
    totalCreated += await createMovies(config.counts.animatedMovies, true, genreRecords, castRecords);
    totalCreated += await createSeries(config.counts.series, false, genreRecords, castRecords);
    totalCreated += await createSeries(config.counts.animatedSeries, true, genreRecords, castRecords);

    // Re-enable indexes
    await prisma.$executeRaw`ALTER TABLE "VideoQuality" ADD CONSTRAINT "unique_episode_quality" UNIQUE ("episodeId", "quality"), ADD CONSTRAINT "unique_movie_quality" UNIQUE ("movieId", "quality");`;

    const endTime = performance.now();
    console.log(`🎉 Seeding completed with ${totalCreated}/40 items in ${(endTime - startTime) / 1000} seconds!`);
    if (totalCreated < 40) console.warn(`⚠️ Some items failed. Check warnings for details.`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected.');
  }
}

main();