"use server";

import { revalidatePath } from "next/cache";
import {
  createContent,
  updateContent,
  deleteContent,
  getContentStats,
} from "@/lib/db";
import { contentSchema } from "@/types/content";
import { ContentType } from "@prisma/client";

interface ContentErrors {
  title?: string[];
  description?: string[];
  type?: string[];
  posterUrl?: string[];
  rating?: string[];
  genres?: string[];
  isAnimation?: string[];
  releaseDate?: string[];
  duration?: string[];
  userId?: string[];
}

interface UpdateContent {
  error?: string;
  success?: string;
  errors?: ContentErrors;
}

interface AddContent {
  error?: string;
  success?: string;
  errors?: ContentErrors;
}

type FormState = UpdateContent | undefined;
type FormState2 = AddContent | undefined;

export async function getStats() {
  try {
    const stats = await getContentStats();
    return { stats, error: null };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return { stats: null, error: "Failed to fetch statistics" };
  }
}

export async function addContent(
  state: FormState2,
  formData: FormData
): Promise<FormState2> {
  const genresString = formData.get("genres") as string;
  const genres = genresString
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
  // Validate form data
  const validatedFields = contentSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    posterUrl:
      formData.get("posterUrl") ||
      "https://placehold.co/500x750/red/white?text=Placeholder",
    rating: formData.get("rating") || "4.5",
    genres: genres,
    isAnimation: formData.get("isAnimation"),
    releaseDate: formData.get("releaseDate"),
    duration: parseInt(formData.get("duration") as string, 10),
    backdropUrl: formData.get("backdropUrl"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const {
    title,
    description,
    type,
    posterUrl,
    rating,
    isAnimation = false,
    releaseDate,
    duration,
  } = validatedFields.data;

  // Create content
  await createContent({
    title,
    description,
    type: type as unknown as ContentType,
    posterUrl,
    rating: parseFloat(rating),
    isAnimation: isAnimation,
    backdropUrl: "",
    releaseDate: releaseDate,
    duration: duration,
  });

  revalidatePath("/admin");
  return { success: "Content added successfully" };
}

export async function updateContentItem(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // Parse genres from comma-separated string
  const genresString = formData.get("genres") as string;
  const genres = genresString
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
  // Validate form data

  const validatedFields = contentSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    posterUrl:
      formData.get("posterUrl") ||
      "https://placehold.co/500x750/red/white?text=Placeholder",
    rating: formData.get("rating") || "4.5",
    genres: genres,
    isAnimation: formData.get("isAnimation"),
    releaseDate: formData.get("releaseDate"),
    duration: parseInt(formData.get("duration") as string, 10),
    backdropUrl: formData.get("backdropUrl"),
    userId: formData.get("userId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Update content
  await updateContent(validatedFields.data.userId, {
    ...validatedFields.data,
    type: validatedFields.data.type as unknown as ContentType,
    rating: parseFloat(validatedFields.data.rating),
  });

  revalidatePath("/admin");
  return {
    success: "Content updated successfully",
  };
}

export async function deleteContentItem(id: string) {
  const result = await deleteContent(id);

  if (!result) {
    return { error: "Content not found" };
  }

  revalidatePath("/admin");
  return { success: "Content deleted successfully" };
}
