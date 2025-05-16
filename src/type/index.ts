import { CONTENT_CATEGORIES } from "@/constants";
import { Cast, Content, GenreContent, Movie, Series } from "@prisma/client";

export type SortOrder = "asc" | "desc";
export type ContentTab = (typeof CONTENT_CATEGORIES)[number]["id"];

export type ContentWithRelation = Content & {
  movie?: Pick<Movie, "rating" | "trailerUrl"> | null;
  series?:
    | (Pick<Series, "id"> & { seasons: { id: string; number: number }[] })
    | null;
  genres: (Pick<GenreContent, "genreId"> & {
    genre: { name: string; slug: string };
  })[];
  cast: Pick<Cast, "name">[];
};

export type ContentTabResult = {
  items: ContentWithRelation[];
  totalItems: number;
};
