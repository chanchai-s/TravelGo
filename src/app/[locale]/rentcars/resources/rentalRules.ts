import { RENTAL_RULES } from "./data";
import type { RentalRules } from "../types/vehicle";

export async function getRentalRules(category?: string): Promise<RentalRules | Record<string, RentalRules>> {
  if (category && RENTAL_RULES[category]) return RENTAL_RULES[category];
  return RENTAL_RULES;
}
