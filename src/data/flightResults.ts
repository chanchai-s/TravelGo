export type AllianceId = "star" | "oneworld" | "skyteam";

export type SortId = "recommended" | "nonstop" | "cheapest";

export type ResultFlight = {
  id: string;
  airline: string;
  code: string;
  codeTone: "blue" | "grey" | "coral";
  alliance: AllianceId | "none";
  flightNo: string;
  departTime: string;
  departCode: string;
  departAirport: string;
  arriveTime: string;
  arriveCode: string;
  arriveAirport: string;
  duration: string;
  stops: number;
  stopsLabel: string;
  transit?: string;
  baggage?: string;
  budget: boolean;
  perks: { icon: string; iconClass: string; label: string }[];
  priceTHB: number;
  oldPriceTHB?: number;
  tag?: string;
  ctaTone: "coral" | "blue";
};

export type AllianceInfo = { id: AllianceId; label: string };

// Mock results (โควต้า RapidAPI หมด — ใช้ mock ไปก่อน)
export const RESULT_FLIGHTS: ResultFlight[] = [
  {
    id: "tg-110",
    airline: "Thai Airways",
    code: "TG",
    codeTone: "blue",
    alliance: "star",
    flightNo: "TG 110 • Airbus A350",
    departTime: "08:30",
    departCode: "BKK",
    departAirport: "Suvarnabhumi",
    arriveTime: "09:45",
    arriveCode: "CNX",
    arriveAirport: "Chiang Mai Intl",
    duration: "1h 15m",
    stops: 0,
    stopsLabel: "Nonstop",
    baggage: "Checked baggage 23 kg",
    budget: false,
    perks: [
      { icon: "luggage", iconClass: "text-primary", label: "20 kg" },
      { icon: "restaurant", iconClass: "text-primary", label: "Snack & Drink" },
      { icon: "power", iconClass: "text-primary", label: "USB power" },
    ],
    priceTHB: 1250,
    oldPriceTHB: 1570,
    tag: "Cheapest",
    ctaTone: "coral",
  },
  {
    id: "pg-215",
    airline: "Bangkok Airways",
    code: "PG",
    codeTone: "grey",
    alliance: "none",
    flightNo: "PG 215 • Boutique Airline",
    departTime: "10:15",
    departCode: "BKK",
    departAirport: "Suvarnabhumi",
    arriveTime: "11:30",
    arriveCode: "CNX",
    arriveAirport: "Chiang Mai Intl",
    duration: "1h 15m",
    stops: 0,
    stopsLabel: "Nonstop",
    baggage: "Checked baggage 20 kg",
    budget: false,
    perks: [
      { icon: "deck", iconClass: "text-secondary", label: "Free Lounge Access" },
      { icon: "luggage", iconClass: "text-primary", label: "20 kg check-in" },
    ],
    priceTHB: 1690,
    tag: "Fastest",
    ctaTone: "blue",
  },
  {
    id: "fd-3430",
    airline: "Thai AirAsia",
    code: "FD",
    codeTone: "coral",
    alliance: "none",
    flightNo: "FD 3430 • Airbus A320",
    departTime: "13:40",
    departCode: "DMK",
    departAirport: "Don Mueang",
    arriveTime: "14:55",
    arriveCode: "CNX",
    arriveAirport: "Chiang Mai Intl",
    duration: "1h 15m",
    stops: 0,
    stopsLabel: "Nonstop",
    budget: true,
    perks: [
      { icon: "backpack", iconClass: "text-tertiary", label: "7 kg cabin baggage" },
      { icon: "credit_card", iconClass: "text-primary", label: "Free cancellations (24h)" },
    ],
    priceTHB: 1310,
    tag: "Budget Choice",
    ctaTone: "blue",
  },
  {
    id: "jl-034",
    airline: "Japan Airlines",
    code: "JL",
    codeTone: "grey",
    alliance: "oneworld",
    flightNo: "JL 034 • Boeing 787",
    departTime: "21:40",
    departCode: "BKK",
    departAirport: "Suvarnabhumi",
    arriveTime: "08:45",
    arriveCode: "CNX",
    arriveAirport: "Chiang Mai Intl",
    duration: "9h 5m",
    stops: 1,
    stopsLabel: "1 stop",
    transit: "1h 20m in Tokyo",
    baggage: "Checked baggage 2 x 23 kg",
    budget: false,
    perks: [
      { icon: "luggage", iconClass: "text-primary", label: "2 x 23 kg" },
      { icon: "restaurant", iconClass: "text-primary", label: "Full Meal" },
      { icon: "wifi", iconClass: "text-primary", label: "Wi-Fi" },
    ],
    priceTHB: 3450,
    ctaTone: "blue",
  },
  {
    id: "nh-806",
    airline: "All Nippon Airways",
    code: "NH",
    codeTone: "blue",
    alliance: "star",
    flightNo: "NH 806 • Boeing 777",
    departTime: "23:35",
    departCode: "BKK",
    departAirport: "Suvarnabhumi",
    arriveTime: "08:30",
    arriveCode: "CNX",
    arriveAirport: "Chiang Mai Intl",
    duration: "6h 55m",
    stops: 1,
    stopsLabel: "1 stop",
    transit: "2h 10m in Osaka",
    baggage: "Checked baggage 23 kg",
    budget: false,
    perks: [
      { icon: "luggage", iconClass: "text-primary", label: "23 kg" },
      { icon: "restaurant", iconClass: "text-primary", label: "Full Meal" },
    ],
    priceTHB: 3272,
    ctaTone: "blue",
  },
  {
    id: "cx-750",
    airline: "Cathay Pacific",
    code: "CX",
    codeTone: "grey",
    alliance: "oneworld",
    flightNo: "CX 750 • Airbus A330",
    departTime: "22:45",
    departCode: "BKK",
    departAirport: "Suvarnabhumi",
    arriveTime: "11:50",
    arriveCode: "CNX",
    arriveAirport: "Chiang Mai Intl",
    duration: "11h 5m",
    stops: 1,
    stopsLabel: "1 stop",
    transit: "3h 05m in Hong Kong",
    budget: false,
    perks: [
      { icon: "luggage", iconClass: "text-primary", label: "20 kg" },
      { icon: "restaurant", iconClass: "text-primary", label: "Full Meal" },
    ],
    priceTHB: 2806,
    ctaTone: "blue",
  },
];

