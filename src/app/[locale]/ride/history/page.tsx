"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiMyRideJobs, type RideJob, type RideServiceType } from "@/app/Api/mainApi";
import { useAuthStore } from "@/app/stores/auth.stores";
import { EmptyState } from "@/components/ride/EmptyState";
import {
  formatDateTime,
  formatMoney,
  SERVICE_ICON,
  SERVICE_LABEL,
  STATUS_LABEL,
  STATUS_TONE,
} from "@/lib/rideFormat";

const SERVICE_FILTERS: { key: "ALL" | RideServiceType; label: string }[] = [
  { key: "ALL", label: "ทั้งหมด" },
  { key: "RIDE", label: "โดยสาร" },
  { key: "PARCEL", label: "พัสดุ" },
  { key: "LOGISTICS", label: "ขนย้าย" },
];

const STATUS_FILTERS = [
  { key: "ALL", label: "ทุกสถานะ" },
  { key: "ACTIVE", label: "กำลังดำเนินการ" },
  { key: "COMPLETED", label: "เสร็จสิ้น" },
  { key: "CANCELLED", label: "ยกเลิก" },
];

const ACTIVE_STATUSES = ["REQUESTED", "SEARCHING", "ACCEPTED", "ARRIVING", "ARRIVED", "IN_PROGRESS"];

export default function RideHistoryPage() {
  const token = useAuthStore((state) => state.token);
  const ready = useAuthStore((state) => state.ready);

  const [items, setItems] = useState<RideJob[]>([]);
  const [serviceType, setServiceType] = useState<"ALL" | RideServiceType>("ALL");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) {
      void useAuthStore.getState().init();
    }
  }, [ready]);

  const load = useCallback(async () => {
    if (token === null) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await apiMyRideJobs({
        serviceType: serviceType === "ALL" ? undefined : serviceType,
        status: status === "ALL" || status === "ACTIVE" ? undefined : status,
        size: 40,
      });
      const list = (res.data?.data?.items ?? res.data?.items ?? []) as RideJob[];
      setItems(list);
    } catch {
      setError("โหลดประวัติไม่สำเร็จ");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, serviceType, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    if (status === "ACTIVE") {
      return items.filter((job) => ACTIVE_STATUSES.includes(job.status));
    }
    return items;
  }, [items, status]);

  if (!ready || token === null) {
    return (
      <main className="mx-auto w-full max-w-md px-margin py-6">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
          <span className="material-symbols-outlined text-[40px] text-outline">history</span>
          <p className="font-label-lg text-label-lg font-bold text-on-surface">เข้าสู่ระบบเพื่อดูประวัติ</p>
          <Link
            href="/login?next=/ride/history"
            className="rounded-xl bg-primary px-4 py-2 font-label-md text-label-md text-on-primary"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md px-margin pb-24 pt-3 md:max-w-3xl">
      <div className="flex items-center justify-between">
        <Link
          href="/ride"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface"
          aria-label="ย้อนกลับ"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </Link>
        <h1 className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
          ประวัติการเดินทาง
        </h1>
        <Link
          href="/ride"
          className="flex h-10 items-center gap-1 rounded-full bg-primary px-3 font-label-md text-label-md text-on-primary"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          เรียกใหม่
        </Link>
      </div>

      <div className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-none">
        {SERVICE_FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setServiceType(filter.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 font-label-md text-label-md transition-all ${
              serviceType === filter.key
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-2 flex gap-1.5 overflow-x-auto scrollbar-none">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setStatus(filter.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 font-label-sm text-label-sm transition-all ${
              status === filter.key
                ? "bg-secondary-container text-on-secondary"
                : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
              progress_activity
            </span>
          </div>
        ) : null}

        {!loading && error !== "" ? (
          <EmptyState icon="error" title="โหลดไม่สำเร็จ" description={error} />
        ) : null}

        {!loading && error === "" && visible.length === 0 ? (
          <EmptyState
            icon="route"
            title="ยังไม่มีประวัติ"
            description="เมื่อคุณเรียกใช้บริการ รายการจะแสดงที่นี่"
            action={
              <Link
                href="/ride"
                className="rounded-xl bg-primary px-4 py-2 font-label-md text-label-md text-on-primary"
              >
                เรียกใช้บริการ
              </Link>
            }
          />
        ) : null}

        {visible.map((job) => {
          const active = ACTIVE_STATUSES.includes(job.status);
          return (
            <Link
              key={job.id}
              href={`/ride/${job.id}`}
              className="flex items-start gap-3 rounded-2xl bg-surface-container-lowest p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  active ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {SERVICE_ICON[job.serviceType]}
                </span>
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate font-label-md text-label-md font-bold text-on-surface">
                    {SERVICE_LABEL[job.serviceType]}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 font-label-sm text-[10px] font-bold ${
                      STATUS_TONE[job.status] ?? "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {STATUS_LABEL[job.status] ?? job.status}
                  </span>
                </div>
                <p className="mt-0.5 truncate font-body-sm text-body-sm text-on-surface-variant">
                  {job.pickupAddress} → {job.dropoffAddress}
                </p>
                <p className="font-label-sm text-label-sm text-tertiary">
                  {formatDateTime(job.requestedAt)} • {job.ref}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="font-label-lg text-label-lg font-extrabold text-on-surface">
                  {formatMoney(job.fareFinal ?? job.fareEstimate)}
                </p>
                {job.rating ? (
                  <p className="flex items-center justify-end gap-0.5 font-label-sm text-label-sm text-warning">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    {job.rating.stars}
                  </p>
                ) : null}
                <span className="material-symbols-outlined text-[18px] text-outline">
                  chevron_right
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
