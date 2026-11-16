import { FLEET_PARTNERS } from "./data";

export async function getFleetPartners() {
  return {
    partners: FLEET_PARTNERS,
    total: FLEET_PARTNERS.length,
  };
}
