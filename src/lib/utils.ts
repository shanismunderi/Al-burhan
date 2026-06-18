import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDisplayName(displayName: string | null | undefined, username?: string | null): string {
  if (!displayName) return username || "";
  const trimmed = displayName.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object") {
        const teamName = parsed.teamName || parsed.name || parsed.display_name || "";
        const college = parsed.college || "";
        if (teamName && college) {
          return `${teamName} (${college})`;
        }
        return teamName || displayName;
      }
    } catch (e) {
      // ignore
    }
  }
  return displayName;
}

