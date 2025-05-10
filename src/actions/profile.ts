"use server";

import { AppError } from "@/lib/appError";
import {
  addToWatchlist,
  getUserById,
  getUserWatchlist,
  removeFromWatchlist,
} from "@/lib/db";

export async function getUserProfile(userId: string) {
  if (!userId) throw new AppError("User ID is required", 400);
  try {
    return await getUserById(userId);
  } catch (error) {
    throw new AppError(`${error}`, 400);
  }
}

export async function getWatchLists(userId: string) {
  if (!userId) throw new AppError("User ID is required", 400);
  try {
    return await getUserWatchlist(userId);
  } catch (error) {
    throw new AppError(`${error}`, 400);
  }
}

export async function addToWatchList(userId: string, movieId: string) {
  if (!userId) throw new AppError("User ID is required", 400);
  if (!movieId) throw new AppError("Movie ID is required", 400);
  try {
    return await addToWatchlist(userId, movieId);
  } catch (error) {
    throw new AppError(`${error}`, 400);
  }
}

export async function removeFromWatchList(userId: string, movieId: string) {
  if (!userId) throw new AppError("User ID is required", 400);
  if (!movieId) throw new AppError("Movie ID is required", 400);
  try {
    return await removeFromWatchlist(userId, movieId);
  } catch (error) {
    throw new AppError(`${error}`, 400);
  }
}
