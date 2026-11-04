"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  apiDriverAcceptJob,
  apiDriverAvailableJobs,
  apiDriverMe,
  apiDriverSetOnline,
  apiDriverUpdateLocation,
  type RideJob,
  type RideServiceType,
} from "@/app/Api/mainApi";
import { DriverGate } from "@/components/ride/DriverGate";
import { EmptyState } from "@/components/ride/EmptyState";
import {
  formatDateTime,
  formatMoney,
  SERVICE_ICON,
  SERVICE_LABEL,
} from "@/lib/rideFormat";

const SERVICE_TABS: { key: "ALL" | RideServiceType; label: string }[] = [
  { key: "ALL", label: "ทุกงาน" },
  { key: "RIDE", label: "โดยสาร" },
  { key: "PARCEL", label: "พัสดุ" },
  { key: "LOGISTICS", label: "ขนย้าย" },
];

type DriverMe = {
  profile: { isOnline: boolean; status: string; totalTrips: number; rating: number };
  activeJob: RideJob | null;
  stats: { pendingNet: number; settledNet: number; todayNet: number; todayTrips: number };
};

function messageOf(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message;
  return typeof message === "string" && message !== "" ? message : fallback;
}

function getPosition(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || navigator.geolocation === undefined) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  });
}

function DriverDashboardPageInner() {
  const [me, setMe] = useState<DriverMe | null>(null);
  const [jobs, setJobs] = useState<RideJob[]>([]);
  const [serviceType, setServiceType] = useState<"ALL" | RideServiceType>("ALL");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState("");

  const loadMe = useCallback(async () => {
    try {
      const res = await apiDriverMe();
      setMe((res.data?.data ?? res.data) as DriverMe);
    } catch {
      // หน้า Gate จัดการเรื่องสิทธิ์อยู่แล้ว
    }
  }, []);

  const loadJobs = useCallback(async () => {
    try {
      const res = await apiDriverAvailableJobs(serviceType === "ALL" ? undefined : serviceType);
      setJobs((res.data?.data ?? []) as RideJob[]);
    } catch {
      setJobs([]);
    }
  }, [serviceType]);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  useEffect(() => {
    if (me?.profile.isOnline !== true || me?.activeJob) {
      return;
    }
    void loadJobs();
    const timer = setInterval(() => {
      void loadJobs();
    }, 10000);
    return () => clearInterval(timer);
  }, [me?.profile.isOnline, me?.activeJob, loadJobs]);

  // ส่งพิกัดเป็นระยะเมื่อเปิดรับงาน (ให้ผู้โดยสารเห็นรถใกล้ ๆ)
  useEffect(() => {
    if (me?.profile.isOnline !== true) {
      return;
    }
    const push = async () => {
      const point = await getPosition();
      if (point) {
        await apiDriverUpdateLocation({ ...point, jobId: me?.activeJob?.id }).catch(() => undefined);
      }
    };
    void push();
    const timer = setInterval(() => {
      void push();
    }, 20000);
    return () => clearInterval(timer);
  }, [me?.profile.isOnline, me?.activeJob?.id]);

  const toggleOnline = async () => {
    if (!me) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      const next = !me.profile.isOnline;
      const point = next ? await getPosition() : null;
      await apiDriverSetOnline({
        isOnline: next,
        ...(point ? { lat: point.lat, lng: point.lng } : {}),
      });
      await loadMe();
      if (next) {
        await loadJobs();
      }
    } catch (err: unknown) {
      setError(messageOf(err, "เปลี่ยนสถานะไม่สำเร็จ"));
    } finally {
      setBusy(false);
    }
  };

  const accept = async (job: RideJob) => {
    setAccepting(job.id);
    setError("");
    try {
      await apiDriverAcceptJob(job.id);
      await loadMe();
      setJobs((current) => current.filter((item) => item.id !== job.id));
    } catch (err: unknown) {
      setError(messageOf(err, "รับงานไม่สำเร็จ"));
    } finally {
      setAccepting("");
    }
  };

  const online = me?.profile.isOnline ?? false;

  return (
    <main className="mx-auto w-full max-w-md px-margin pb-24 pt-3 md:max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
            WanderGo Driver
          </p>
          <h1 className="font-headline-lg text-headline-lg font-extrabold text-on-surface">
            รับงาน
          </h1>
        </div>
        <Link
          href="/driver/status"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant"
          aria-label="โปรไฟล์คนขับ"
        >
          <span className="material-symbols-outlined text-[22px]">person</span>
        </Link>
      </div>

      <section className="mt-3 flex items-center justify-between rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
        <div>
          <p className="font-label-md text-label-md font-bold text-on-surface">
            {online ? "เปิดรับงานอยู่" : "ปิดรับงาน"}
          </p>
          <p className="font-body-sm text-body-sm text-tertiary">
            {online ? "งานใหม่จะขึ้นอัตโนมัติทุก 10 วินาที" : "เปิดรับงานเพื่อดูงานใกล้คุณ"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void toggleOnline()}
          disabled={busy}
          aria-pressed={online}
          className={`relative h-8 w-14 rounded-full transition-colors disabled:opacity-50 ${
            online ? "bg-success" : "bg-outline-variant"
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
              online ? "left-7" : "left-1"
            }`}
          />
        </button>
      </section>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-surface-container-lowest p-3 text-center shadow-sm">
          <p className="font-label-sm text-label-sm text-tertiary">วันนี้</p>
          <p className="font-headline-sm text-headline-sm font-extrabold text-primary">
            {formatMoney(me?.stats.todayNet ?? 0)}
          </p>
        </div>
        <div className="rounded-2xl bg-surface-container-lowest p-3 text-center shadow-sm">
          <p className="font-label-sm text-label-sm text-tertiary">รอโอน</p>
          <p className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
            {formatMoney(me?.stats.pendingNet ?? 0)}
          </p>
        </div>
        <div className="rounded-2xl bg-surface-container-lowest p-3 text-center shadow-sm">
          <p className="font-label-sm text-label-sm text-tertiary">เที่ยวรวม</p>
          <p className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
            {me?.profile.totalTrips ?? 0}
          </p>
        </div>
      </div>

      {me?.activeJob ? (
        <Link
          href={`/driver/job/${me.activeJob.id}`}
          className="mt-3 flex items-center gap-3 rounded-2xl bg-primary p-4 text-on-primary shadow-sm"
        >
          <span className="material-symbols-outlined text-[26px]">local_taxi</span>
          <span className="min-w-0 flex-1">
            <span className="block font-label-md text-label-md font-bold">
              งานที่กำลังทำ — {me.activeJob.ref}
            </span>
            <span className="block truncate font-body-sm text-body-sm text-on-primary/85">
              {me.activeJob.pickupAddress} → {me.activeJob.dropoffAddress}
            </span>
          </span>
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </Link>
      ) : null}

      {error !== "" ? (
        <p className="mt-3 rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">
          {error}
        </p>
      ) : null}

      {!me?.activeJob ? (
        <>
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

          <div className="mt-3 flex flex-col gap-2">
            {!online ? (
              <EmptyState
                icon="wifi_off"
                title="ยังไม่เปิดรับงาน"
                description="เปิดสวิตช์ด้านบนเพื่อดูงานที่อยู่ใกล้คุณ"
              />
            ) : jobs.length === 0 ? (
              <EmptyState
                icon="radar"
                title="ยังไม่มีงานใหม่"
                description="ระบบจะอัปเดตอัตโนมัติเมื่อมีงานเข้ามา"
              />
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl bg-surface-container-lowest p-3 shadow-sm"
                >
                  <div className="flex items-start gap-2">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                      <span className="material-symbols-outlined text-[22px]">
                        {SERVICE_ICON[job.serviceType]}
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="font-label-md text-label-md font-bold text-on-surface">
                          {SERVICE_LABEL[job.serviceType]}
                        </p>
                        {job.pickupDistanceKm !== undefined && job.pickupDistanceKm !== null ? (
                          <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-label-sm text-[10px] text-on-surface-variant">
                            ห่าง {job.pickupDistanceKm} กม.
                          </span>
                        ) : null}
                        <span className="ml-auto font-label-lg text-label-lg font-extrabold text-primary">
                          {formatMoney(job.fareEstimate)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate font-body-sm text-body-sm text-on-surface-variant">
                        {job.pickupAddress}
                      </p>
                      <p className="truncate font-body-sm text-body-sm text-tertiary">
                        → {job.dropoffAddress}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className="rounded-full bg-surface-container-low px-2 py-0.5 font-label-sm text-[10px] text-on-surface-variant">
                          {job.distanceKm} กม. • ~{job.durationMin} นาที
                        </span>
                        <span className="rounded-full bg-surface-container-low px-2 py-0.5 font-label-sm text-[10px] text-on-surface-variant">
                          {job.tier?.name ?? job.tierCode}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 font-label-sm text-[10px] font-bold ${
                            job.paymentTiming === "PREPAY"
                              ? "bg-success-container text-on-success-container"
                              : "bg-warning-container text-on-warning-container"
                          }`}
                        >
                          {job.paymentTiming === "PREPAY" ? "จ่ายล่วงหน้าแล้ว" : "เก็บเงินปลายทาง"}
                        </span>
                      </div>
                      {job.parcel ? (
                        <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
                          พัสดุ {job.parcel.weightKg} กก. • {job.parcel.sizeTier}
                          {job.parcel.codAmount > 0 ? ` • COD ${formatMoney(job.parcel.codAmount)}` : ""}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void accept(job)}
                    disabled={accepting === job.id}
                    className="mt-2 h-11 w-full rounded-xl bg-secondary-container font-label-md text-label-md font-bold text-on-secondary disabled:opacity-60"
                  >
                    {accepting === job.id ? "กำลังรับงาน..." : "รับงานนี้"}
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      ) : null}

      <div className="mt-3 flex items-center justify-between rounded-2xl bg-surface-container-low px-3 py-2">
        <span className="font-body-sm text-body-sm text-tertiary">
          อัปเดตล่าสุด {formatDateTime(new Date().toISOString())}
        </span>
        <button
          type="button"
          onClick={() => {
            void loadMe();
            void loadJobs();
          }}
          className="flex items-center gap-1 font-label-sm text-label-sm font-bold text-primary"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          รีเฟรช
        </button>
      </div>
    </main>
  );
}

export default function DriverDashboardPage() {
  return (
    <DriverGate>
      <DriverDashboardPageInner />
    </DriverGate>
  );
}
