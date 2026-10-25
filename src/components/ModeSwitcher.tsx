"use client";

import { useBookingStore } from "@/stores/bookingStore";

export default function ModeSwitcher() {
  const mode = useBookingStore((s) => s.mode);
  const setMode = useBookingStore((s) => s.setMode);
  return (
    <div className="inline-flex rounded-full border border-[#E2E8F0] overflow-hidden">
      <button
        onClick={() => setMode("day")}
        className={`px-4 py-1.5 text-sm ${mode === "day" ? "bg-[#00A8E8] text-white" : "bg-white text-[#0A2540]"}`}
      >
        Morning
      </button>
      <button
        onClick={() => setMode("night")}
        className={`px-4 py-1.5 text-sm ${mode === "night" ? "bg-[#0A2540] text-white" : "bg-white text-[#0A2540]"}`}
      >
        Sunset
      </button>
    </div>
  );
}
