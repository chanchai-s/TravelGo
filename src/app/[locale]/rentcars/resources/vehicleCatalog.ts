import { VEHICLES } from "./data.js";

export async function getVehicleCatalog() {
  const categories = [
    { value: "ECONOMY", label: "Economy" },
    { value: "COMPACT_SUV", label: "Compact SUV" },
    { value: "SEDAN", label: "Sedan" },
    { value: "LUXURY_SEDAN", label: "Luxury Sedan" },
    { value: "VAN", label: "Van / MPV" },
    { value: "PICKUP_TRUCK", label: "Pickup Truck" },
  ].map((c) => ({
    ...c,
    count: VEHICLES.filter((v) => v.category === c.value).length,
  }));

  const rates = VEHICLES.map((v) => v.dailyRate ?? v.baseRate);

  return {
    vehicles: VEHICLES,
    total: VEHICLES.length,
    filters: {
      categories,
      priceRange: { min: Math.min(...rates), max: Math.max(...rates) },
      features: ["GPS", "Bluetooth", "CarPlay", "Child Seat", "fourWheelDrive"],
      transmissions: ["AUTO", "MANUAL"],
      fuelTypes: ["PETROL", "DIESEL", "HYBRID", "EV"],
    },
  };
}
