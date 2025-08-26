import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BirdEventInventory } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Token management utilities
export const tokenStorage = {
  set: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem('accessToken', token);
    }
  },
  get: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('accessToken');
    }
    return null;
  },
  remove: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('accessToken');
    }
  }
};

export function mapBirdEventInventoryToFormDefaults(data: BirdEventInventory) {
  return {
    breederName: data.bird.breeder.name ?? "",
    band_1: data.band_1 ?? "",
    band_2: data.band_2 ?? "",
    band_3: data.band_3 ?? "",
    band_4: data.band_4 ?? "",
    color: data.bird.color ?? "",
    sex: data.bird.sex ?? "N/A",
    birdName: data.bird.birdName ?? "",
    note: data.note ?? "",
    arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : null,
    departureDate: data.departureDate ? new Date(data.departureDate) : null,
  };
}
