"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiDriverMe, apiDriverSetOnline } from "@/app/Api/mainApi";
import { useAuthStore } from "@/app/stores/auth.stores";
import { RequireAuth } from "@/components/RequireAuth";
import { formatMoney } from "@/lib/rideFormat";

type Doc = { id: string; type: string; status: string; url: string };
type Vehicle = {
  id: string;
  type: string;
  plateNo: string;
  brand: string | null;
  model: string | null;
  color: string | null;
  isActive: boolean;
};

type DriverMe = {
  profile: {
    id: string;
    status: string;
    isOnline: boolean;
    license: string;
    serviceTypes: unknown;
    tierCodes: unknown;
    rating: number;
    totalTrips: number;
    rejectedReason: string | null;
  };
  vehicles: Vehicle[];
  documents: Doc[];
  stats: {
    pendingNet: number;
    settledNet: number;
    todayNet: number;
    todayTrips: number;
    totalTrips: number;
    rating: number;
  };
  requirements: { requiredDocs: string[]; missingDocs: string[]; canGoOnline: boolean };
};

const DOC_LABEL: Record<string, string> = {
  ID_CARD: "บัตรประชาชน",
  LICENSE: "ใบขับขี่",
  BLUE_BOOK: "เล่มทะเบียนรถ",
  INSURANCE: "ประกันภัย",
  CRIMINAL_CHECK: "ประวัติอาชญากรรม",
  PASSBOOK: "สมุดบัญชี",
};

const STATUS_META: Record<string, { label: string; tone: string; icon: string; hint: string }> = {
  PENDING: {
    label: "รอตรวจสอบ",
    tone: "bg-warning-container text-on-warning-container",
    icon: "hourglass_top",
    hint: "แอดมินกำลังตรวจสอบใบสมัครและเอกสารของคุณ",
  },
  VERIFIED: {
    label: "อนุมัติแล้ว",
    tone: "bg-success-container text-on-success-container",
    icon: "verified",
    hint: "พร้อมเปิดรับงานได้เลย",
  },
  REJECTED: {
    label: "ไม่ผ่านการอนุมัติ",
    tone: "bg-error-container text-on-error-container",
    icon: "error",
    hint: "แก้ไขข้อมูลแล้วส่งใบสมัครใหม่ได้",
  },
};

