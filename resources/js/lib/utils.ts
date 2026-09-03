import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const VIETNAMESE_D_MAP: Record<string, string> = { đ: 'd', Đ: 'D' };

/** Slugifies a title (Vietnamese-aware: strips diacritics, "đ" -> "d"). */
export function slugify(value: string): string {
  return value
    .replace(/[đĐ]/g, (c) => VIETNAMESE_D_MAP[c])
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
