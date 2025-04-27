import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getIconByName(iconName: string): LucideIcon {
  const icon = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon;
  return icon || (LucideIcons.HelpCircle as LucideIcon);
}

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
