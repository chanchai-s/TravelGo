import { RENTAL_RULES } from "./data.js";
import { RentalRules } from "../types/vehicle.js";

export async function getRentalRules(category?: string): Promise<RentalRules | Record<string, RentalRules>> {
  if (category && RENTAL_RULES[category]) return RENTAL_RULES[category];
  return RENTAL_RULES;
}
