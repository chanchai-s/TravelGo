// Types for the RentCars catalogue — the page talks to the real API in
// `src/app/Api/mainApi.ts`; this file only describes the payloads.

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
