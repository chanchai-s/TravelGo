"use client";

import type { RideServiceType, RideTier } from "@/app/Api/mainApi";
import { estimateTierFare, formatMoney } from "@/lib/rideFormat";

const VEHICLE_ICON: Record<string, string> = {
  MOTORCYCLE: "two_wheeler",
  CAR: "directions_car",
  SUV: "airport_shuttle",
  VAN: "airport_shuttle",
  PICKUP: "local_shipping",
  TRUCK_6W: "local_shipping",
  TRUCK_10W: "local_shipping",
  TRAILER: "local_shipping",
  REFRIGERATED: "ac_unit",
};

export function TierPicker({
  tiers,
  value,
  onChange,
  serviceType,
  distanceKm,
  durationMin,
}: {
  tiers: RideTier[];
  value: string;
  onChange: (code: string) => void;
  serviceType: RideServiceType;
  distanceKm: number;
  durationMin: number;
}) {
  if (tiers.length === 0) {
    return (
      <p className="rounded-xl bg-surface-container-low p-4 font-body-sm text-body-sm text-tertiary">
        ยังไม่มีชั้นราคาที่เปิดให้บริการ
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tiers.map((tier) => {
        const active = tier.code === value;
        const price = estimateTierFare(tier, distanceKm, durationMin, serviceType);
        return (
          <button
            key={tier.code}
            type="button"
            onClick={() => onChange(tier.code)}
            className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all ${
              active
                ? "border-primary bg-primary-fixed/40 shadow-sm"
                : "border-outline-variant/50 bg-surface-container-lowest hover:border-primary/40"
            }`}
          >
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                active ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-[26px]">
                {VEHICLE_ICON[tier.vehicleType] ?? "directions_car"}
              </span>
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-label-lg text-label-lg font-bold text-on-surface">{tier.name}</span>
                {tier.code === "EXECUTIVE" ? (
                  <span className="rounded-full bg-secondary-container px-2 py-0.5 font-label-sm text-[10px] text-on-secondary">
                    แนะนำ
                  </span>
                ) : null}
                {serviceType === "LOGISTICS" ? (
                  <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-label-sm text-[10px] text-on-surface-variant">
                    เหมาคัน
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 truncate font-body-sm text-body-sm text-tertiary">
                {tier.description ?? "พร้อมให้บริการ"}
                {tier.seats ? ` • ${tier.seats} ที่นั่ง` : ""}
                {tier.maxWeightKg ? ` • สูงสุด ${tier.maxWeightKg.toLocaleString()} กก.` : ""}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-label-lg text-label-lg font-extrabold text-on-surface">{formatMoney(price)}</p>
              <p className="font-label-sm text-label-sm text-tertiary">
                {serviceType === "LOGISTICS" ? "ราคาเหมา" : "ประมาณ"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default TierPicker;
