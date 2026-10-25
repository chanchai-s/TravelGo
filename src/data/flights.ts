export type TripType = "round-trip" | "one-way" | "multi-city";

export type DateOption = {
  id: string;
  day: string;
  price: string;
  lowest?: boolean;
};

export type SortChip = {
  id: string;
  label: string;
  icon: string;
};

export type FlightPerk = {
  icon: string;
  iconClass: string;
  label: string;
};

export type Flight = {
  id: string;
  airline: string;
  flightNo: string;
  code: string;
  codeTone: "blue" | "grey" | "coral";
  badge: string;
  badgeIcon: string;
  badgeTone: "blue" | "grey" | "muted";
  departTime: string;
  departCode: string;
  departAirport: string;
  arriveTime: string;
  arriveCode: string;
  arriveAirport: string;
  duration: string;
  stops: string;
  perks: FlightPerk[];
  price: string;
  oldPrice?: string;
  ctaTone: "coral" | "blue";
};

// Mock data (no backend yet)
export const TRIP_TYPES: { id: TripType; label: string }[] = [
  { id: "round-trip", label: "Round-trip" },
  { id: "one-way", label: "One-way" },
  { id: "multi-city", label: "Multi-city" },
];

export const ROUTE_SUMMARY = {
  from: "BKK",
  to: "CNX",
  detail: "15 Nov - 18 Nov (3 Nights) • 1 Adult • Economy",
};

export const DATE_OPTIONS: DateOption[] = [
  { id: "13-nov", day: "Wed, 13 Nov", price: "฿1,540" },
  { id: "14-nov", day: "Thu, 14 Nov", price: "฿1,420" },
  { id: "15-nov", day: "Fri, 15 Nov", price: "฿1,250", lowest: true },
  { id: "16-nov", day: "Sat, 16 Nov", price: "฿1,380" },
  { id: "17-nov", day: "Sun, 17 Nov", price: "฿1,890" },
  { id: "18-nov", day: "Mon, 18 Nov", price: "฿1,490" },
];

export const SORT_CHIPS: SortChip[] = [
  { id: "cheapest", label: "Cheapest", icon: "bolt" },
  { id: "fastest", label: "Fastest", icon: "timer" },
  { id: "nonstop", label: "Non-stop only", icon: "flight" },
  { id: "morning", label: "Morning (06-12)", icon: "wb_sunny" },
];

export const FARE_NOTICE = {
  title: "Fares are ฿320 cheaper than average",
  subtitle: "Book today to secure this price",
};

export const FLIGHTS: Flight[] = [
  {
    id: "tg-110",
    airline: "Thai Airways",
    flightNo: "TG 110 • Airbus A350",
    code: "TG",
    codeTone: "blue",
    badge: "Cheapest",
    badgeIcon: "local_offer",
    badgeTone: "blue",
    departTime: "08:30",
    departCode: "BKK",
    departAirport: "Suvarnabhumi",
    arriveTime: "09:45",
    arriveCode: "CNX",
    arriveAirport: "Chiang Mai Intl",
    duration: "1h 15m",
    stops: "Non-stop",
    perks: [
      { icon: "luggage", iconClass: "text-primary", label: "20 kg" },
      { icon: "restaurant", iconClass: "text-primary", label: "Snack & Drink" },
      { icon: "power", iconClass: "text-primary", label: "USB power" },
    ],
    price: "฿1,250",
    oldPrice: "฿1,570",
    ctaTone: "coral",
  },
  {
    id: "pg-215",
    airline: "Bangkok Airways",
    flightNo: "PG 215 • Boutique Airline",
    code: "PG",
    codeTone: "grey",
    badge: "Fastest & Best Rated",
    badgeIcon: "workspace_premium",
    badgeTone: "grey",
    departTime: "10:15",
    departCode: "BKK",
    departAirport: "Suvarnabhumi",
    arriveTime: "11:30",
    arriveCode: "CNX",
    arriveAirport: "Chiang Mai Intl",
    duration: "1h 15m",
    stops: "Non-stop",
    perks: [
      { icon: "deck", iconClass: "text-secondary", label: "Free Lounge Access" },
      { icon: "luggage", iconClass: "text-primary", label: "20 kg check-in" },
    ],
    price: "฿1,690",
    ctaTone: "blue",
  },
  {
    id: "fd-3430",
    airline: "Thai AirAsia",
    flightNo: "FD 3430 • Airbus A320",
    code: "FD",
    codeTone: "coral",
    badge: "Budget Choice",
    badgeIcon: "savings",
    badgeTone: "muted",
    departTime: "13:40",
    departCode: "DMK",
    departAirport: "Don Mueang",
    arriveTime: "14:55",
    arriveCode: "CNX",
    arriveAirport: "Chiang Mai Intl",
    duration: "1h 15m",
    stops: "Non-stop",
    perks: [
      { icon: "backpack", iconClass: "text-tertiary", label: "7 kg cabin baggage" },
      { icon: "credit_card", iconClass: "text-primary", label: "Free cancellations (24h)" },
    ],
    price: "฿1,310",
    ctaTone: "blue",
  },
];

export const SORT_BAR = {
  sort: "Sort: Lowest Price",
  filter: "Filter (4 applied)",
};
