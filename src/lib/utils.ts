import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";


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

