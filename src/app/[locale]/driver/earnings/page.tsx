"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiDriverEarnings } from "@/app/Api/mainApi";
import { DriverGate } from "@/components/ride/DriverGate";
import { EmptyState } from "@/components/ride/EmptyState";
import { formatDateTime, formatMoney, SERVICE_ICON, SERVICE_LABEL } from "@/lib/rideFormat";

type Earning = {
  id: string;
  gross: number;
  commission: number;
  net: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
  job: {
    id: string;
    ref: string;
    serviceType: string;
    pickupAddress: string;
    dropoffAddress: string;
    completedAt: string | null;
  } | null;
};

type EarningsData = {
  items: Earning[];
  totals: { pendingNet: number; settledNet: number };
};

const FILTERS = [
  { key: "ALL", label: "ทั้งหมด" },
  { key: "PENDING", label: "รอโอน" },
  { key: "SETTLED", label: "โอนแล้ว" },
];

function DriverEarningsPageInner() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiDriverEarnings({
        status: status === "ALL" ? undefined : status,
        size: 50,
      });
      setData((res.data?.data ?? res.data) as EarningsData);
    } catch {
      setError("โหลดรายได้ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="mx-auto w-full max-w-md px-margin pb-24 pt-3 md:max-w-3xl">
      <div className="flex items-center justify-between">
        <Link
          href="/driver/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface"
          aria-label="ย้อนกลับ"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </Link>
        <h1 className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
          รายได้
        </h1>
        <span className="w-10" />
      </div>

      <section className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-primary p-4 text-on-primary">
          <p className="font-label-sm text-label-sm text-on-primary/80">รอโอน</p>
          <p className="font-headline-lg text-headline-lg font-extrabold">
            {formatMoney(data?.totals.pendingNet ?? 0)}
          </p>
        </div>
        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
          <p className="font-label-sm text-label-sm text-tertiary">โอนแล้ว</p>
          <p className="font-headline-lg text-headline-lg font-extrabold text-on-surface">
            {formatMoney(data?.totals.settledNet ?? 0)}
          </p>
        </div>
      </section>

      <p className="mt-2 rounded-xl bg-surface-container-low px-3 py-2 font-body-sm text-body-sm text-on-surface-variant">
        รายได้จากการจ่ายเงินสด/โอนกับคนขับจะเข้าสถานะ “โอนแล้ว” ทันที —
        งานที่จ่ายล่วงหน้าจะรอรอบโอนของระบบ
      </p>

      <div className="mt-3 flex gap-1.5">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setStatus(filter.key)}
            className={`rounded-full px-3 py-1.5 font-label-md text-label-md transition-all ${
              status === filter.key
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {loading ? (
          <div className="flex min-h-[25vh] items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
              progress_activity
            </span>
          </div>
        ) : null}

        {!loading && error !== "" ? (
          <EmptyState icon="error" title="โหลดไม่สำเร็จ" description={error} />
        ) : null}

        {!loading && error === "" && (data?.items.length ?? 0) === 0 ? (
          <EmptyState
            icon="payments"
            title="ยังไม่มีรายได้"
            description="รับงานและจบงานเพื่อเริ่มสะสมรายได้"
            action={
              <Link
                href="/driver/dashboard"
                className="rounded-xl bg-primary px-4 py-2 font-label-md text-label-md text-on-primary"
              >
                ไปรับงาน
              </Link>
            }
          />
        ) : null}

        {data?.items.map((item) => (
          <div key={item.id} className="rounded-2xl bg-surface-container-lowest p-3 shadow-sm">
            <div className="flex items-start gap-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-primary">
                <span className="material-symbols-outlined text-[20px]">
                  {SERVICE_ICON[item.job?.serviceType as "RIDE"] ?? "receipt_long"}
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate font-label-md text-label-md font-bold text-on-surface">
                    {item.job?.ref ?? "งาน"}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 font-label-sm text-[10px] font-bold ${
                      item.status === "SETTLED"
                        ? "bg-success-container text-on-success-container"
                        : "bg-warning-container text-on-warning-container"
                    }`}
                  >
                    {item.status === "SETTLED" ? "โอนแล้ว" : "รอโอน"}
                  </span>
                </div>
                <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
                  {item.job
                    ? `${SERVICE_LABEL[item.job.serviceType as "RIDE"] ?? item.job.serviceType} • ${item.job.pickupAddress} → ${item.job.dropoffAddress}`
                    : "-"}
                </p>
                <p className="font-label-sm text-label-sm text-tertiary">
                  {formatDateTime(item.paidAt ?? item.createdAt)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-label-lg text-label-lg font-extrabold text-primary">
                  +{formatMoney(item.net)}
                </p>
                <p className="font-label-sm text-label-sm text-tertiary">
                  gross {formatMoney(item.gross)} • หัก {formatMoney(item.commission)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function DriverEarningsPage() {
  return (
    <DriverGate>
      <DriverEarningsPageInner />
    </DriverGate>
  );
}
