import { create } from "zustand";

export type CabinClass =
  | "Economy"
  | "Economy/premium economy"
  | "Premium economy"
  | "Business/first"
  | "Business"
  | "First";

export type SearchFlightParams = {
  from: string;
  to: string;
  depart: string;
  ret: string;
  adults: number;
  children: number;
  infants: number;
  pax: number;
  cabinClass: CabinClass;
  trip: string;
  bundle: boolean;
};

type FlightState = {
  params: SearchFlightParams;
  setFlightParams: (params: Partial<SearchFlightParams>) => void;
  reset: () => void;
};

const defaultParams: SearchFlightParams = {
  from: "",
  to: "",
  depart: "",
  ret: "",
  adults: 1,
  children: 0,
  infants: 0,
  pax: 1,
  cabinClass: "Economy",
  trip: "round-trip",
  bundle: false,
};

export const useFlightStore = create<FlightState>((set) => ({
  params: defaultParams,

  setFlightParams: (params) =>
    set((state) => ({
      params: {
        ...state.params,
        ...params,
      },
    })),

  reset: () => set({ params: defaultParams }),
}));
