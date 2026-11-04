"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  apiAdminCancelRide,
  apiAdminRides,
  apiAdminSosList,
  type RideJob,
  type RideServiceType,
} from "@/app/Api/mainApi";
import { AdminGate } from "@/components/ride/AdminGate";
import { BottomSheet } from "@/components/ride/BottomSheet";
import { EmptyState } from "@/components/ride/EmptyState";
import {
  formatDateTime,
  formatMoney,
  SERVICE_ICON,
  SERVICE_LABEL,
  STATUS_LABEL,
  STATUS_TONE,
} from "@/lib/rideFormat";

const STATUS_TABS = [
  { key: "ALL", label: "ทั้งหมด" },
  { key: "SEARCHING", label: "หาคนขับ" },
  { key: "ACCEPTED", label: "รับงาน" },
  { key: "IN_PROGRESS", label: "เดินทาง" },
  { key: "COMPLETED", label: "เสร็จสิ้น" },
  { key: "CANCELLED", label: "ยกเลิก" },
];

const SERVICE_TABS: { key: "ALL" | RideServiceType; label: string }[] = [
  { key: "ALL", label: "ทุกบริการ" },
  { key: "RIDE", label: "โดยสาร" },
  { key: "PARCEL", label: "พัสดุ" },
  { key: "LOGISTICS", label: "ขนย้าย" },
];

const ACTIVE_STATUSES = ["SEARCHING", "ACCEPTED", "ARRIVING", "ARRIVED", "IN_PROGRESS"];

function messageOf(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message;
  return typeof message === "string" && message !== "" ? message : fallback;
}

