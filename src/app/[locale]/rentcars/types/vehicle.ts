export enum VehicleCategory {
  ECONOMY = "ECONOMY",
  COMPACT_SUV = "COMPACT_SUV",
  SEDAN = "SEDAN",
  LUXURY_SEDAN = "LUXURY_SEDAN",
  VAN = "VAN",
  PICKUP_TRUCK = "PICKUP_TRUCK",
}

export enum ServiceType {
  RENTAL = "RENTAL",
  RIDE = "RIDE",
  PARCEL = "PARCEL",
}

export enum VehicleStatus {
  ACTIVE = "ACTIVE",
  MAINTENANCE = "MAINTENANCE",
  INACTIVE = "INACTIVE",
}

export enum TransmissionType {
  AUTO = "AUTO",
  MANUAL = "MANUAL",
}

export enum FuelType {
  PETROL = "PETROL",
  DIESEL = "DIESEL",
  HYBRID = "HYBRID",
  EV = "EV",
}

export interface VehicleFeatures {
  seats: number;
  bags: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  gps?: boolean;
  bluetooth?: boolean;
  carplay?: boolean;
  childSeat?: boolean;
  airConditioning?: boolean;
  fourWheelDrive?: boolean;
}

export interface VehicleImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface FleetPartner {
  id: string;
  name: string;
  logoUrl: string;
  rating: number;
  reviewCount: number;
  location: string;
  description?: string;
  vehicleCount?: number;
}

export interface VehicleBadge {
  type: "unlimited_km" | "free_cancellation" | "instant_confirmation" | "full_coverage" | "roadside_assistance";
  label: string;
  icon: string;
  color: string;
}

export interface Vehicle {
  id: string;
  fleetPartnerId?: string;
  fleetPartner?: FleetPartner;
  title: string;
  serviceType: ServiceType;
  category: VehicleCategory;
  baseRate: number;
  ratePerKm?: number;
  dailyRate?: number;
  isAvailable: boolean;
  images: VehicleImage[];
  features: VehicleFeatures;
  badges: VehicleBadge[];
  status: VehicleStatus;
  createdAt: string;
}

export interface InsuranceOption {
  type: "BASIC" | "FULL" | "PREMIUM";
  name: string;
  description: string;
  dailyRate: number;
  deductible: number;
  coverage: string[];
  exclusions?: string[];
}

export interface FuelPolicy {
  type: "FULL_TO_FULL" | "PREPAID" | "SAME_TO_SAME";
  name: string;
  description: string;
  fee: number;
  pros?: string[];
  cons?: string[];
  recommendedFor?: string;
}

export interface CancellationPolicy {
  freeCancellationUntilHours: number;
  cancellationFeePercent: number;
  nonRefundableAfterHours: number;
}

export interface RentalRules {
  minimumAge: number;
  minimumLicenseYears: number;
  depositAmount: number;
  depositCurrency: string;
  cancellationPolicy: CancellationPolicy;
  insuranceOptions: InsuranceOption[];
  fuelPolicies: FuelPolicy[];
  mileagePolicy: {
    type: "UNLIMITED" | "LIMITED";
    dailyLimitKm?: number;
    extraKmRate?: number;
  };
  additionalDriverPolicy: {
    allowed: boolean;
    feePerDay?: number;
    maxAdditionalDrivers?: number;
    requirements: string[];
  };
  youngDriverPolicy: {
    minimumAge: number;
    youngDriverAgeThreshold: number;
    youngDriverFeePerDay?: number;
  };
  crossBorderPolicy: {
    allowed: boolean;
    allowedCountries?: string[];
    additionalFee?: number;
    requiredDocuments?: string[];
  };
}

export interface VehicleReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  vehicleId: string;
}

export interface VehicleDetail extends Vehicle {
  rentalRules: RentalRules;
  reviews: VehicleReview[];
  similarVehicles: Vehicle[];
}

export interface VehicleSearchParams {
  pickupLocation?: string;
  dropoffLocation?: string;
  pickupAt: string;
  dropoffAt: string;
  category?: VehicleCategory;
  priceMin?: number;
  priceMax?: number;
  features?: string[];
  seats?: number;
  transmission?: TransmissionType;
  fuelType?: FuelType;
  page?: number;
  limit?: number;
}

export interface VehicleSearchResult {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: {
    categories: { value: string; label: string; count: number }[];
    priceRange: { min: number; max: number };
    features: string[];
    transmissions: string[];
    fuelTypes: string[];
  };
}
