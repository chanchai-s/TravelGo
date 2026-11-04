"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiRideTiers, type RideServiceType, type RideTier } from "@/app/Api/mainApi";
import { formatMoney, SERVICE_ICON, SERVICE_LABEL } from "@/lib/rideFormat";

const TABS: { key: "ALL" | RideServiceType; label: string }[] = [
  { key: "ALL", label: "ทั้งหมด" },
  { key: "RIDE", label: "โดยสาร" },
  { key: "PARCEL", label: "พัสดุ" },
  { key: "LOGISTICS", label: "ขนย้าย" },
];

const VEHICLE_LABEL: Record<string, string> = {
  MOTORCYCLE: "มอเตอร์ไซค์",
  CAR: "รถยนต์",
  SUV: "SUV",
  VAN: "รถตู้",
  PICKUP: "กระบะ",
  TRUCK_6W: "รถ 6 ล้อ",
  TRUCK_10W: "รถ 10 ล้อ",
  TRAILER: "รถพ่วง",
  REFRIGERATED: "ห้องเย็น",
};

export default function RideFleetPage() {
  const [tiers, setTiers] = useState<RideTier[]>([]);
  const [tab, setTab] = useState<"ALL" | RideServiceType>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRideTiers()
      .then((res) => setTiers((res.data?.data ?? []) as RideTier[]))
      .catch(() => setTiers([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(
    () => (tab === "ALL" ? tiers : tiers.filter((tier) => tier.serviceType === tab)),
    [tiers, tab],
  );

  return (
    <main className="mx-auto w-full max-w-md px-margin pb-24 pt-3 md:max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/ride"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface"
          aria-label="ย้อนกลับ"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </Link>
        <h1 className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
          ประเภทรถและราคา
        </h1>
        <span className="w-10" />
      </div>

      <p className="mt-2 font-body-sm text-body-sm text-tertiary">
        ราคาเริ่มต้นตามประเภทรถ — ราคาจริงคำนวณจากระยะทางและเวลาจริง ไม่มีค่า surge
      </p>

      <div className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-none">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 font-label-md text-label-md transition-all ${
              tab === item.key
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
            progress_activity
          </span>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          {visible.map((tier) => (
            <div
              key={tier.code}
              className="flex items-start gap-3 rounded-2xl bg-surface-container-lowest p-3 shadow-sm"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                <span className="material-symbols-outlined text-[26px]">
                  {SERVICE_ICON[tier.serviceType]}
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="font-label-lg text-label-lg font-bold text-on-surface">{tier.name}</p>
                  <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-label-sm text-[10px] text-on-surface-variant">
                    {SERVICE_LABEL[tier.serviceType]}
                  </span>
                </div>
                <p className="font-label-sm text-label-sm text-tertiary">
                  {VEHICLE_LABEL[tier.vehicleType] ?? tier.vehicleType}
                  {tier.seats ? ` • ${tier.seats} ที่นั่ง` : ""}
                  {tier.maxWeightKg ? ` • สูงสุด ${tier.maxWeightKg.toLocaleString()} กก.` : ""}
                </p>
                <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                  {tier.description ?? ""}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {tier.flatFare ? (
                    <span className="rounded-full bg-secondary-container px-2 py-0.5 font-label-sm text-[10px] font-bold text-on-secondary">
                      เหมา {formatMoney(tier.flatFare)}
                      {tier.includedKm ? ` (รวม ${tier.includedKm} กม.)` : ""}
                    </span>
                  ) : (
                    <>
                      <span className="rounded-full bg-surface-container-low px-2 py-0.5 font-label-sm text-[10px] text-on-surface-variant">
                        เริ่ม {formatMoney(tier.minFare)}
                      </span>
                      <span className="rounded-full bg-surface-container-low px-2 py-0.5 font-label-sm text-[10px] text-on-surface-variant">
                        {formatMoney(tier.perKm)}/กม.
                      </span>
                      <span className="rounded-full bg-surface-container-low px-2 py-0.5 font-label-sm text-[10px] text-on-surface-variant">
                        {formatMoney(tier.perMin)}/นาที
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/ride"
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary-container font-label-lg text-label-lg font-bold text-on-secondary"
      >
        <span className="material-symbols-outlined text-[20px]">directions_car</span>
        เรียกใช้บริการ
      </Link>
    </main>
  );
}
