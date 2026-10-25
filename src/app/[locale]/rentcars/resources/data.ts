import { Booking } from "../types/booking";
import { User } from "../types/user";
import { Vehicle } from "../types/vehicle";

export interface PayoutAccount {
  id: string;
  hostId: string;
  hostName: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  stripeAccountId?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface OwnerEarning {
  id: string;
  hostId: string;
  bookingId: string;
  amount: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  status: "PENDING" | "PAID" | "VOID";
  paidAt?: string;
  createdAt: string;
}

export interface OwnerEarningsSummary {
  totalEarnings: number;
  totalCommission: number;
  totalNet: number;
  totalBookings: number;
  byMonth: { month: string; earnings: number; commission: number; net: number }[];
}

export interface PayoutRequest {
  hostId: string;
  amount: number;
  accountId: string;
}

export interface PayoutResult {
  success: boolean;
  payoutId?: string;
  message: string;
}

export interface Payout {
  id: string;
  hostId: string;
  amount: number;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  requestedAt: string;
  processedAt?: string;
  items: PayoutItem[];
}

export interface PayoutItem {
  id: string;
  payoutId: string;
  bookingId: string;
  amount: number;
}
