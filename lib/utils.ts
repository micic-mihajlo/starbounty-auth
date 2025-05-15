import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: any, start = 6, end = 6): string {
  if (typeof address !== 'string' || !address) {
    return "Invalid Address"; // Or return "", or handle as appropriate
  }
  if (address.length <= start + end) {
    return address;
  }
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
