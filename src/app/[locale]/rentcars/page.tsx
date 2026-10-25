"use client";

import { useMemo, useState } from "react";
import { VEHICLES, RENTAL_RULES } from ".@resources/data";

const CATEGORY_FILTERS = [
  { id: "ALL", label: "All Cars" },
  { id: "ECONOMY", label: "Economy" },
  { id: "COMPACT_SUV", label: "Compact SUV" },
  { id: "SEDAN", label: "Sedan" },
  { id: "LUXURY_SEDAN", label: "Luxury Sedan" },
  { id: "VAN", label: "7-Seater Van" },
  { id: "PICKUP_TRUCK", label: "Pickup Truck" },
];

export default function RentCarsPage() {
  const [mode, setMode] = useState<"rental" | "ride">("rental");
  const [category, setCategory] = useState("ALL");
  const [days, setDays] = useState(3);
  const [returnSame, setReturnSame] = useState(true);
  const [insurance, setInsurance] = useState<"BASIC" | "FULL" | "PREMIUM">(
    "FULL",
  );
  const [selected, setSelected] = useState<string | null>(null);

  const vehicles = useMemo(
    () =>
      category === "ALL"
        ? VEHICLES
        : VEHICLES.filter((v) => v.category === category),
    [category],
  );

  const insuranceFee = (cat: string) => {
    const rules = RENTAL_RULES[cat] ?? RENTAL_RULES.SEDAN;
    const opt = rules.insuranceOptions.find((o) => o.type === insurance);
    return (opt?.dailyRate ?? 0) * days;
  };

  const current = VEHICLES.find((v) => v.id === selected) ?? null;

  return (
    <main className="min-h-screen bg-surface font-body-md text-body-md text-on-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container">
              <span className="material-symbols-outlined text-[20px] text-on-primary-container">
                explore
              </span>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold tracking-tight">
              RentCars
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex h-11 w-11 items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[24px]">
                notifications
              </span>
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="material-symbols-outlined text-[18px] text-on-primary">
                person
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-col px-4 pb-8">
        {/* Segmented control */}
        <div className="mt-4 mb-4 flex w-full items-center justify-between rounded-xl bg-surface-container p-1 shadow-sm">
          <button
            onClick={() => setMode("rental")}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2.5 font-headline-sm text-headline-sm transition-all ${
              mode === "rental"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-tertiary"
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              directions_car
            </span>
            Car Rental
          </button>
          <button
            onClick={() => setMode("ride")}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2.5 font-headline-sm text-headline-sm transition-all ${
              mode === "ride"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-tertiary"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              local_taxi
            </span>
            Ride-Hailing
          </button>
        </div>

        {/* Search card */}
        <div className="mb-4 flex w-full flex-col gap-2 rounded-xl bg-surface-container-lowest p-4 shadow-md">
          <div className="flex cursor-pointer items-center gap-2 rounded-lg bg-surface-container p-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
              <span className="material-symbols-outlined text-[18px]">
                flight_land
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
                Pickup &amp; Drop-off
              </span>
              <span className="truncate font-headline-sm text-headline-sm text-on-surface">
                Chiang Mai Intl Airport (CNX)
              </span>
            </div>
            <span className="material-symbols-outlined text-[20px] text-outline">
              expand_more
            </span>
          </div>

          <div className="flex cursor-pointer items-center gap-2 rounded-lg bg-surface-container p-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
              <span className="material-symbols-outlined text-[18px]">
                calendar_month
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
                Dates &amp; Rental Time
              </span>
              <div className="flex flex-wrap items-center gap-1">
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  15 Nov 10:00 - 18 Nov 10:00
                </span>
                <span className="rounded-full bg-primary-container px-2 py-0.5 font-label-sm text-label-sm text-on-primary-container">
                  {days} Days
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 pt-1">
            <button
              onClick={() => setReturnSame((v) => !v)}
              className="flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">
                {returnSame ? "check_circle" : "radio_button_unchecked"}
              </span>
              <span className="font-body-md text-body-md font-medium">
                Return to same location
              </span>
            </button>
            <div className="flex items-center gap-1.5 rounded-full bg-secondary-fixed px-2.5 py-1 text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[14px]">
                shield
              </span>
              <span className="font-label-sm text-label-sm">{insurance}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            {[1, 3, 5, 7].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold ${
                  days === d
                    ? "bg-primary-container text-on-primary-container"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {d} วัน
              </button>
            ))}
            <button
              onClick={() =>
                setInsurance((i) =>
                  i === "BASIC" ? "FULL" : i === "FULL" ? "PREMIUM" : "BASIC",
                )
              }
              className="flex-1 rounded-lg bg-surface-container py-1.5 text-xs font-bold text-on-surface-variant"
            >
              {insurance}
            </button>
          </div>
        </div>

        {/* Quick switch banner */}
        {mode === "rental" && (
          <button
            onClick={() => setMode("ride")}
            className="mb-4 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-primary to-primary-container p-4 text-on-primary shadow-md transition-transform active:scale-[0.99]"
          >
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-on-primary/15">
                <span className="material-symbols-outlined text-[24px]">
                  hail
                </span>
              </div>
              <div className="flex min-w-0 flex-col text-left">
                <span className="truncate font-headline-sm text-headline-sm">
                  Need a quick ride right now?
                </span>
                <span className="truncate font-body-sm text-body-sm text-on-primary/80">
                  Instant city pickups with vetted drivers
                </span>
              </div>
            </div>
            <div className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-on-primary/20">
              <span className="material-symbols-outlined text-[18px] text-on-primary">
                arrow_forward
              </span>
            </div>
          </button>
        )}

        {/* Filter pills */}
        <div className="mb-1 flex w-full items-center gap-1 overflow-x-auto pb-2">
          {CATEGORY_FILTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-label-md text-label-md shadow-sm transition-all ${
                category === c.id
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between pb-1 pt-2">
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
            {vehicles.length} Vehicles Available
          </span>
          <span className="flex cursor-pointer items-center gap-0.5 font-label-md text-label-md text-primary">
            <span className="material-symbols-outlined text-[16px]">tune</span>{" "}
            Filter
          </span>
        </div>

        {/* Vehicle cards */}
        {vehicles.map((v) => {
          const rules = RENTAL_RULES[v.category] ?? RENTAL_RULES.SEDAN;
          const daily = v.dailyRate ?? v.baseRate;
          const total = daily * days + insuranceFee(v.category);
          return (
            <div
              key={v.id}
              className="relative mb-4 flex w-full flex-col gap-2 rounded-xl bg-surface-container-lowest p-4 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <div className="mb-0.5 flex items-center gap-1">
                    <span className="rounded-full bg-primary-fixed px-2 py-0.5 font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-primary-fixed">
                      {rules.insuranceOptions[0]
                        ? v.category.replace("_", " ")
                        : v.category}
                    </span>
                    <span className="font-body-sm text-body-sm text-tertiary">
                      or similar
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    {v.title}
                  </h3>
                </div>
                {v.fleetPartner && (
                  <div className="rounded-md bg-secondary-container px-2.5 py-1 font-headline-sm text-headline-sm font-black tracking-tight text-on-secondary shadow-sm">
                    {v.fleetPartner.name}
                  </div>
                )}
              </div>

              <div className="relative h-40 w-full overflow-hidden rounded-xl bg-surface-container-low">
                {v.images[0] && (
                  <img
                    src={v.images[0].url}
                    alt={v.title}
                    className="h-full w-full object-cover"
                  />
                )}
                {v.badges[0] && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-surface-container-lowest/90 px-2.5 py-1 shadow-sm backdrop-blur-md">
                    <span className="material-symbols-outlined text-[14px] text-secondary-container">
                      {v.badges[0].icon}
                    </span>
                    <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                      {v.badges[0].label}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-1 py-1">
                <div className="flex items-center gap-1.5 rounded-lg bg-surface-container p-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">
                    airline_seat_recline_normal
                  </span>
                  <span className="font-label-sm text-label-sm font-semibold">
                    {v.features.seats} Seats
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-surface-container p-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">
                    luggage
                  </span>
                  <span className="font-label-sm text-label-sm font-semibold">
                    {v.features.bags} Bags
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-surface-container p-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">
                    settings
                  </span>
                  <span className="font-label-sm text-label-sm font-semibold">
                    {v.features.transmission}
                    {v.features.fourWheelDrive ? " 4x4" : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-md text-headline-md font-extrabold text-on-surface">
                      ฿{daily.toLocaleString("en-US")}
                    </span>
                    <span className="font-body-sm text-body-sm text-tertiary">
                      / day
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-tertiary">
                    Total ฿{total.toLocaleString("en-US")} ({days} days)
                  </span>
                </div>
                <button
                  onClick={() => setSelected(v.id)}
                  className="flex h-12 items-center justify-center gap-1 rounded-xl bg-secondary-container px-6 font-label-lg text-label-lg font-bold text-on-secondary shadow-md transition-all hover:opacity-95 active:scale-95"
                >
                  Rent Now
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          );
        })}

        {vehicles.length === 0 && (
          <p className="py-10 text-center text-tertiary">ไม่พบรถในหมวดนี้</p>
        )}

        {/* Trust card */}
        <div className="flex w-full items-center gap-4 rounded-xl bg-surface-container p-4 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
            <span className="material-symbols-outlined text-[26px]">
              verified_user
            </span>
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
              100% Price Match Guarantee
            </span>
            <span className="font-body-sm text-body-sm text-tertiary">
              Zero hidden airport depot fees &amp; 24/7 roadside rescue.
            </span>
          </div>
        </div>
      </div>

      {/* Booking sheet */}
      {current && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-surface-container-lowest p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold">
                  {current.title}
                </h2>
                <p className="font-body-sm text-body-sm text-tertiary">
                  {current.fleetPartner?.name} · {current.features.seats} seats
                  · {current.features.transmission}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-tertiary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {current.images[0] && (
              <img
                src={current.images[0].url}
                alt={current.title}
                className="mb-3 h-40 w-full rounded-xl object-cover"
              />
            )}

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-tertiary">ค่าเช่า ({days} วัน)</span>
                <span className="font-semibold">
                  ฿
                  {(
                    (current.dailyRate ?? current.baseRate) * days
                  ).toLocaleString("en-US")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-tertiary">ประกันภัย ({insurance})</span>
                <span className="font-semibold">
                  ฿{insuranceFee(current.category).toLocaleString("en-US")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-tertiary">เงินประกัน</span>
                <span className="font-semibold">
                  ฿
                  {(
                    RENTAL_RULES[current.category]?.depositAmount ?? 5000
                  ).toLocaleString("en-US")}
                </span>
              </div>
              <div className="mt-2 flex justify-between border-t border-outline-variant pt-2">
                <span className="font-bold">รวม</span>
                <span className="text-lg font-extrabold text-primary">
                  ฿
                  {(
                    (current.dailyRate ?? current.baseRate) * days +
                    insuranceFee(current.category)
                  ).toLocaleString("en-US")}
                </span>
              </div>
            </div>

            <button className="mt-4 w-full rounded-xl bg-primary py-3 font-label-lg text-label-lg font-bold text-on-primary shadow-md active:scale-[0.98]">
              ยืนยันการจอง
            </button>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-surface-container-lowest/90 pb-safe shadow-[0_-2px_12px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-1">
          <a
            href="/th/homepage"
            className="flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-primary-container"
          >
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="font-label-sm text-label-sm font-semibold">
              Home
            </span>
          </a>
          <a
            href="/th/mytrips"
            className="flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-tertiary"
          >
            <span className="material-symbols-outlined text-[24px]">
              confirmation_number
            </span>
            <span className="font-label-sm text-label-sm">My Trips</span>
          </a>
          <a
            href="/th/bookingdetails"
            className="flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-tertiary"
          >
            <span className="material-symbols-outlined text-[24px]">
              favorite
            </span>
            <span className="font-label-sm text-label-sm">Saved</span>
          </a>
          <a
            href="/th/transport"
            className="flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-tertiary"
          >
            <span className="material-symbols-outlined text-[24px]">
              shopping_bag
            </span>
            <span className="font-label-sm text-label-sm">Cart</span>
          </a>
          <a
            href="/th/login"
            className="flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-tertiary"
          >
            <span className="material-symbols-outlined text-[24px]">
              account_circle
            </span>
            <span className="font-label-sm text-label-sm">Profile</span>
          </a>
        </div>
      </nav>
    </main>
  );
}
