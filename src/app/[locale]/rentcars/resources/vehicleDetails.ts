import { VEHICLES, RENTAL_RULES } from "./data.js";
import { VehicleDetail } from "../types/vehicle.js";

export async function getVehicleDetail(vehicleId: string): Promise<VehicleDetail | { error: string }> {
  const vehicle = VEHICLES.find((v) => v.id === vehicleId);
  if (!vehicle) return { error: "Vehicle not found" };

  return {
    ...vehicle,
    rentalRules: RENTAL_RULES[vehicle.category] ?? RENTAL_RULES.SEDAN,
    reviews: [
      {
        id: "rev-001",
        userId: "usr-001",
        userName: "Nattapong S.",
        rating: 5,
        comment: "เธฃเธ–เธชเธฐเธญเธฒเธ” เธชเนเธเนเธง เธเธเธเธฑเธเนเธเธ”เธตเธกเธฒเธ เนเธเธฐเธเธณเน€เธฅเธขเธเธฃเธฑเธ",
        createdAt: "2026-09-12T08:30:00Z",
        vehicleId: vehicle.id,
      },
      {
        id: "rev-002",
        userId: "usr-002",
        userName: "Sarah L.",
        rating: 4,
        comment: "เนเธ”เนเธฃเธ–เธ•เธฃเธเธ•เธฒเธกเธฃเธนเธ เธเธฃเธฐเธ—เธฑเธเนเธเธเธฃเธดเธเธฒเธฃ เธฃเธฒเธเธฒเธเธธเนเธก",
        createdAt: "2026-08-28T14:10:00Z",
        vehicleId: vehicle.id,
      },
    ],
    similarVehicles: VEHICLES.filter(
      (v) => v.id !== vehicle.id && v.category === vehicle.category,
    ).slice(0, 3),
  };
}
