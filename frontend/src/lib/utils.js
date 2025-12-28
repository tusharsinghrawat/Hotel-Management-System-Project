import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind + conditional className helper
 * Usage:
 * cn("p-4", isActive && "bg-red-500")
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