function DriverStatusPageInner() {
  const router = useRouter();
  const [data, setData] = useState<DriverMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await apiDriverMe();
      const payload = (res.data?.data ?? res.data) as DriverMe;
      setData(payload);
      setError("");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;
      if (typeof message === "string" && message.includes("ยังไม่ได้สมัคร")) {
        router.replace("/driver/register");
        return;
      }
      setError(message ?? "โหลดข้อมูลคนขับไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleOnline = async () => {
    if (!data) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      await apiDriverSetOnline({ isOnline: !data.profile.isOnline });
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;
      setError(message ?? "เปลี่ยนสถานะไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
          progress_activity
        </span>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto w-full max-w-md px-margin py-6">
        <div className="rounded-2xl bg-error-container p-4 text-on-error-container">
          <p className="font-label-md text-label-md font-bold">โหลดไม่สำเร็จ</p>
          <p className="font-body-sm text-body-sm">{error}</p>
        </div>
        <Link
          href="/driver/register"
          className="mt-3 flex h-11 w-full items-center justify-center rounded-xl bg-primary font-label-md text-label-md text-on-primary"
        >
          ไปหน้าสมัคร
        </Link>
      </main>
    );
  }

  const meta = STATUS_META[data.profile.status] ?? STATUS_META.PENDING;
  const verified = data.profile.status === "VERIFIED";

  return (
    <main className="mx-auto w-full max-w-md px-margin pb-24 pt-3 md:max-w-3xl">
      <div className="flex items-center justify-between">
        <Link
          href="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface"
          aria-label="ย้อนกลับ"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </Link>
        <h1 className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
          สถานะคนขับ
        </h1>
        <span className="w-10" />
      </div>

      <section className={`mt-3 rounded-2xl p-4 ${meta.tone}`}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[24px]">{meta.icon}</span>
          <p className="font-label-lg text-label-lg font-bold">{meta.label}</p>
        </div>
        <p className="mt-1 font-body-sm text-body-sm">{meta.hint}</p>
        {data.profile.rejectedReason ? (
          <p className="mt-1 font-body-sm text-body-sm">เหตุผล: {data.profile.rejectedReason}</p>
        ) : null}
      </section>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-surface-container-lowest p-3 text-center shadow-sm">
          <p className="font-label-sm text-label-sm text-tertiary">เที่ยววันนี้</p>
          <p className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
            {data.stats.todayTrips}
          </p>
        </div>
        <div className="rounded-2xl bg-surface-container-lowest p-3 text-center shadow-sm">
          <p className="font-label-sm text-label-sm text-tertiary">รายได้วันนี้</p>
          <p className="font-headline-sm text-headline-sm font-extrabold text-primary">
            {formatMoney(data.stats.todayNet)}
          </p>
        </div>
        <div className="rounded-2xl bg-surface-container-lowest p-3 text-center shadow-sm">
          <p className="font-label-sm text-label-sm text-tertiary">คะแนน</p>
          <p className="flex items-center justify-center gap-0.5 font-headline-sm text-headline-sm font-extrabold text-warning">
            <span className="material-symbols-outlined text-[18px]">star</span>
            {data.stats.rating.toFixed(2)}
          </p>
        </div>
      </div>

      <section className="mt-3 flex items-center justify-between rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
        <div>
          <p className="font-label-md text-label-md font-bold text-on-surface">เปิดรับงาน</p>
          <p className="font-body-sm text-body-sm text-tertiary">
            {data.profile.isOnline ? "กำลังรับงานอยู่" : "ปิดรับงานอยู่"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void toggleOnline()}
          disabled={busy || !verified}
          aria-pressed={data.profile.isOnline}
          className={`relative h-8 w-14 rounded-full transition-colors disabled:opacity-40 ${
            data.profile.isOnline ? "bg-success" : "bg-outline-variant"
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
              data.profile.isOnline ? "left-7" : "left-1"
            }`}
          />
        </button>
      </section>

      {verified ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            href="/driver/dashboard"
            className="flex items-center gap-2 rounded-2xl bg-primary p-3 text-on-primary"
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="font-label-md text-label-md font-bold">แดชบอร์ดรับงาน</span>
          </Link>
          <Link
            href="/driver/earnings"
            className="flex items-center gap-2 rounded-2xl bg-secondary-container p-3 text-on-secondary"
          >
            <span className="material-symbols-outlined text-[20px]">payments</span>
            <span className="font-label-md text-label-md font-bold">รายได้</span>
          </Link>
        </div>
      ) : null}

      <section className="mt-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
        <p className="font-label-md text-label-md font-bold text-on-surface">เอกสาร</p>
        {data.documents.length === 0 ? (
          <p className="mt-1 font-body-sm text-body-sm text-tertiary">ยังไม่มีเอกสารที่อัปโหลด</p>
        ) : (
          <div className="mt-2 flex flex-col gap-1.5">
            {data.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-xl bg-surface-container-low px-3 py-2">
                <span className="font-body-sm text-body-sm text-on-surface">
                  {DOC_LABEL[doc.type] ?? doc.type}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-label-sm text-[10px] font-bold ${
                    doc.status === "APPROVED"
                      ? "bg-success-container text-on-success-container"
                      : doc.status === "REJECTED"
                        ? "bg-error-container text-on-error-container"
                        : "bg-warning-container text-on-warning-container"
                  }`}
                >
                  {doc.status === "APPROVED" ? "อนุมัติ" : doc.status === "REJECTED" ? "ไม่อนุมัติ" : "รอตรวจ"}
                </span>
              </div>
            ))}
          </div>
        )}
        {data.requirements.missingDocs.length > 0 ? (
          <p className="mt-2 font-body-sm text-body-sm text-warning">
            ยังขาด: {data.requirements.missingDocs.map((type) => DOC_LABEL[type] ?? type).join(", ")}
          </p>
        ) : null}
        <Link
          href="/driver/register"
          className="mt-2 inline-flex items-center gap-1 font-label-sm text-label-sm font-bold text-primary"
        >
          <span className="material-symbols-outlined text-[16px]">upload</span>
          อัปโหลดเพิ่ม / แก้ไขรถ
        </Link>
      </section>

      <section className="mt-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
        <p className="font-label-md text-label-md font-bold text-on-surface">รถของฉัน</p>
        {data.vehicles.length === 0 ? (
          <p className="mt-1 font-body-sm text-body-sm text-tertiary">ยังไม่มีรถที่ผูกกับบัญชี</p>
        ) : (
          <div className="mt-2 flex flex-col gap-1.5">
            {data.vehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  directions_car
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-label-sm text-label-sm font-bold text-on-surface">
                    {[vehicle.brand, vehicle.model].filter(Boolean).join(" ") || vehicle.type} • {vehicle.plateNo}
                  </p>
                  <p className="font-body-sm text-body-sm text-tertiary">
                    {vehicle.color ?? "-"} • {vehicle.isActive ? "ใช้งาน" : "ปิดใช้งาน"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {error !== "" ? (
        <p className="mt-3 rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">
          {error}
        </p>
      ) : null}
    </main>
  );
}

export default function DriverStatusPage() {
  return (
    <RequireAuth>
      <DriverStatusPageInner />
    </RequireAuth>
  );
}
