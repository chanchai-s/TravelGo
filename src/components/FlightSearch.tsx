"use client";

import { useState } from "react";
import {
  DATE_OPTIONS,
  FARE_NOTICE,
  ROUTE_SUMMARY,
  SORT_CHIPS,
  TRIP_TYPES,
  type TripType,
} from "@/data/flights";

export function FlightSearch({
  from,
  to,
  detail,
}: {
  from?: string;
  to?: string;
  detail?: string;
}) {
  const [trip, setTrip] = useState<TripType>("round-trip");
  const [date, setDate] = useState("15-nov");
  const [sort, setSort] = useState("cheapest");

  return (
    <>
      {/* Search Bar Container */}
      <div className="bg-surface-container-lowest px-margin pb-space-md pt-space-sm shadow-sm">
        {/* Trip Type Pills */}
        <div className="mb-space-sm flex items-center justify-between rounded-xl bg-surface-container-low p-1">
          {TRIP_TYPES.map((type) => {
            const active = type.id === trip;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setTrip(type.id)}
                className={`flex-1 rounded-lg px-space-xs py-1.5 text-center font-label-md text-label-md transition-all ${
                  active
                    ? "bg-surface-container-lowest font-bold text-primary shadow-sm"
                    : "text-tertiary hover:text-on-surface"
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Route Card */}
        <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-space-sm">
          <div className="flex min-w-0 flex-1 items-center gap-space-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
              <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-headline-sm text-headline-sm font-extrabold text-on-surface">
                  {from ?? ROUTE_SUMMARY.from}
                </span>
                <span className="material-symbols-outlined shrink-0 text-[16px] text-tertiary">
                  arrow_forward
                </span>
                <span className="truncate font-headline-sm text-headline-sm font-extrabold text-on-surface">
                  {to ?? ROUTE_SUMMARY.to}
                </span>
              </div>
              <span className="truncate font-body-sm text-body-sm text-tertiary">
                {detail ?? ROUTE_SUMMARY.detail}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Edit Route"
            className="ml-space-xs flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-sm transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>
      </div>

      {/* Price Calendar */}
      <div className="w-full bg-surface-container-low px-margin py-space-sm">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
            Cheapest dates nearby
          </span>
          <span className="flex cursor-pointer items-center gap-0.5 font-label-sm text-label-sm font-bold text-primary">
            <span className="material-symbols-outlined text-[14px]">calendar_month</span> Price Grid
          </span>
        </div>
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
          {DATE_OPTIONS.map((option) => {
            const active = option.id === date;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setDate(option.id)}
                className={`relative flex min-w-[70px] flex-col items-center justify-center rounded-xl px-1 py-2 text-center ${
                  active ? "bg-primary text-on-primary shadow-md" : "bg-surface-container-lowest text-on-surface shadow-sm"
                }`}
              >
                {option.lowest === true ? (
                  <span className="absolute -top-1.5 rounded-full bg-secondary-container px-1.5 py-0.2 font-label-sm text-[9px] uppercase leading-3 tracking-wide text-on-secondary">
                    Lowest
                  </span>
                ) : null}
                <span
                  className={`font-label-sm text-label-sm ${active ? "text-on-primary/80" : "text-tertiary"}`}
                >
                  {option.day}
                </span>
                <span
                  className={`mt-0.5 font-label-md text-label-md ${active ? "font-extrabold" : "font-bold"}`}
                >
                  {option.price}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort Chips */}
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto bg-surface px-margin py-space-sm">
        {SORT_CHIPS.map((chip) => {
          const active = chip.id === sort;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setSort(chip.id)}
              className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 shadow-sm ${
                active ? "bg-primary text-on-primary" : "bg-surface-container-lowest text-on-surface"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[16px] ${active ? "" : "text-tertiary"}`}
              >
                {chip.icon}
              </span>
              <span className="font-label-md text-label-md">{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Fare Notice */}
      <div className="mx-margin mb-space-sm mt-1 flex items-center justify-between rounded-2xl bg-surface-container-lowest p-space-sm shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-fixed text-secondary">
            <span className="material-symbols-outlined text-[18px]">trending_down</span>
          </div>
          <div>
            <p className="font-label-md text-label-md font-bold text-on-surface">
              {FARE_NOTICE.title}
            </p>
            <p className="font-body-sm text-body-sm text-tertiary">{FARE_NOTICE.subtitle}</p>
          </div>
        </div>
        <span className="material-symbols-outlined text-[20px] text-tertiary">info</span>
      </div>
    </>
  );
}