export const ALLIANCES: AllianceInfo[] = [
  { id: "star", label: "Star Alliance" },
  { id: "oneworld", label: "Oneworld" },
  { id: "skyteam", label: "SkyTeam" },
];

export function formatTHB(value: number): string {
  return `฿${value.toLocaleString("en-US")}`;
}

function hashDate(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 100000;
  }
  return hash;
}

// ราคา mock ต่อช่วงวัน — วันเดียวกันได้ราคาเดิมเสมอ
export function mockDatePrice(departISO: string): number {
  return 1200 + (hashDate(departISO) % 1300);
}

function addDaysISO(iso: string, delta: number): string {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + delta);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shortRange(departISO: string, retISO: string): string {
  const format = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  return `${format(departISO)}-${format(retISO)}`;
}

export type DateRangeOption = {
  depart: string;
  ret: string;
  label: string;
  price: number;
};

// 7 ช่วงวันรอบวันที่เลือก (depart−3 … depart+3) คงจำนวนคืนเท่าเดิม
export function dateRangeOptions(departISO: string, retISO: string): DateRangeOption[] {
  const fallbackDepart = departISO !== "" ? departISO : "2026-10-12";
  const fallbackRet = retISO !== "" ? retISO : "2026-10-15";
  const nights = Math.max(
    1,
    Math.round(
      (new Date(`${fallbackRet}T00:00:00`).getTime() -
        new Date(`${fallbackDepart}T00:00:00`).getTime()) /
        86400000,
    ),
  );
  return Array.from({ length: 7 }, (_, index) => {
    const depart = addDaysISO(fallbackDepart, index - 3);
    const ret = addDaysISO(depart, nights);
    return { depart, ret, label: shortRange(depart, ret), price: mockDatePrice(depart) };
  });
}

export type FlightFilters = {
  nonstop: boolean;
  baggage: boolean;
  hideBudget: boolean;
  alliances: AllianceId[];
  airlines: string[];
};

export function filterFlights(list: ResultFlight[], filters: FlightFilters): ResultFlight[] {
  return list.filter((flight) => {
    if (filters.nonstop && flight.stops !== 0) {
      return false;
    }
    if (filters.baggage && flight.baggage === undefined) {
      return false;
    }
    if (filters.hideBudget && flight.budget) {
      return false;
    }
    if (filters.alliances.length > 0 && !filters.alliances.includes(flight.alliance as AllianceId)) {
      return false;
    }
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.code)) {
      return false;
    }
    return true;
  });
}

export function sortFlights(list: ResultFlight[], sort: SortId): ResultFlight[] {
  const copy = [...list];
  if (sort === "cheapest") {
    copy.sort((a, b) => a.priceTHB - b.priceTHB);
  } else if (sort === "nonstop") {
    copy.sort((a, b) => a.stops - b.stops || a.priceTHB - b.priceTHB);
  }
  return copy;
}
