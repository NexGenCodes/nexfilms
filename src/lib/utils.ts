import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { compare, hash } from "bcryptjs";
import { OTP_LENGTH } from "@/constants";
import { AppError } from "./appError";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getIconByName(iconName: string): LucideIcon {
  return (LucideIcons[iconName as keyof typeof LucideIcons] ||
    LucideIcons.HelpCircle) as LucideIcon;
}

export function debounce(func: () => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

export function hashPassword(password: string) {
  if (!password) {
    throw new AppError("Password is required", 400);
  }
  return hash(password, 12);
}

export function comparePasswords(
  plainPassword: string,
  hashedPassword: string
) {
  if (!plainPassword || !hashedPassword) {
    throw new AppError("Both plain and hashed passwords are required", 400);
  }
  return compare(plainPassword, hashedPassword);
}

export function generateStarFromRating(rating: number) {
  if (rating < 0 || rating > 5) {
    throw new AppError("Rating must be between 0 and 5", 400);
  }

  const normalizedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 === 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    "★".repeat(fullStars) + (hasHalfStar ? "½" : "") + "☆".repeat(emptyStars)
  );
}

export function generateOtp(digits: number = OTP_LENGTH) {
  if (digits <= 0) {
    throw new AppError("OTP length must be greater than 0", 400);
  }
  try {
    const min = 10 ** (digits - 1);
    const max = 10 ** digits - 1;

    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  } catch (error) {
    console.error("otp failed:", error);
    return null;
  }
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 1000
) {
  if (!url) {
    throw new AppError("URL is required for fetchWithRetry", 400);
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new AppError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }
      return response;
    } catch (error) {
      if (attempt === retries - 1) {
        throw new AppError(
          `Failed to fetch after ${retries} attempts: ${
            (error as Error).message
          }`,
          500
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export function getInitials(name?: string) {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U";
}
