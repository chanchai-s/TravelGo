import { create } from "zustand";

interface BookingState {
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  attractionCategory: string;
  mode: "day" | "night";
  setCheckIn: (d: string | null) => void;
  setCheckOut: (d: string | null) => void;
  setGuests: (n: number) => void;
  setAttractionCategory: (c: string) => void;
  setMode: (m: "day" | "night") => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  checkIn: null,
  checkOut: null,
  guests: 2,
  attractionCategory: "all",
  mode: "day",
  setCheckIn: (d) => set({ checkIn: d }),
  setCheckOut: (d) => set({ checkOut: d }),
  setGuests: (n) => set({ guests: n }),
  setAttractionCategory: (c) => set({ attractionCategory: c }),
  setMode: (m) => set({ mode: m }),
}));
