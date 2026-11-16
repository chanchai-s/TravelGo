export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export interface RentalBookingVehicle {
  id: string;
  title: string;
  category: string;
  images: string[];
  fleetPartner?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
}

export interface RentalBookingPriceBreakdown {
  basePrice: number;
  insuranceFee: number;
  fuelFee: number;
  youngDriverFee: number;
  additionalDriverFee: number;
  discountAmount: number;
  taxAmount: number;
  totalPrice: number;
  currency: string;
}

export interface Booking {
  id: string;
  ref: string;
  userId: string;
  vehicleId: string;
  vehicle: RentalBookingVehicle;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  isChauffeur: boolean;
  insuranceType: string;
  fuelPolicy: string;
  addOns: string[];
  totalPrice: number;
  securityDeposit: number;
  priceBreakdown: RentalBookingPriceBreakdown;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RentalBooking extends Booking {}

export interface BookingResponse {
  success: boolean;
  booking?: Booking;
  error?: string;
}

export interface BookingResponse {
  success: boolean;
  booking?: Booking;
  error?: string;
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalUsers: number;
  totalHosts: number;
  totalStays: number;
  totalFlights: number;
  totalActivities: number;
  totalTransports: number;
}
