"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  apiAdminRejectDriver,
  apiAdminReviewDriverDocument,
  apiAdminRideDrivers,
  apiAdminSetDriverCommission,
  apiAdminVerifyDriver,
} from "@/app/Api/mainApi";
import { AdminGate } from "@/components/ride/AdminGate";
import { BottomSheet } from "@/components/ride/BottomSheet";
import { EmptyState } from "@/components/ride/EmptyState";

type Document = { id: string; type: string; status: string; url: string; createdAt: string };
type Vehicle = { id: string; type: string; plateNo: string; brand: string | null; model: string | null };
type Driver = {
  id: string;
  status: string;
  license: string;
  serviceTypes: unknown;
  tierCodes: unknown;
  commissionRate: number | null;
  rating: number;
  totalTrips: number;
  isOnline: boolean;
  rejectedReason: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; phone: string | null; createdAt: string };
  vehicles: Vehicle[];
  documents: Document[];
};

const DOC_LABEL: Record<string, string> = {
  ID_CARD: "บัตรประชาชน",
  LICENSE: "ใบขับขี่",
  BLUE_BOOK: "เล่มทะเบียน",
  INSURANCE: "ประกันภัย",
  CRIMINAL_CHECK: "ประวัติอาชญากรรม",
  PASSBOOK: "สมุดบัญชี",
};

const STATUS_TABS = [
  { key: "PENDING", label: "รออนุมัติ" },
  { key: "VERIFIED", label: "อนุมัติแล้ว" },
  { key: "REJECTED", label: "ไม่อนุมัติ" },
  { key: "ALL", label: "ทั้งหมด" },
];

function messageOf(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message;
  return typeof message === "string" && message !== "" ? message : fallback;
}

