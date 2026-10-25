"use client";

import { useState } from "react";
import {
  ACTIVITIES_SEARCH,
  ACTIVITY_CHIPS,
} from "@/data/activities";

export function ActivityFilters() {
  const [activeChip, setActiveChip] = useState("day-trips");

  return (
    <>
      {/* Smart Interactive Search Input */}
      <div className="relative flex items-center rounded-xl bg-surface-container-lowest px-space-md py-2.5 shadow-sm">
        <span className="material-symbols-outlined mr-2 text-[20px] text-primary">search</span>
        <input
          type="text"
          defaultValue={ACTIVITIES_SEARCH.defaultValue}
          placeholder={ACTIVITIES_SEARCH.placeholder}
          className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
        />
        <button
          type="button"
          aria-label="Filters"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant transition-colors hover:text-primary"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto scroll-smooth py-1">
        {ACTIVITY_CHIPS.map((chip) => {
          const active = chip.id === activeChip;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setActiveChip(chip.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 font-label-md text-label-md transition-colors ${
                active
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[16px] ${active ? "" : "text-tertiary"}`}
              >
                {chip.icon}
              </span>
              {chip.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
