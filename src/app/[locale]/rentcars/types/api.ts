/**
 * ชนิดข้อมูลของ API รถเช่า (ตรงกับที่ backend ส่งจริง)
 * - GET /vehicle-categories
 * - GET /vehicles
 * - POST /vehicles/:id/quote
 * - POST /bookings/rental
 * - GET /bookings/me
 */

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

/** สถานะของ RentalDetail ที่ backend ใช้ */
export type RentalStatus =
  | "PENDING_PARTNER"
  | "RESERVED"
  | "REJECTED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type RentalDetail = {
  id: string;
  status: RentalStatus | string;
  pickupAt: string;
  dropoffAt: string;
  days: number;
  pricePerDay: number;
  depositAmount: number;
  driverName?: string | null;
  driverPhone?: string | null;
  notes?: string | null;
  vehicle: {
    id: string;
    name: string;
    brand?: string | null;
    imageUrl: string | null;
    transmission?: string;
    fuelType?: string;
    seats?: number;
  } | null;
  branch: { id: string; name: string; address: string; phone?: string | null } | null;
};

export type RentalBookingResult = {
  id: string;
  ref: string;
  totalPrice: number;
  status?: string;
  rentalDetail: RentalDetail | null;
};