function AdminDriversPageInner() {
  const [items, setItems] = useState<Driver[]>([]);
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<Driver | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [commission, setCommission] = useState("20");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiAdminRideDrivers({
        status: status === "ALL" ? undefined : status,
        size: 50,
      });
      setItems((res.data?.data?.items ?? res.data?.items ?? []) as Driver[]);
    } catch (err: unknown) {
      setError(messageOf(err, "โหลดรายชื่อคนขับไม่สำเร็จ"));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void load();
  }, [load]);

  const approve = async (driver: Driver) => {
    setBusy(true);
    setError("");
    try {
      const rate = Number(commission);
      await apiAdminVerifyDriver(driver.id, Number.isFinite(rate) ? rate : 20);
      await load();
    } catch (err: unknown) {
      setError(messageOf(err, "อนุมัติไม่สำเร็จ"));
    } finally {
      setBusy(false);
    }
  };

  const setRate = async (driver: Driver) => {
    const rate = Number(commission);
    if (!Number.isFinite(rate)) {
      setError("ค่าคอมมิชชันไม่ถูกต้อง");
      return;
    }
    setBusy(true);
    try {
      await apiAdminSetDriverCommission(driver.id, rate);
      await load();
    } catch (err: unknown) {
      setError(messageOf(err, "ตั้งค่าคอมมิชชันไม่สำเร็จ"));
    } finally {
      setBusy(false);
    }
  };

  const reject = async () => {
    if (!rejectTarget) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      await apiAdminRejectDriver(rejectTarget.id, rejectReason.trim() || "เอกสารไม่ครบ");
      setRejectTarget(null);
      setRejectReason("");
      await load();
    } catch (err: unknown) {
      setError(messageOf(err, "ไม่อนุมัติไม่สำเร็จ"));
    } finally {
      setBusy(false);
    }
  };

  const reviewDoc = async (doc: Document, next: "APPROVED" | "REJECTED") => {
    setBusy(true);
    setError("");
    try {
      await apiAdminReviewDriverDocument(doc.id, next);
      await load();
    } catch (err: unknown) {
      setError(messageOf(err, "อัปเดตเอกสารไม่สำเร็จ"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-md px-margin pb-24 pt-3 md:max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/rides"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface"
          aria-label="ย้อนกลับ"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </Link>
        <h1 className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
          อนุมัติคนขับ
        </h1>
        <span className="w-10" />
      </div>

      <div className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-none">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatus(tab.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 font-label-md text-label-md transition-all ${
              status === tab.key
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface-variant"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <label className="mt-3 flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2">
        <span className="font-label-sm text-label-sm text-on-surface-variant">ค่าคอมมิชชัน (%)</span>
        <input
          value={commission}
          onChange={(event) => setCommission(event.target.value)}
          inputMode="numeric"
          className="h-8 w-16 rounded-lg bg-surface-container-lowest px-2 text-center font-label-md text-label-md text-on-surface focus:outline-none"
        />
        <span className="font-body-sm text-body-sm text-tertiary">ใช้ตอนอนุมัติ / ตั้งค่าใหม่</span>
      </label>

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
          <EmptyState icon="badge" title="ไม่มีรายการ" description="ไม่พบคนขับในสถานะนี้" />
        ) : null}

        {items.map((driver) => (
          <div key={driver.id} className="rounded-2xl bg-surface-container-lowest p-3 shadow-sm">
            <div className="flex items-start gap-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-label-lg text-label-lg font-bold text-on-primary">
                {driver.user.name?.charAt(0) ?? "D"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="truncate font-label-md text-label-md font-bold text-on-surface">
                    {driver.user.name}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 font-label-sm text-[10px] font-bold ${
                      driver.status === "VERIFIED"
                        ? "bg-success-container text-on-success-container"
                        : driver.status === "REJECTED"
                          ? "bg-error-container text-on-error-container"
                          : "bg-warning-container text-on-warning-container"
                    }`}
                  >
                    {driver.status === "VERIFIED"
                      ? "อนุมัติแล้ว"
                      : driver.status === "REJECTED"
                        ? "ไม่อนุมัติ"
                        : "รออนุมัติ"}
                  </span>
                  {driver.isOnline ? (
                    <span className="rounded-full bg-primary-fixed px-2 py-0.5 font-label-sm text-[10px] text-on-primary-fixed-variant">
                      ONLINE
                    </span>
                  ) : null}
                </div>
                <p className="truncate font-body-sm text-body-sm text-tertiary">
                  {driver.user.email} • {driver.user.phone ?? "-"}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  ใบขับขี่ {driver.license} • {driver.totalTrips} เที่ยว • {driver.rating.toFixed(2)} ดาว
                  {driver.commissionRate !== null ? ` • คอม ${driver.commissionRate}%` : ""}
                </p>
                {driver.rejectedReason ? (
                  <p className="font-body-sm text-body-sm text-error">เหตุผล: {driver.rejectedReason}</p>
                ) : null}
              </div>
            </div>

            {driver.vehicles.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {driver.vehicles.map((vehicle) => (
                  <span
                    key={vehicle.id}
                    className="rounded-full bg-surface-container-low px-2 py-0.5 font-label-sm text-[10px] text-on-surface-variant"
                  >
                    {[vehicle.brand, vehicle.model].filter(Boolean).join(" ") || vehicle.type} • {vehicle.plateNo}
                  </span>
                ))}
              </div>
            ) : null}

            {driver.documents.length > 0 ? (
              <div className="mt-2 flex flex-col gap-1">
                {driver.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-2 rounded-xl bg-surface-container-low px-2.5 py-1.5"
                  >
                    <span className="min-w-0 flex-1 truncate font-label-sm text-label-sm text-on-surface">
                      {DOC_LABEL[doc.type] ?? doc.type}
                    </span>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-label-sm text-label-sm font-bold text-primary"
                    >
                      ดูไฟล์
                    </a>
                    <span
                      className={`rounded-full px-1.5 py-0.5 font-label-sm text-[9px] font-bold ${
                        doc.status === "APPROVED"
                          ? "bg-success-container text-on-success-container"
                          : doc.status === "REJECTED"
                            ? "bg-error-container text-on-error-container"
                            : "bg-warning-container text-on-warning-container"
                      }`}
                    >
                      {doc.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => void reviewDoc(doc, "APPROVED")}
                      disabled={busy}
                      className="rounded-full bg-success-container px-2 py-0.5 font-label-sm text-[9px] font-bold text-on-success-container disabled:opacity-50"
                    >
                      อนุมัติ
                    </button>
                    <button
                      type="button"
                      onClick={() => void reviewDoc(doc, "REJECTED")}
                      disabled={busy}
                      className="rounded-full bg-error-container px-2 py-0.5 font-label-sm text-[9px] font-bold text-on-error-container disabled:opacity-50"
                    >
                      ปฏิเสธ
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 font-body-sm text-body-sm text-tertiary">ยังไม่มีเอกสาร</p>
            )}

            <div className="mt-2 flex gap-1.5">
              {driver.status !== "VERIFIED" ? (
                <button
                  type="button"
                  onClick={() => void approve(driver)}
                  disabled={busy}
                  className="h-10 flex-1 rounded-xl bg-success font-label-md text-label-md font-bold text-on-success disabled:opacity-60"
                >
                  อนุมัติ
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void setRate(driver)}
                  disabled={busy}
                  className="h-10 flex-1 rounded-xl bg-surface-container-low font-label-md text-label-md font-bold text-on-surface disabled:opacity-60"
                >
                  ตั้งค่าคอม {commission}%
                </button>
              )}
              {driver.status !== "REJECTED" ? (
                <button
                  type="button"
                  onClick={() => {
                    setRejectTarget(driver);
                    setRejectReason("");
                  }}
                  disabled={busy}
                  className="h-10 flex-1 rounded-xl bg-error-container font-label-md text-label-md font-bold text-on-error-container disabled:opacity-60"
                >
                  ไม่อนุมัติ
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <BottomSheet
        open={rejectTarget !== null}
        onClose={() => setRejectTarget(null)}
        title="ไม่อนุมัติคนขับ"
        subtitle={rejectTarget?.user.name}
        footer={
          <button
            type="button"
            onClick={() => void reject()}
            disabled={busy}
            className="h-12 w-full rounded-xl bg-error font-label-lg text-label-lg font-bold text-on-error disabled:opacity-60"
          >
            {busy ? "กำลังบันทึก..." : "ยืนยันไม่อนุมัติ"}
          </button>
        }
      >
        <label className="flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant">เหตุผล</span>
          <textarea
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            rows={3}
            placeholder="เช่น รูปใบขับขี่ไม่ชัด / เอกสารไม่ครบ"
            className="rounded-xl bg-surface-container-low px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none"
          />
        </label>
      </BottomSheet>
    </main>
  );
}

export default function AdminDriversPage() {
  return (
    <AdminGate>
      <AdminDriversPageInner />
    </AdminGate>
  );
}
