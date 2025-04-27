"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { createContent, updateContent, deleteContent, type ContentType, getContentStats } from "@/lib/db"

// Schema for content creation/update
export const contentSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  type: z.enum(["MOVIE", "SERIES", "ANIMATION"], {
    message: "Type must be one of: MOVIE, SERIES, ANIMATION",
  }),
  posterUrl: z
    .string()
    .url({ message: "Poster URL must be a valid URL" })
    .or(z.string().startsWith("/", { message: "Poster URL must be a valid URL or path" })),
  year: z.string().regex(/^\d{4}$/, { message: "Year must be a 4-digit number" }),
  rating: z.string(),
  genres: z.array(z.string()).min(1, { message: "At least one genre is required" }),
})

export async function getStats() {
  try {
    const stats = await getContentStats()
    return { stats, error: null }
  } catch (error) {
    return { stats: null, error: "Failed to fetch statistics" }
  }
}

export async function addContent(prevState: any, formData: FormData) {
  try {
    // Parse genres from comma-separated string
    const genresString = formData.get("genres") as string
    const genres = genresString
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean)

    // Validate form data
    const validatedFields = contentSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      type: formData.get("type"),
      posterUrl:
        formData.get("posterUrl") ||
        `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(formData.get("title") as string)}`,
      year: formData.get("year"),
      rating: formData.get("rating") || "★★★☆☆",
      genres,
    })

    // Create content
    await createContent({
      ...validatedFields,
      type: validatedFields.type as unknown as ContentType,
    })

    revalidatePath("/admin")
    return { success: "Content added successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Something went wrong. Please try again." }
  }
}

export async function updateContentItem(id: string, prevState: any, formData: FormData) {
  try {
    // Parse genres from comma-separated string
    const genresString = formData.get("genres") as string
    const genres = genresString
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean)

    // Validate form data
    const validatedFields = contentSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      type: formData.get("type"),
      posterUrl:
        formData.get("posterUrl") ||
        `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(formData.get("title") as string)}`,
      year: formData.get("year"),
      rating: formData.get("rating") || "★★★☆☆",
      genres,
    })

    // Update content
    await updateContent(id, {
      ...validatedFields,
      type: validatedFields.type as unknown as ContentType,
    })

    revalidatePath("/admin")
    return { success: "Content updated successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Something went wrong. Please try again." }
  }
}

export async function deleteContentItem(id: string) {
  try {
    const result = await deleteContent(id)

    if (!result) {
      return { error: "Content not found" }
    }

    revalidatePath("/admin")
    return { success: "Content deleted successfully" }
  } catch (error) {
    return { error: "Failed to delete content" }
  }
}
