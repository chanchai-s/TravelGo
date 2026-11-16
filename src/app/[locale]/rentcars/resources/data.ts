import {
  FuelType,
  ServiceType,
  TransmissionType,
  VehicleCategory,
} from "../types/vehicle";
import type { RentalRules, Vehicle } from "../types/vehicle";

export type VehicleCategoryItem = {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
};

export type VehiclePartnerBrief = {
  id: string;
  companyName: string;
};

export type VehicleBranchBrief = {
  id: string;
  name: string;
  address: string;
};

export type VehicleListItem = {
  id: string;
  name: string;
  brand: string | null;
  category: { id: string; slug: string; name: string } | null;
  partner: VehiclePartnerBrief | null;
  branch: VehicleBranchBrief | null;
  seats: number;
  bags: number;
  doors: number;
  transmission: string;
  fuelType: string;
  pricePerDay: number;
  depositAmount: number;
  imageUrl: string | null;
  specs: Record<string, unknown> | null;
  minRentalDays: number;
  maxRentalDays: number | null;
};

export type RentalQuote = {
  vehicleId: string;
  pickupAt: string;
  dropoffAt: string;
  days: number;
  pricePerDay: number;
  rentalTotal: number;
  baseAmount: number;
  vatAmount: number;
  vatRate: number;
  depositAmount: number;
  totalDueAtBranch: number;
};

export type RentalBookingResult = {
  id: string;
  ref: string;
  totalPrice: number;
  rentalDetail: {
    id: string;
    status: string;
    pickupAt: string;
    dropoffAt: string;
    days: number;
    pricePerDay: number;
    depositAmount: number;
    vehicle: { id: string; name: string; imageUrl: string | null } | null;
    branch: { id: string; name: string; address: string } | null;
  } | null;
};

export const FLEET_PARTNERS = [
  {
    id: "fp-001",
    name: "AVIS Thailand",
    logoUrl: "https://example.com/avis.png",
    rating: 4.8,
    reviewCount: 1200,
    location: "Bangkok",
    description: "Trusted rental partner",
    vehicleCount: 150,
  },
  {
    id: "fp-002",
    name: "Hertz Thailand",
    logoUrl: "https://example.com/hertz.png",
    rating: 4.7,
    reviewCount: 980,
    location: "Chiang Mai",
    description: "Airport pickup available",
    vehicleCount: 96,
  },
];

