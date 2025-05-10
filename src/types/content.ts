import { z } from "zod";

// Schema for content creation/update
export const contentSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  type: z.enum(["MOVIES", "SERIES"], {
    message: "Type must be one of: MOVIE, SERIES, ANIMATION",
  }),
  posterUrl: z
    .string()
    .url({ message: "Poster URL must be a valid URL" })
    .or(
      z
        .string()
        .startsWith("/", { message: "Poster URL must be a valid URL or path" })
    ),
  rating: z.string(),
  genres: z
    .array(z.string())
    .min(1, { message: "At least one genre is required" }),

  releaseDate: z.string(),
  duration: z.number(),
  isAnimation: z.boolean().optional().default(false),
  userId: z.string(),
});
