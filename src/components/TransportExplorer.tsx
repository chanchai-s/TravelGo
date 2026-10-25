"use client";

import { useState } from "react";
import {
  INVENTORY,
  RIDE_BANNER,
  TRANSPORT_SEARCH,
  VEHICLES,
  VEHICLE_FILTERS,
  type TransportMode,
  type VendorTone,
  type Vehicle,
} from "@/data/transport";

function vendorClass(tone: VendorTone): string {
  switch (tone) {
    case "red":
      return "bg-error text-on-error";
    case "yellow":
      return "bg-yellow-400 text-on-surface";
    case "coral":
      return "bg-secondary-container text-on-secondary";
  }
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="relative flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="mb-0.5 flex items-center gap-space-xs">
            <span className="rounded-full bg-primary-fixed px-2 py-0.5 font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-primary-fixed">
              {vehicle.category}
            </span>
            <span className="font-body-sm text-body-sm text-tertiary">or similar</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface">{vehicle.name}</h3>
        </div>
        <div
          className={`rounded-md px-2.5 py-1 font-headline-sm text-headline-sm font-black tracking-tight shadow-sm ${vendorClass(vehicle.vendorTone)}`}
        >
          {vehicle.vendor}
        </div>
      </div>

      <div className="relative h-40 overflow-hidden rounded-xl bg-surface-container-low">
        <img alt={vehicle.imageAlt} src={vehicle.image} className="h-full w-full object-cover" />
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-surface-container-lowest/90 px-2.5 py-1 shadow-sm backdrop-blur-md">
          <span className={`material-symbols-outlined text-[14px] ${vehicle.overlayIconClass}`}>
            {vehicle.overlayIcon}
          </span>
          <span className="font-label-sm text-label-sm font-semibold text-on-surface">
            {vehicle.overlayBadge}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-space-xs py-space-xs">
        {vehicle.specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-center gap-1.5 rounded-lg bg-surface-container-low p-2 text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">
              {spec.icon}
            </span>
            <span className="font-label-sm text-label-sm font-semibold">{spec.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-space-xs">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="font-headline-md text-headline-md font-extrabold text-on-surface">
              {vehicle.pricePerDay}
            </span>
            <span className="font-body-sm text-body-sm text-tertiary">/ day</span>
          </div>
          <span className="font-body-sm text-body-sm text-tertiary">{vehicle.totalPrice}</span>
        </div>
        <button
          type="button"
          className="flex h-12 items-center justify-center gap-1 rounded-xl bg-secondary-container px-6 font-label-lg text-label-lg font-bold text-on-secondary shadow-md transition-all hover:opacity-95 active:scale-95"
        >
          Rent Now
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

export function TransportExplorer() {
  const [mode, setMode] = useState<TransportMode>("rental");
  const [filter, setFilter] = useState(VEHICLE_FILTERS[0] ?? "All Cars");

  return (
    <>
      {/* Segmented Mode Switcher */}
      <div className="mb-space-md mt-space-sm flex w-full items-center justify-between rounded-xl bg-surface-container p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setMode("rental")}
          className={`flex flex-1 items-center justify-center gap-space-xs rounded-lg py-2.5 font-headline-sm text-headline-sm transition-all ${
            mode === "rental"
              ? "bg-surface-container-lowest text-primary shadow-sm"
              : "text-tertiary hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">directions_car</span>
          <span>Car Rental</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("ride")}
          className={`flex flex-1 items-center justify-center gap-space-xs rounded-lg py-2.5 font-headline-sm text-headline-sm transition-all ${
            mode === "ride"
              ? "bg-surface-container-lowest text-primary shadow-sm"
              : "text-tertiary hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">local_taxi</span>
          <span>Ride-Hailing</span>
        </button>
      </div>

      {/* Search Card */}
      <div className="mb-space-md flex w-full flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-md">
        <div className="flex cursor-pointer items-center gap-space-sm rounded-lg bg-surface-container-low p-space-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
            <span className="material-symbols-outlined text-[18px]">flight_land</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
              {TRANSPORT_SEARCH.pickupLabel}
            </span>
            <span className="truncate font-headline-sm text-headline-sm text-on-surface">
              {TRANSPORT_SEARCH.pickupValue}
            </span>
          </div>
          <span className="material-symbols-outlined text-[20px] text-outline">expand_more</span>
        </div>

        <div className="flex cursor-pointer items-center gap-space-sm rounded-lg bg-surface-container-low p-space-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
              {TRANSPORT_SEARCH.datesLabel}
            </span>
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                {TRANSPORT_SEARCH.datesValue}
              </span>
              <span className="rounded-full bg-primary-container px-2 py-0.5 font-label-sm text-label-sm text-on-primary-container">
                {TRANSPORT_SEARCH.durationBadge}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-space-xs pt-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
            <span className="font-body-md text-body-md font-medium text-on-surface">
              {TRANSPORT_SEARCH.returnSame}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-secondary-fixed px-2.5 py-1 text-on-secondary-fixed">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            <span className="font-label-sm text-label-sm">{TRANSPORT_SEARCH.coverBadge}</span>
          </div>
        </div>
      </div>

      {/* Quick Switch Banner */}
      <button
        type="button"
        onClick={() => setMode("ride")}
        className="mb-space-md flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-primary to-primary-container p-space-md text-on-primary shadow-md transition-transform active:scale-[0.99]"
      >
        <div className="flex min-w-0 items-center gap-space-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-on-primary/15 text-on-primary">
            <span className="material-symbols-outlined text-[24px]">hail</span>
          </div>
          <div className="flex min-w-0 flex-col text-left">
            <span className="truncate font-headline-sm text-headline-sm text-on-primary">
              {RIDE_BANNER.title}
            </span>
            <span className="truncate font-body-sm text-body-sm text-on-primary/80">
              {RIDE_BANNER.subtitle}
            </span>
          </div>
        </div>
        <div className="ml-space-xs flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-on-primary/20">
          <span className="material-symbols-outlined text-[18px] text-on-primary">
            arrow_forward
          </span>
        </div>
      </button>

      {/* Filter Pills */}
      <div className="-mx-margin mb-space-sm flex w-full items-center gap-space-xs overflow-x-auto px-margin pb-space-sm">
        {VEHICLE_FILTERS.map((pill) => {
          const active = pill === filter;
          return (
            <button
              key={pill}
              type="button"
              onClick={() => setFilter(pill)}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-label-md text-label-md shadow-sm transition-all ${
                active
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {pill}
            </button>
          );
        })}
      </div>

      {/* Inventory Header */}
      <div className="mb-space-sm flex items-center justify-between pt-space-xs">
        <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
          {INVENTORY.count}
        </span>
        <span className="flex cursor-pointer items-center gap-0.5 font-label-md text-label-md text-primary">
          <span className="material-symbols-outlined text-[16px]">tune</span> Filter
        </span>
      </div>

      {/* Vehicle Cards */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {VEHICLES.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </>
  );
}
