import { VEHICLES } from "../resources/data.js";
import { Vehicle } from "../types/vehicle.js";

export interface FilterVehiclesArgs {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  features?: string[];
  seats?: number;
  transmission?: "AUTO" | "MANUAL";
  fuelType?: "PETROL" | "DIESEL" | "HYBRID" | "EV";
}

/** เน€เธยเน€เธเธเน€เธเธเน€เธยเน€เธเธเน€เธโ€“เน€เธยเน€เธโ€เน€เธเธเน€เธยเน€เธเธเน€เธยเน€เธโ€ขเน€เธยเน€เธเธเน€เธยเน€เธเธเน€เธเธเน€เธยเน€เธเธเน€เธเธเน€เธเธ‘เน€เธยเน€เธโ€”เน€เธเธ•เน€เธย (เน€เธยเน€เธยเน€เธยเน€เธยเน€เธเธ‘เน€เธย filter pills) */
export async function filterVehicles(args: FilterVehiclesArgs) {
  let filtered: Vehicle[] = VEHICLES;

  if (args.category) filtered = filtered.filter((v) => v.category === args.category);
  if (args.priceMin != null) {
    filtered = filtered.filter((v) => (v.dailyRate ?? v.baseRate) >= args.priceMin!);
  }
  if (args.priceMax != null) {
    filtered = filtered.filter((v) => (v.dailyRate ?? v.baseRate) <= args.priceMax!);
  }
  if (args.seats != null) filtered = filtered.filter((v) => v.features.seats >= args.seats!);
  if (args.transmission) {
    filtered = filtered.filter((v) => v.features.transmission === args.transmission);
  }
  if (args.fuelType) filtered = filtered.filter((v) => v.features.fuelType === args.fuelType);
  if (args.features?.length) {
    filtered = filtered.filter((v) =>
      args.features!.every((f) => (v.features as unknown as Record<string, unknown>)[f] === true),
    );
  }

  return {
    content: [
      { type: "text" as const, text: JSON.stringify({ vehicles: filtered, total: filtered.length }, null, 2) },
    ],
  };
}
