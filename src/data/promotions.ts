export type VoucherCategory = "stays" | "flights" | "activities" | "transport";

export type VoucherFilter = "all" | VoucherCategory;

export type Voucher = {
  id: string;
  category: VoucherCategory;
  discountMain: string;
  discountSub: string;
  highlight: boolean;
  icon: string;
  tag: string;
  code: string;
  hotDeal?: boolean;
  title: string;
  condition: string;
  expiry: string;
};

export type CategoryChip = {
  id: VoucherFilter;
  label: string;
  icon: string;
};

export type BankPrivilege = {
  id: string;
  short: string;
  shortColor: string;
  name: string;
  badge: string;
  badgeClass: string;
  detail: string;
};

// Mock data (no backend yet)
export const PROMO_HEADER = {
  eyebrow: "Exclusive Rewards",
  title: "Vouchers & Deals",
  activeCount: "14 Active",
};

export const PROMO_SEARCH = {
  placeholder: "Enter promo code (e.g. MEGA2025)...",
};

export const VALID_PROMO_CODES = ["MEGA2025", "WANDERHOTEL30", "FLYNOW500"];

export const HERO_DEAL = {
  tag: "Mid-Year Special",
  countdown: "Ends in 2d 14h",
  title: "Mega Mid-Year Travel Fair",
  highlight: "50% OFF",
  description: "Up to 50% OFF + ฿1,500 extra instant cash voucher for cross-border trips!",
  cashback: "฿1,500",
  claimLabel: "Claim ฿1,500",
  claimedLabel: "Claimed",
};

export const CATEGORY_CHIPS: CategoryChip[] = [
  { id: "all", label: "All Deals", icon: "auto_awesome" },
  { id: "stays", label: "Stays", icon: "hotel" },
  { id: "flights", label: "Flights", icon: "flight" },
  { id: "transport", label: "Transport", icon: "directions_car" },
  { id: "activities", label: "Activities", icon: "attractions" },
];

export const VOUCHERS: Voucher[] = [
  {
    id: "wanderhotel30",
    category: "stays",
    discountMain: "30%",
    discountSub: "OFF",
    highlight: false,
    icon: "hotel",
    tag: "Stays",
    code: "WANDERHOTEL30",
    title: "Luxury Resorts & Boutique Stays",
    condition: "Min. spend ฿3,000 • Valid worldwide",
    expiry: "Exp: 30 Nov 2025",
  },
  {
    id: "flynow500",
    category: "flights",
    discountMain: "฿500",
    discountSub: "Instant",
    highlight: false,
    icon: "flight",
    tag: "Flights",
    code: "FLYNOW500",
    title: "Domestic Flights Discount",
    condition: "Thai Airways, Bangkok Airways • Min spend ฿2,000",
    expiry: "Exp: 25 Nov 2025",
  },
  {
    id: "explorethai",
    category: "activities",
    discountMain: "20%",
    discountSub: "OFF",
    highlight: true,
    icon: "attractions",
    tag: "Tours",
    code: "EXPLORETHAI",
    hotDeal: true,
    title: "Tours, Island Trips & Fun",
    condition: "No minimum spend • Instant confirmation",
    expiry: "Exp: 15 Dec 2025",
  },
  {
    id: "roadtrip15",
    category: "transport",
    discountMain: "15%",
    discountSub: "OFF",
    highlight: false,
    icon: "directions_car",
    tag: "Rental",
    code: "ROADTRIP15",
    title: "Airport Car Rental Savings",
    condition: "Valid at CNX, HKT, BKK • Min. 3 days",
    expiry: "Exp: 31 Dec 2025",
  },
];

export const BANK_PRIVILEGES: BankPrivilege[] = [
  {
    id: "kbank",
    short: "KB",
    shortColor: "text-[#00A950]",
    name: "Kasikornbank Cards",
    badge: "15% Cashback",
    badgeClass: "bg-secondary-fixed text-on-secondary-fixed",
    detail: "On flight & hotel bookings over ฿5,000",
  },
  {
    id: "scb",
    short: "SCB",
    shortColor: "text-[#4E2A84]",
    name: "SCB Cardholders",
    badge: "0% 6 Months",
    badgeClass: "bg-primary-fixed text-on-primary-fixed",
    detail: "Interest-free installments on all packages",
  },
  {
    id: "citi",
    short: "CITI",
    shortColor: "text-[#003B70]",
    name: "Citi Travel Privilege",
    badge: "Free Insurance",
    badgeClass: "bg-surface-variant text-on-surface-variant",
    detail: "Complimentary ฿1.5M medical & delay cover",
  },
];