function AdminRidesPageInner() {
  const [items, setItems] = useState<RideJob[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("ALL");
  const [serviceType, setServiceType] = useState<"ALL" | RideServiceType>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [cancelTarget, setCancelTarget] = useState<RideJob | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [openSos, setOpenSos] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiAdminRides({
        status: status === "ALL" ? undefined : status,
        serviceType: serviceType === "ALL" ? undefined : serviceType,
        size: 50,
      });
      const data = res.data?.data ?? res.data;
      setItems((data?.items ?? []) as RideJob[]);
      setTotal(Number(data?.total ?? 0));
    } catch (err: unknown) {
      setError(messageOf(err, "โหลดรายการงานไม่สำเร็จ"));
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [status, serviceType]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    apiAdminSosList("OPEN")
      .then((res) => setOpenSos(Number(res.data?.data?.total ?? 0)))
      .catch(() => undefined);
  }, []);

  const cancel = async () => {
    if (!cancelTarget) {
      return;
    }
    setBusy(cancelTarget.id);
    setError("");
    try {
      await apiAdminCancelRide(cancelTarget.id, cancelReason.trim() || "แอดมินยกเลิก");
      setCancelTarget(null);
      setCancelReason("");
      await load();
    } catch (err: unknown) {
      setError(messageOf(err, "ยกเลิกงานไม่สำเร็จ"));
    } finally {
      setBusy("");
    }
  };

  const activeCount = items.filter((job) => ACTIVE_STATUSES.includes(job.status)).length;

  return (
    <main className="mx-auto w-full max-w-md px-margin pb-24 pt-3 md:max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
            Ride Ops Console
          </p>
          <h1 className="font-headline-lg text-headline-lg font-extrabold text-on-surface">
            จัดการงาน
          </h1>
        </div>
        <Link
          href="/admin/rides/sos"
          className={`relative flex h-11 items-center gap-1.5 rounded-full px-3 font-label-md text-label-md font-bold ${
            openSos > 0 ? "bg-error text-on-error" : "bg-surface-container-low text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">emergency</span>
          SOS
          {openSos > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1 font-label-sm text-[10px]">
              {openSos}
            </span>
          ) : null}
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-surface-container-lowest p-3 text-center shadow-sm">
          <p className="font-label-sm text-label-sm text-tertiary">ทั้งหมด</p>
          <p className="font-headline-sm text-headline-sm font-extrabold text-on-surface">{total}</p>
        </div>
        <div className="rounded-2xl bg-surface-container-lowest p-3 text-center shadow-sm">
          <p className="font-label-sm text-label-sm text-tertiary">กำลังทำ</p>
          <p className="font-headline-sm text-headline-sm font-extrabold text-primary">{activeCount}</p>
        </div>
        <Link
          href="/admin/rides/drivers"
          className="flex flex-col items-center justify-center rounded-2xl bg-secondary-container p-3 text-on-secondary"
        >
          <span className="material-symbols-outlined text-[20px]">badge</span>
          <span className="font-label-sm text-label-sm font-bold">อนุมัติคนขับ</span>
        </Link>
      </div>

      <div className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-none">
        {SERVICE_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setServiceType(tab.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 font-label-md text-label-md transition-all ${
              serviceType === tab.key
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-2 flex gap-1.5 overflow-x-auto scrollbar-none">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatus(tab.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 font-label-sm text-label-sm transition-all ${
              status === tab.key
                ? "bg-secondary-container text-on-secondary"
                : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error !== "" ? (
        <p className="mt-2 rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">
          {error}
        </p>
      ) : null}

      <div className="mt-3 flex flex-col gap-2">
        {loading ? (
          <div className="flex min-h-[25vh] items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
              progress_activity
            </span>
          </div>
        ) : null}

        {!loading && items.length === 0 ? (
          <EmptyState icon="inbox" title="ไม่มีงานในเงื่อนไขนี้" />
        ) : null}

        {items.map((job) => {
          const active = ACTIVE_STATUSES.includes(job.status);
          return (
            <div key={job.id} className="rounded-2xl bg-surface-container-lowest p-3 shadow-sm">
              <div className="flex items-start gap-2">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    active ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {SERVICE_ICON[job.serviceType]}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="font-label-md text-label-md font-bold text-on-surface">{job.ref}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 font-label-sm text-[10px] font-bold ${
                        STATUS_TONE[job.status] ?? "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {STATUS_LABEL[job.status] ?? job.status}
                    </span>
                    <span className="rounded-full bg-surface-container-low px-2 py-0.5 font-label-sm text-[10px] text-on-surface-variant">
                      {SERVICE_LABEL[job.serviceType]}
                    </span>
                    {job.sosEvents && job.sosEvents.length > 0 ? (
                      <span className="rounded-full bg-error px-2 py-0.5 font-label-sm text-[10px] font-bold text-on-error">
                        SOS
                      </span>
                    ) : null}
                  </div>
                  <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
                    {job.pickupAddress} → {job.dropoffAddress}
                  </p>
                  <p className="font-label-sm text-label-sm text-tertiary">
                    {formatDateTime(job.requestedAt)} •{" "}
                    {job.rider?.name ?? "ผู้โดยสาร"} → {job.driver?.name ?? "ยังไม่มีคนขับ"}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="rounded-full bg-primary-fixed px-2 py-0.5 font-label-sm text-[10px] font-bold text-on-primary-fixed-variant">
                      {formatMoney(job.fareFinal ?? job.fareEstimate)}
                    </span>
                    <span className="rounded-full bg-surface-container-low px-2 py-0.5 font-label-sm text-[10px] text-on-surface-variant">
                      {job.paymentTiming === "PREPAY" ? "จ่ายล่วงหน้า" : "จ่ายกับคนขับ"} •{" "}
                      {job.paymentStatus}
                    </span>
                    <span className="rounded-full bg-surface-container-low px-2 py-0.5 font-label-sm text-[10px] text-on-surface-variant">
                      {job.distanceKm} กม.
                    </span>
                  </div>
                </div>
                <Link
                  href={`/ride/${job.id}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant"
                  aria-label="ดูงาน"
                >
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </Link>
              </div>

              {active ? (
                <button
                  type="button"
                  onClick={() => {
                    setCancelTarget(job);
                    setCancelReason("");
                  }}
                  disabled={busy === job.id}
                  className="mt-2 h-10 w-full rounded-xl bg-error-container font-label-md text-label-md font-bold text-on-error-container disabled:opacity-60"
                >
                  {busy === job.id ? "กำลังยกเลิก..." : "ยกเลิกงาน (แอดมิน)"}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>

      <BottomSheet
        open={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        title="ยกเลิกงาน"
        subtitle={cancelTarget?.ref}
        footer={
          <button
            type="button"
            onClick={() => void cancel()}
            disabled={busy !== ""}
            className="h-12 w-full rounded-xl bg-error font-label-lg text-label-lg font-bold text-on-error disabled:opacity-60"
          >
            {busy !== "" ? "กำลังยกเลิก..." : "ยืนยันยกเลิก"}
          </button>
        }
      >
        <label className="flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant">เหตุผล</span>
          <textarea
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
            rows={3}
            placeholder="เช่น ผู้โดยสารขอยกเลิกผ่านสายด่วน"
            className="rounded-xl bg-surface-container-low px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none"
          />
        </label>
      </BottomSheet>
    </main>
  );
}

export default function AdminRidesPage() {
  return (
    <AdminGate>
      <AdminRidesPageInner />
    </AdminGate>
  );
}
