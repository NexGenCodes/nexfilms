import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { compare, hash } from "bcryptjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getIconByName(iconName: string): LucideIcon {
  const icon = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon;
  return icon || (LucideIcons.HelpCircle as LucideIcon);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    if (immediate && timeoutId === null) {
      func(...args);
      timeoutId = setTimeout(() => {
        timeoutId = null;
      }, wait);
      return;
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
}

export function HashPassword(password: string) {
  return hash(password, 12);
}

export function ComparePasswords(
  plainPassword: string,
  hashedPassword: string
) {
  return compare(plainPassword, hashedPassword);
}

export function generateStarFromRating(rating: number): string {
  // Validate input
  if (rating < 0 || rating > 5) {
    throw new Error("Rating must be between 0 and 5");
  }
  // Round to nearest 0.5 (e.g., 4, 4.5, 5)
  const normalizedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 === 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return (
    "★".repeat(fullStars) + (hasHalfStar ? "½" : "") + "☆".repeat(emptyStars)
  );
}
