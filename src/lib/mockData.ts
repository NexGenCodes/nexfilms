import { CONTENT_TYPES } from "@/constants";
import { randomBytes } from "crypto";

export interface Content {
  id: string;
  title: string;
  type: string;
  isAnimation: boolean;
  posterUrl: string;
  backdropUrl?: string;
  year: string;
  releaseDate?: string;
  rating: string;
  genres: string[];
  description: string;
  duration?: number; // in minutes (for movies)
  createdAt: string;
  updatedAt: string;
}

export interface Series extends Content {
  seasons: Season[];
}

export interface Season {
  id: string;
  seasonNumber: number;
  title: string;
  posterUrl: string;
  overview?: string;
  releaseDate?: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  duration: number; // in minutes
  thumbnailUrl: string;
  videoUrl?: string;
  releaseDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  contentId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Watchlist {
  id: string;
  userId: string;
  contentId: string;
  addedAt: string;
}

const generateId = () => {
  return randomBytes(8).toString("hex");
};

// Static list of content
export const allContent: (Content | Series)[] = [
  {
    id: generateId(),
    title: "Inception",
    type: CONTENT_TYPES.MOVIE,
    isAnimation: false,
    posterUrl:
      "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    year: "2010",
    releaseDate: "2010-07-16",
    rating: "8.8",
    genres: ["Action", "Sci-Fi", "Thriller"],
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    duration: 148,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: generateId(),
    title: "Toy Story",
    type: CONTENT_TYPES.MOVIE,
    isAnimation: true,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/dji4Fm0gCDVb9DQQMRvAI8YNnTz.jpg",
    year: "1995",
    releaseDate: "1995-11-22",
    rating: "8.3",
    genres: ["Animation", "Adventure", "Comedy"],
    description:
      "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
    duration: 81,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: generateId(),
    title: "Breaking Bad",
    type: CONTENT_TYPES.SERIES,
    isAnimation: false,
    posterUrl: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/bzoZjhbpriBT2N5kwgK0weUfVOX.jpg",
    year: "2008",
    releaseDate: "2008-01-20",
    rating: "9.5",
    genres: ["Crime", "Drama", "Thriller"],
    description:
      "A high school chemistry teacher turned methamphetamine producer navigates the dangers of the drug trade.",
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    seasons: [
      {
        id: generateId(),
        seasonNumber: 1,
        title: "Season 1",
        posterUrl:
          "https://image.tmdb.org/t/p/w500/1yeVJox3rjo2jBKrrihIMj7uoS9.jpg",
        overview: "Walter White's transformation begins.",
        releaseDate: "2008-01-20",
        episodes: [
          {
            id: generateId(),
            episodeNumber: 1,
            title: "Pilot",
            description:
              "Walter White, a high school chemistry teacher, learns he has terminal lung cancer.",
            duration: 58,
            thumbnailUrl:
              "https://image.tmdb.org/t/p/w500/1yeVJox3rjo2jBKrrihIMj7uoS9.jpg",
            videoUrl: "https://example.com/video.mp4",
            releaseDate: "2008-01-20",
          },
        ],
      },
    ],
  },
  {
    id: generateId(),
    title: "Avatar: The Last Airbender",
    type: CONTENT_TYPES.SERIES,
    isAnimation: true,
    posterUrl:
      "https://image.tmdb.org/t/p/w1280/5DUMPBSnHOZsbBv81GFXZXvDpo6.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/5DUMPBSnHOZsbBv81GFXZXvDpo6.jpg",
    year: "2005",
    releaseDate: "2005-02-21",
    rating: "9.3",
    genres: ["Animation", "Action", "Adventure"],
    description:
      "In a war-torn world of elemental magic, a young boy reawakens to undertake a dangerous mystic quest.",
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    seasons: [
      {
        id: generateId(),
        seasonNumber: 1,
        title: "Book One: Water",
        posterUrl:
          "https://image.tmdb.org/t/p/w500/1yeVJox3rjo2jBKrrihIMj7uoS9.jpg",
        overview: "Aang begins his journey to master the elements.",
        releaseDate: "2005-02-21",
        episodes: [
          {
            id: generateId(),
            episodeNumber: 1,
            title: "The Boy in the Iceberg",
            description:
              "Two siblings discover a boy frozen in an iceberg who turns out to be the Avatar.",
            duration: 23,
            thumbnailUrl:
              "https://image.tmdb.org/t/p/w500/1yeVJox3rjo2jBKrrihIMj7uoS9.jpg",
            videoUrl: "https://example.com/video.mp4",
            releaseDate: "2005-02-21",
          },
        ],
      },
    ],
  },
  {
    id: generateId(),
    title: "Frozen",
    type: CONTENT_TYPES.MOVIE,
    isAnimation: true,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/xjotE7aFDtQnUqfOPs8bLwH8Rrb.jpg",
    year: "2013",
    releaseDate: "2013-11-27",
    rating: "7.4",
    genres: ["Animation", "Adventure", "Comedy"],
    description:
      "When the newly crowned Queen Elsa accidentally uses her power to turn things into ice, her sister Anna teams up with a mountain man to change the weather condition.",
    duration: 102,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: generateId(),
    title: "The Dark Knight",
    type: CONTENT_TYPES.MOVIE,
    isAnimation: false,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
    year: "2008",
    releaseDate: "2008-07-18",
    rating: "9.0",
    genres: ["Action", "Crime", "Drama"],
    description:
      "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
    duration: 152,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: generateId(),
    title: "Stranger Things",
    type: CONTENT_TYPES.SERIES,
    isAnimation: false,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    year: "2016",
    releaseDate: "2016-07-15",
    rating: "8.7",
    genres: ["Drama", "Fantasy", "Horror"],
    description:
      "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces to get him back.",
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    seasons: [
      {
        id: generateId(),
        seasonNumber: 1,
        title: "Season 1",
        posterUrl:
          "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
        overview: "The story begins with the disappearance of Will Byers.",
        releaseDate: "2016-07-15",
        episodes: [
          {
            id: generateId(),
            episodeNumber: 1,
            title: "The Vanishing of Will Byers",
            description:
              "A young boy vanishes, and a small town uncovers a mystery involving secret experiments.",
            duration: 47,
            thumbnailUrl:
              "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
            videoUrl: "https://example.com/video.mp4",
            releaseDate: "2016-07-15",
          },
        ],
      },
    ],
  },
];

// Utility functions
export const getTrendingContent = (count = 20): Content[] => {
  return [...allContent, ...allContent, ...allContent]
    .sort(() => 0.5 - Math.random())
    .slice(0, count) as Content[];
};

export const getNewReleases = (count = 20): Content[] => {
  return [...allContent, ...allContent, ...allContent]
    .sort((a, b) => Number.parseInt(b.year) - Number.parseInt(a.year))
    .slice(0, count) as Content[];
};

export const getRecommendedContent = (count = 20): Content[] => {
  return [...allContent, ...allContent, ...allContent]
    .sort(() => 0.5 - Math.random())
    .slice(0, count) as Content[];
};

export const getSeriesById = async (id: string): Promise<Series | null> => {
  return allContent.find(
    (content) => content.id === id && content.type === CONTENT_TYPES.SERIES
  ) as Series | null;
};

export const getMovieById = async (id: string): Promise<Content | null> => {
  return allContent.find(
    (content) => content.id === id && content.type === CONTENT_TYPES.MOVIE
  ) as Content | null;
};

export const getSeasonById = async (id: string, seasonId: string) => {
  const series = await getSeriesById(id);
  if (!series) return null;
  return series.seasons.find((season) => season.id === seasonId) || null;
};

export const getEpisodeById = async (
  id: string,
  seasonId: string,
  episodeId: string
) => {
  const series = allContent.find(
    (content) => content.id === id && content.type === CONTENT_TYPES.SERIES
  ) as Series | undefined;
  if (!series) return null;
  const season = series.seasons.find((season) => season.id === seasonId);
  if (!season) return null;
  return season.episodes.find((episode) => episode.id === episodeId) || null;
};
