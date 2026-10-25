import { VEHICLES } from "../resources/data";
import { Vehicle } from "../types/vehicle";

export async function getVehicleDetails(args: { vehicleId: string }) {
  const vehicle = VEHICLES.find((v) => v.id === args.vehicleId);
  if (!vehicle) {
    return { content: [{ type: "text", text: `Vehicle with ID ${args.vehicleId} not found` }] };
  }
  return {
    content: [{ type: "text", text: JSON.stringify(vehicle, null, 2) }],
  };
}
