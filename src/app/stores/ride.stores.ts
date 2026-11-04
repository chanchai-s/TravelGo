"use client";

import { create } from "zustand";

export type RideMessage = {
  id: string;
  jobId: string;
  senderId: string;
  text: string | null;
  attachmentUrl: string | null;
  createdAt: string;
};

type RideState = {
  driverPos: { lat: number; lng: number } | null;
  messages: RideMessage[];
  setDriverPos: (pos: { lat: number; lng: number } | null) => void;
  setMessages: (messages: RideMessage[]) => void;
  addMessage: (message: RideMessage) => void;
  reset: () => void;
};

export const useRideStore = create<RideState>((set) => ({
  driverPos: null,
  messages: [],
  setDriverPos: (driverPos) => set({ driverPos }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) =>
      state.messages.some((entry) => entry.id === message.id)
        ? state
        : { messages: [...state.messages, message] },
    ),
  reset: () => set({ driverPos: null, messages: [] }),
}));

export default useRideStore;
