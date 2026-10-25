import { RENTAL_RULES } from "./data.js";
import { InsuranceOption } from "../types/vehicle.js";

const EXCLUSIONS = [
  "Interior stains / damage",
  "Lost keys",
  "Wrong fuel",
  "Off-road damage (unless 4WD)",
  "Intentional damage",
  "Driving under influence",
  "Unauthorized drivers",
];

export async function getInsuranceOptions(): Promise<{ options: InsuranceOption[] }> {
  return {
    options: RENTAL_RULES.SEDAN.insuranceOptions.map((o) => ({
      ...o,
      exclusions: EXCLUSIONS,
    })),
  };
}
