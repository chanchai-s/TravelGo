import { create } from "zustand";
import {
  apiSearchDestinations,
  apiSearchHotels,
  apiSearchStays,
  type SearchHotelParams,
} from "../Api/mainApi";

export type BookingResult = {
  id: string;
  source?: "bookingcom" | "wandergo";
  name: string;
  location: string;
  country: string;
  price: number;
  rating?: number;
  reviews?: number;
  stars?: number;
  tag?: string;
  originalPrice?: number;
  image?: string;
  imageAlt?: string;
  features?: string[];
  distance?: string;
  isNew?: boolean;
};

export function scoreResult(item: BookingResult, median: number): number {
  const rating = item.rating ?? 0;
  const reviews = item.reviews ?? 0;
  const valueBonus = item.price > 0 && item.price < median ? 15 : 0;
  const newBonus = item.isNew === true ? 10 : 0;
  return rating * 20 + Math.log(reviews + 1) * 10 + valueBonus + newBonus;
}

type BookingState = {
  params: SearchHotelParams;
  results: BookingResult[];
  stays: BookingResult[];
  loading: boolean;
  error: string | null;
  setSearchParams: (params: Partial<SearchHotelParams>) => void;
  searchHotels: (params?: Partial<SearchHotelParams>) => Promise<BookingResult[]>;
  searchStays: (params?: Partial<SearchHotelParams>) => Promise<BookingResult[]>;
  searchDestinations: (query: string) => Promise<unknown[]>;
  reset: () => void;
};

const defaultParams: SearchHotelParams = {
  destination: "Bangkok",
  country: "Thailand",
  checkIn: "2026-10-11",
  checkOut: "2026-10-14",
  adults: 2,
  children: 0,
  rooms: 1,
  tab: "hotels",
};

export const useBookingStore = create<BookingState>((set, get) => ({
  params: defaultParams,
  results: [],
  stays: [],
  loading: false,
  error: null,

  setSearchParams: (params) =>
    set((state) => ({
      params: {
        ...state.params,
        ...params,
      },
    })),

  searchHotels: async (params = get().params) => {
    set({ loading: true, error: null });

    try {
      const response = await apiSearchHotels(params);
      const payload = response.data ?? {};
      const items =
        (Array.isArray(payload.items) ? payload.items : null) ??
        (Array.isArray(payload.data) ? payload.data : null) ??
        (Array.isArray(payload.results) ? payload.results : null) ??
        (Array.isArray(payload.hotels) ? payload.hotels : null) ??
        (Array.isArray(payload.items?.hotels) ? payload.items.hotels : null) ??
        [];

      set({
        results: items.map((item: BookingResult) => ({ ...item, source: "bookingcom" as const })),
        loading: false,
        error: null,
      });

      return items;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to search hotels";

      set({
        loading: false,
        error: message,
        results: [],
      });

      return [];
    }
  },

  searchStays: async (params = get().params) => {
    try {
      // ส่งตัวกรองทั้งหมดไปให้ backend คัดกรอง/ตัดประกาศที่ห้องเต็ม
      const response = await apiSearchStays({
        destination: params.destination,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        stars: params.stars,
        propertyType: params.propertyType,
        amenity: params.amenity,
        sort: params.sort,
        page: params.page,
        size: params.size,
      });
      const payload = (response.data ?? {}) as { items?: BookingResult[] };
      const items = Array.isArray(payload.items) ? payload.items : [];
      set({ stays: items });
      return items;
    } catch {
      set({ stays: [] });
      return [];
    }
  },

  searchDestinations: async (query) => {
    try {
      const response = await apiSearchDestinations(query);
      const payload = response.data ?? {};
      const items =
        (Array.isArray(payload.items) ? payload.items : null) ??
        (Array.isArray(payload.data) ? payload.data : null) ??
        (Array.isArray(payload.results) ? payload.results : null) ??
        [];
      return items;
    } catch {
      return [];
    }
  },

  reset: () =>
    set({
      params: defaultParams,
      results: [],
      stays: [],
      loading: false,
      error: null,
    }),
}));
