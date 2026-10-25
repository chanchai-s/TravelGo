"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function mergeKeep(keep: string): URLSearchParams {
  return new URLSearchParams(keep);
}

export function ResultSearchBar({
  from,
  to,
  depart,
  ret,
  summary,
  trip,
  keep,
}: {
  from?: string;
  to?: string;
  depart?: string;
  ret?: string;
  summary: string;
  trip: string;
  keep: string;
}) {
  const router = useRouter();
  const [tripType, setTripType] = useState(trip);
  const [nonstop, setNonstop] = useState(
    new URLSearchParams(keep).get("nonstop") === "1",
  );

  const search = () => {
    const params = mergeKeep(keep);
    params.set("trip", tripType);
    if (nonstop) {
      params.set("nonstop", "1");
    } else {
      params.delete("nonstop");
    }
    router.push(`/flight?${params.toString()}`);
  };

  return (
    <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-md">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        {["round-trip", "one-way", "multi-city"].map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-1.5 font-label-md text-label-md text-on-surface"
          >
            <input
              type="radio"
              name="trip-type"
              checked={tripType === option}
              onChange={() => setTripType(option)}
              className="h-4 w-4 accent-primary"
            />
            {option === "round-trip"
              ? "Round-trip"
              : option === "one-way"
                ? "One-way"
                : "Multi-city"}
          </label>
        ))}
        <label className="flex cursor-pointer items-center gap-1.5 font-label-md text-label-md text-on-surface">
          <input
            type="checkbox"
            checked={nonstop}
            onChange={(event) => setNonstop(event.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Nonstop
        </label>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2.5">
          <span className="truncate font-label-md text-label-md font-bold text-on-surface">
            {from ?? "Bangkok"} → {to ?? "Chiang Mai"}
          </span>
        </div>
        <div className="rounded-xl bg-surface-container-low px-3 py-2.5 font-label-md text-label-md font-bold text-on-surface">
          {depart ?? ""} — {ret ?? ""}
        </div>
        <div className="rounded-xl bg-surface-container-low px-3 py-2.5 font-label-md text-label-md font-bold text-on-surface">
          {summary}
        </div>
        <button
          type="button"
          onClick={search}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-label-md text-label-md font-bold text-on-primary shadow-sm transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
          Search
        </button>
      </div>
    </div>
  );
}
