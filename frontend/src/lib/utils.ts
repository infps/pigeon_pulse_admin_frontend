import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BirdEventInventory } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function mapBirdEventInventoryToFormDefaults(data: BirdEventInventory) {
  return {
    breederName: data.bird.breeder.name ?? "",
    band_1: data.bird.band_1 ?? "",
    band_2: data.bird.band_2 ?? "",
    band_3: data.bird.band_3 ?? "",
    band_4: data.bird.band_4 ?? "",
    color: data.bird.color ?? "",
    sex: data.bird.sex ?? "N/A",
    birdName: data.bird.birdName ?? "",
    note: data.bird.note ?? "",
    arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : null,
    departureDate: data.departureDate ? new Date(data.departureDate) : null,
  };
}
