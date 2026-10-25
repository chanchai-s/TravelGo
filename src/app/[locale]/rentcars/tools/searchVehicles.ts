import { VEHICLES } from "../resources/data.js";
import { VehicleSearchParams, VehicleSearchResult } from "../types/vehicle.js";

/** เน€เธยเน€เธยเน€เธยเน€เธเธเน€เธเธ’เน€เธเธเน€เธโ€“เน€เธโ€ขเน€เธเธ’เน€เธเธเน€เธโ€ขเน€เธเธ‘เน€เธเธเน€เธยเน€เธเธเน€เธเธเน€เธย (เน€เธเธเน€เธเธเน€เธเธเน€เธโ€/เน€เธเธเน€เธเธ’เน€เธยเน€เธเธ’/เน€เธโ€”เน€เธเธ•เน€เธยเน€เธยเน€เธเธ‘เน€เธยเน€เธย/เน€เธยเน€เธเธ•เน€เธโฌเน€เธยเน€เธเธเน€เธเธเน€เธย/เน€เธโฌเน€เธยเน€เธเธ—เน€เธยเน€เธเธเน€เธโฌเน€เธยเน€เธเธ…เน€เธเธ”เน€เธย/เน€เธโฌเน€เธยเน€เธเธ•เน€เธเธเน€เธเธเน€เธย) */
export async function searchVehicles(args: VehicleSearchParams) {
  const page = args.page ?? 1;
  const limit = args.limit ?? 20;

  let filtered = VEHICLES.filter((v) => v.isAvailable);

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

  const start = (page - 1) * limit;
  const vehicles = filtered.slice(start, start + limit);

  const result: VehicleSearchResult = {
    vehicles,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
    filters: {
      categories: [
        { value: "ECONOMY", label: "Economy", count: VEHICLES.filter((v) => v.category === "ECONOMY").length },
        { value: "COMPACT_SUV", label: "Compact SUV", count: VEHICLES.filter((v) => v.category === "COMPACT_SUV").length },
        { value: "SEDAN", label: "Sedan", count: VEHICLES.filter((v) => v.category === "SEDAN").length },
        { value: "LUXURY_SEDAN", label: "Luxury Sedan", count: VEHICLES.filter((v) => v.category === "LUXURY_SEDAN").length },
        { value: "VAN", label: "Van / MPV", count: VEHICLES.filter((v) => v.category === "VAN").length },
        { value: "PICKUP_TRUCK", label: "Pickup Truck", count: VEHICLES.filter((v) => v.category === "PICKUP_TRUCK").length },
      ],
      priceRange: {
        min: Math.min(...VEHICLES.map((v) => v.dailyRate ?? v.baseRate)),
        max: Math.max(...VEHICLES.map((v) => v.dailyRate ?? v.baseRate)),
      },
      features: ["GPS", "Bluetooth", "CarPlay", "Child Seat", "fourWheelDrive"],
      transmissions: ["AUTO", "MANUAL"],
      fuelTypes: ["PETROL", "DIESEL", "HYBRID", "EV"],
    },
  };

  return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
}