export const VEHICLES: Vehicle[] = [
  {
    id: "veh-001",
    fleetPartnerId: "fp-001",
    fleetPartner: FLEET_PARTNERS[0],
    title: "Toyota Yaris Cross",
    serviceType: ServiceType.RENTAL,
    category: VehicleCategory.COMPACT_SUV,
    baseRate: 1200,
    dailyRate: 1350,
    isAvailable: true,
    images: [{ url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80" }],
    features: {
      seats: 5,
      bags: 2,
      transmission: TransmissionType.AUTO,
      fuelType: FuelType.PETROL,
      gps: true,
      bluetooth: true,
      carplay: true,
      childSeat: false,
      airConditioning: true,
      fourWheelDrive: true,
    },
    badges: [
      { type: "unlimited_km", label: "Unlimited KM", icon: "route", color: "green" },
      { type: "free_cancellation", label: "Free cancellation", icon: "event_available", color: "blue" },
    ],
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "veh-002",
    fleetPartnerId: "fp-002",
    fleetPartner: FLEET_PARTNERS[1],
    title: "Honda Civic",
    serviceType: ServiceType.RENTAL,
    category: VehicleCategory.SEDAN,
    baseRate: 980,
    dailyRate: 1100,
    isAvailable: true,
    images: [{ url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80" }],
    features: {
      seats: 5,
      bags: 2,
      transmission: TransmissionType.AUTO,
      fuelType: FuelType.PETROL,
      gps: true,
      bluetooth: true,
      carplay: true,
      airConditioning: true,
    },
    badges: [{ type: "instant_confirmation", label: "Instant confirm", icon: "flash_on", color: "amber" }],
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
] as Vehicle[];

export const RENTAL_RULES: Record<string, RentalRules> = {
  ECONOMY: {
    minimumAge: 21,
    minimumLicenseYears: 1,
    depositAmount: 5000,
    depositCurrency: "THB",
    cancellationPolicy: {
      freeCancellationUntilHours: 24,
      cancellationFeePercent: 20,
      nonRefundableAfterHours: 24,
    },
    insuranceOptions: [
      { type: "BASIC", name: "Basic", description: "Coverage for basic accidents", dailyRate: 120, deductible: 5000, coverage: ["Accident"], exclusions: ["Theft"] },
      { type: "FULL", name: "Full cover", description: "Includes theft and damage", dailyRate: 180, deductible: 2000, coverage: ["Accident", "Theft"], exclusions: [] },
      { type: "PREMIUM", name: "Premium", description: "Comprehensive protection", dailyRate: 260, deductible: 1000, coverage: ["Accident", "Theft", "Roadside"], exclusions: [] },
    ],
    fuelPolicies: [
      { type: "FULL_TO_FULL", name: "Full to Full", description: "Return with same fuel level", fee: 0, pros: ["Flexible"], cons: [] },
      { type: "PREPAID", name: "Prepaid fuel", description: "Fuel already paid", fee: 200, pros: ["Convenient"], cons: [] },
      { type: "SAME_TO_SAME", name: "Same to same", description: "Fuel level same as pickup", fee: 0, pros: ["Simple"], cons: [] },
    ],
    mileagePolicy: { type: "UNLIMITED" },
    additionalDriverPolicy: { allowed: true, feePerDay: 150, maxAdditionalDrivers: 1, requirements: ["Valid license"] },
    youngDriverPolicy: { minimumAge: 21, youngDriverAgeThreshold: 25, youngDriverFeePerDay: 200 },
    crossBorderPolicy: { allowed: false, additionalFee: 0, requiredDocuments: [] },
  },
  COMPACT_SUV: {
    minimumAge: 21,
    minimumLicenseYears: 1,
    depositAmount: 7000,
    depositCurrency: "THB",
    cancellationPolicy: {
      freeCancellationUntilHours: 24,
      cancellationFeePercent: 20,
      nonRefundableAfterHours: 24,
    },
    insuranceOptions: [
      { type: "BASIC", name: "Basic", description: "Coverage for basic accidents", dailyRate: 150, deductible: 6000, coverage: ["Accident"], exclusions: [] },
      { type: "FULL", name: "Full cover", description: "Includes theft and damage", dailyRate: 220, deductible: 2500, coverage: ["Accident", "Theft"], exclusions: [] },
      { type: "PREMIUM", name: "Premium", description: "Comprehensive protection", dailyRate: 300, deductible: 1500, coverage: ["Accident", "Theft", "Roadside"], exclusions: [] },
    ],
    fuelPolicies: [
      { type: "FULL_TO_FULL", name: "Full to Full", description: "Return with same fuel level", fee: 0, pros: ["Flexible"], cons: [] },
      { type: "PREPAID", name: "Prepaid fuel", description: "Fuel already paid", fee: 250, pros: ["Convenient"], cons: [] },
      { type: "SAME_TO_SAME", name: "Same to same", description: "Fuel level same as pickup", fee: 0, pros: ["Simple"], cons: [] },
    ],
    mileagePolicy: { type: "UNLIMITED" },
    additionalDriverPolicy: { allowed: true, feePerDay: 170, maxAdditionalDrivers: 1, requirements: ["Valid license"] },
    youngDriverPolicy: { minimumAge: 21, youngDriverAgeThreshold: 25, youngDriverFeePerDay: 250 },
    crossBorderPolicy: { allowed: false, additionalFee: 0, requiredDocuments: [] },
  },
  SEDAN: {
    minimumAge: 21,
    minimumLicenseYears: 1,
    depositAmount: 6000,
    depositCurrency: "THB",
    cancellationPolicy: {
      freeCancellationUntilHours: 24,
      cancellationFeePercent: 20,
      nonRefundableAfterHours: 24,
    },
    insuranceOptions: [
      { type: "BASIC", name: "Basic", description: "Coverage for basic accidents", dailyRate: 130, deductible: 5000, coverage: ["Accident"], exclusions: [] },
      { type: "FULL", name: "Full cover", description: "Includes theft and damage", dailyRate: 200, deductible: 2500, coverage: ["Accident", "Theft"], exclusions: [] },
      { type: "PREMIUM", name: "Premium", description: "Comprehensive protection", dailyRate: 280, deductible: 1500, coverage: ["Accident", "Theft", "Roadside"], exclusions: [] },
    ],
    fuelPolicies: [
      { type: "FULL_TO_FULL", name: "Full to Full", description: "Return with same fuel level", fee: 0, pros: ["Flexible"], cons: [] },
      { type: "PREPAID", name: "Prepaid fuel", description: "Fuel already paid", fee: 200, pros: ["Convenient"], cons: [] },
      { type: "SAME_TO_SAME", name: "Same to same", description: "Fuel level same as pickup", fee: 0, pros: ["Simple"], cons: [] },
    ],
    mileagePolicy: { type: "UNLIMITED" },
    additionalDriverPolicy: { allowed: true, feePerDay: 150, maxAdditionalDrivers: 1, requirements: ["Valid license"] },
    youngDriverPolicy: { minimumAge: 21, youngDriverAgeThreshold: 25, youngDriverFeePerDay: 200 },
    crossBorderPolicy: { allowed: false, additionalFee: 0, requiredDocuments: [] },
  },
  LUXURY_SEDAN: {
    minimumAge: 25,
    minimumLicenseYears: 2,
    depositAmount: 8000,
    depositCurrency: "THB",
    cancellationPolicy: {
      freeCancellationUntilHours: 48,
      cancellationFeePercent: 15,
      nonRefundableAfterHours: 48,
    },
    insuranceOptions: [
      { type: "BASIC", name: "Basic", description: "Basic luxury coverage", dailyRate: 180, deductible: 8000, coverage: ["Accident"], exclusions: [] },
      { type: "FULL", name: "Full cover", description: "Full theft and damage protection", dailyRate: 260, deductible: 3000, coverage: ["Accident", "Theft"], exclusions: [] },
      { type: "PREMIUM", name: "Premium", description: "Premium coverage", dailyRate: 340, deductible: 1500, coverage: ["Accident", "Theft", "Roadside"], exclusions: [] },
    ],
    fuelPolicies: [
      { type: "FULL_TO_FULL", name: "Full to Full", description: "Return with same fuel level", fee: 0, pros: ["Flexible"], cons: [] },
      { type: "PREPAID", name: "Prepaid fuel", description: "Fuel already paid", fee: 300, pros: ["Convenient"], cons: [] },
      { type: "SAME_TO_SAME", name: "Same to same", description: "Fuel level same as pickup", fee: 0, pros: ["Simple"], cons: [] },
    ],
    mileagePolicy: { type: "UNLIMITED" },
    additionalDriverPolicy: { allowed: true, feePerDay: 200, maxAdditionalDrivers: 1, requirements: ["Valid license"] },
    youngDriverPolicy: { minimumAge: 25, youngDriverAgeThreshold: 30, youngDriverFeePerDay: 300 },
    crossBorderPolicy: { allowed: false, additionalFee: 0, requiredDocuments: [] },
  },
  VAN: {
    minimumAge: 23,
    minimumLicenseYears: 1,
    depositAmount: 12000,
    depositCurrency: "THB",
    cancellationPolicy: {
      freeCancellationUntilHours: 24,
      cancellationFeePercent: 20,
      nonRefundableAfterHours: 24,
    },
    insuranceOptions: [
      { type: "BASIC", name: "Basic", description: "Coverage for basic accidents", dailyRate: 180, deductible: 8000, coverage: ["Accident"], exclusions: [] },
      { type: "FULL", name: "Full cover", description: "Includes theft and damage", dailyRate: 260, deductible: 4000, coverage: ["Accident", "Theft"], exclusions: [] },
      { type: "PREMIUM", name: "Premium", description: "Comprehensive protection", dailyRate: 360, deductible: 2000, coverage: ["Accident", "Theft", "Roadside"], exclusions: [] },
    ],
    fuelPolicies: [
      { type: "FULL_TO_FULL", name: "Full to Full", description: "Return with same fuel level", fee: 0, pros: ["Flexible"], cons: [] },
      { type: "PREPAID", name: "Prepaid fuel", description: "Fuel already paid", fee: 350, pros: ["Convenient"], cons: [] },
      { type: "SAME_TO_SAME", name: "Same to same", description: "Fuel level same as pickup", fee: 0, pros: ["Simple"], cons: [] },
    ],
    mileagePolicy: { type: "UNLIMITED" },
    additionalDriverPolicy: { allowed: true, feePerDay: 200, maxAdditionalDrivers: 1, requirements: ["Valid license"] },
    youngDriverPolicy: { minimumAge: 23, youngDriverAgeThreshold: 27, youngDriverFeePerDay: 300 },
    crossBorderPolicy: { allowed: false, additionalFee: 0, requiredDocuments: [] },
  },
  PICKUP_TRUCK: {
    minimumAge: 24,
    minimumLicenseYears: 2,
    depositAmount: 15000,
    depositCurrency: "THB",
    cancellationPolicy: {
      freeCancellationUntilHours: 24,
      cancellationFeePercent: 20,
      nonRefundableAfterHours: 24,
    },
    insuranceOptions: [
      { type: "BASIC", name: "Basic", description: "Coverage for basic accidents", dailyRate: 220, deductible: 12000, coverage: ["Accident"], exclusions: [] },
      { type: "FULL", name: "Full cover", description: "Includes theft and damage", dailyRate: 320, deductible: 5000, coverage: ["Accident", "Theft"], exclusions: [] },
      { type: "PREMIUM", name: "Premium", description: "Premium protection", dailyRate: 420, deductible: 2500, coverage: ["Accident", "Theft", "Roadside"], exclusions: [] },
    ],
    fuelPolicies: [
      { type: "FULL_TO_FULL", name: "Full to Full", description: "Return with same fuel level", fee: 0, pros: ["Flexible"], cons: [] },
      { type: "PREPAID", name: "Prepaid fuel", description: "Fuel already paid", fee: 400, pros: ["Convenient"], cons: [] },
      { type: "SAME_TO_SAME", name: "Same to same", description: "Fuel level same as pickup", fee: 0, pros: ["Simple"], cons: [] },
    ],
    mileagePolicy: { type: "UNLIMITED" },
    additionalDriverPolicy: { allowed: true, feePerDay: 220, maxAdditionalDrivers: 1, requirements: ["Valid license"] },
    youngDriverPolicy: { minimumAge: 24, youngDriverAgeThreshold: 30, youngDriverFeePerDay: 350 },
    crossBorderPolicy: { allowed: false, additionalFee: 0, requiredDocuments: [] },
  },
};

export const VEHICLE_CATEGORIES = [
  { value: "ECONOMY", label: "Economy" },
  { value: "COMPACT_SUV", label: "Compact SUV" },
  { value: "SEDAN", label: "Sedan" },
  { value: "LUXURY_SEDAN", label: "Luxury Sedan" },
  { value: "VAN", label: "Van / MPV" },
  { value: "PICKUP_TRUCK", label: "Pickup Truck" },
];

export const RENTAL_RULES_DEFAULT = RENTAL_RULES.SEDAN;
