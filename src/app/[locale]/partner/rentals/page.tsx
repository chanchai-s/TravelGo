"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  apiMyVehiclePartner,
  apiPartnerApproveRental,
  apiPartnerCompleteRental,
  apiPartnerNoShowRental,
  apiPartnerPayAtBranch,
  apiPartnerPickupRental,
  apiPartnerRejectRental,
  apiPartnerRentals,
  apiPartnerReturnRental,
  type PartnerRentalItem,
  type RentalPaymentMethod,
} from "@/app/Api/mainApi";
import { useAuthStore } from "@/app/stores/auth.stores";

const TABS = [
  { id: "PENDING_PARTNER", label: "รออนุมัติ" },
  { id: "RESERVED", label: "อนุมัติแล้ว" },
  { id: "PAID", label: "ชำระแล้ว" },
  { id: "PICKED_UP", label: "กำลังเช่า" },
  { id: "RETURNED", label: "รอปิดงาน" },
  { id: "ALL", label: "ทั้งหมด" },
] as const;

const STATUS_TEXT: Record<string, string> = {
  PENDING_PARTNER: "รออนุมัติ",
  RESERVED: "อนุมัติแล้ว",
  PAID: "ชำระเงินแล้ว",
  PICKED_UP: "รับรถแล้ว",
  RETURNED: "คืนรถแล้ว",
  COMPLETED: "ปิดงานแล้ว",
  CANCELLED: "ยกเลิก",
  REJECTED: "ตีกลับ",
  NO_SHOW: "ไม่มารับรถ",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING_PARTNER: "bg-secondary-fixed text-on-secondary-fixed",
  RESERVED: "bg-primary-fixed text-on-primary-fixed",
  PAID: "bg-primary text-on-primary",
  PICKED_UP: "bg-tertiary-container text-on-tertiary-container",
  RETURNED: "bg-surface-container-high text-on-surface",
  COMPLETED: "bg-secondary-container text-on-secondary",
  CANCELLED: "bg-error-container text-on-error-container",
  REJECTED: "bg-error-container text-on-error-container",
  NO_SHOW: "bg-error-container text-on-error-container",
};

const PAYMENT_METHODS: { id: RentalPaymentMethod; label: string }[] = [
  { id: "CASH", label: "เงินสด" },
  { id: "TRANSFER", label: "โอน" },
  { id: "CARD", label: "บัตร" },
];

/** สถานะมัดจำจาก backend (PENDING / PAID / REFUNDED / FORFEITED) */
const DEPOSIT_TEXT: Record<string, string> = {
  PENDING: "ยังไม่จ่าย",
  PAID: "จ่ายแล้ว",
  REFUNDED: "คืนแล้ว",
  FORFEITED: "ยึดมัดจำ",
};

const CURRENCY = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function errorText(error: unknown, fallback: string): string {
  const response = (
    error as { response?: { status?: number; data?: { message?: string } } }
  )?.response;
  if (response?.status === 403) {
    return "บัญชีนี้ยังไม่ได้เป็นพาร์ทเนอร์รถเช่าที่ผ่านการยืนยัน";
  }
  const message = response?.data?.message;
  return typeof message === "string" && message !== "" ? message : fallback;
}

export default function PartnerRentalsPage() {
  const token = useAuthStore((state) => state.token);

  const [companyName, setCompanyName] = useState("");
  const [partnerError, setPartnerError] = useState("");
  const [tab, setTab] = useState<string>("PENDING_PARTNER");
  const [items, setItems] = useState<PartnerRentalItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [method, setMethod] = useState<Record<string, RentalPaymentMethod>>({});

  const load = useCallback(
    async (status: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await apiPartnerRentals({ status, size: 50 });
        const data = res.data?.data ?? {};
        setItems((data.items ?? []) as PartnerRentalItem[]);
        setTotal(Number(data.total ?? 0));
      } catch (err: unknown) {
        setItems([]);
        setTotal(0);
        setError(errorText(err, "โหลดรายการจองไม่สำเร็จ"));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (token === null) {
      setLoading(false);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const res = await apiMyVehiclePartner();
        if (!alive) return;
        setCompanyName(String(res.data?.data?.companyName ?? ""));
        setPartnerError("");
      } catch (err: unknown) {
        if (!alive) return;
        setPartnerError(errorText(err, "ตรวจสอบสิทธิ์พาร์ทเนอร์ไม่สำเร็จ"));
        setLoading(false);
        return;
      }
      await load(tab);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tab]);

  const run = async (
    item: PartnerRentalItem,
    action: (item: PartnerRentalItem) => Promise<{ data?: { message?: string } }>,
    fallback: string,
  ) => {
    setBusyId(item.id);
    setError("");
    setNotice("");
    try {
      const res = await action(item);
      setNotice(res.data?.message ?? fallback);
      await load(tab);
    } catch (err: unknown) {
      setError(errorText(err, fallback));
    } finally {
      setBusyId("");
    }
  };

  const approve = (item: PartnerRentalItem) => {
    if (!window.confirm(`อนุมัติการจอง ${item.booking?.ref ?? ""} ใช่ไหม?`)) return;
    void run(item, () => apiPartnerApproveRental(item.id), "อนุมัติการจองแล้ว");
  };

  const reject = (item: PartnerRentalItem) => {
    const reason = window.prompt("เหตุผลที่ตีกลับ (จำเป็น)");
    if (reason === null) return;
    if (reason.trim() === "") {
      setError("ต้องใส่เหตุผลที่ตีกลับ");
      return;
    }
    void run(
      item,
      () => apiPartnerRejectRental(item.id, reason.trim()),
      "ตีกลับการจองแล้ว",
    );
  };

  const pay = (item: PartnerRentalItem) => {
    const chosen = method[item.id] ?? "CASH";
    if (!window.confirm(`บันทึกว่าเก็บเงินแล้ว (${chosen}) ใช่ไหม?`)) return;
    void run(
      item,
      () => apiPartnerPayAtBranch(item.id, { method: chosen }),
      "บันทึกการชำระเงินแล้ว",
    );
  };

  const pickup = (item: PartnerRentalItem) => {
    if (!window.confirm("ยืนยันส่งมอบรถให้ลูกค้าแล้ว?")) return;
    void run(item, () => apiPartnerPickupRental(item.id, {}), "บันทึกรับรถแล้ว");
  };

  const returnCar = (item: PartnerRentalItem) => {
    if (!window.confirm("ยืนยันรับรถคืนแล้ว? (ระบบจะคิดค่าคืนช้าถ้ามี)")) return;
    void run(item, () => apiPartnerReturnRental(item.id, {}), "บันทึกคืนรถแล้ว");
  };

  const complete = (item: PartnerRentalItem) => {
    if (!window.confirm("ปิดงานและคืนมัดจำ (ถ้าจ่ายแล้ว) ใช่ไหม?")) return;
    void run(item, () => apiPartnerCompleteRental(item.id), "ปิดงานการจองแล้ว");
  };

  const noShow = (item: PartnerRentalItem) => {
    if (!window.confirm("ยืนยันว่าลูกค้าไม่มารับรถ? (มัดจำที่จ่ายแล้วจะถูกยึด)")) return;
    void run(item, () => apiPartnerNoShowRental(item.id), "บันทึกไม่มารับรถแล้ว");
  };

  if (token === null) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <p className="font-body-md text-body-md text-on-surface">
          ต้องเข้าสู่ระบบด้วยบัญชีพาร์ทเนอร์ก่อน
        </p>
        <Link
          href="/login?next=/partner/rentals"
          className="mt-4 flex h-11 items-center justify-center rounded-xl bg-primary px-4 font-label-md text-label-md font-bold text-on-primary"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  if (partnerError !== "") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
          คิวงานรถเช่า
        </h1>
        <p className="mt-3 rounded-xl bg-error-container/50 px-4 py-3 font-body-md text-body-md text-on-error-container">
          {partnerError}
        </p>
        <p className="mt-3 font-body-sm text-body-sm text-tertiary">
          หน้านี้ใช้ได้เฉพาะบัญชีที่เป็นพาร์ทเนอร์รถเช่าที่ผ่านการยืนยันแล้ว
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
            คิวงานรถเช่า
          </h1>
          <p className="font-body-sm text-body-sm text-tertiary">
            {companyName !== "" ? companyName : "พาร์ทเนอร์รถเช่า"}
          </p>
        </div>
        <span className="rounded-full bg-surface-container px-3 py-1 font-label-sm text-label-sm text-tertiary">
          {total} รายการ
        </span>
      </div>

      <div className="mt-4 flex w-full items-center gap-1 overflow-x-auto pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 font-label-md text-label-md shadow-sm transition-all ${
              tab === t.id
                ? "bg-primary-container text-on-primary"
                : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {notice !== "" ? (
        <p className="mt-3 rounded-xl bg-secondary-container/50 px-4 py-2 font-body-md text-body-md text-on-secondary">{notice}</p>
      ) : null}
      {error !== "" ? (
        <p className="mt-3 rounded-xl bg-error-container/50 px-4 py-2 font-body-md text-body-md text-on-error-container">{error}</p>
      ) : null}

      {loading ? (
        <p className="mt-6 font-body-md text-body-md text-tertiary">กำลังโหลด...</p>
      ) : null}

      {!loading && items.length === 0 && error === "" ? (
        <p className="mt-8 rounded-xl bg-surface-container-lowest px-4 py-8 text-center font-body-md text-body-md text-tertiary">
          ไม่มีรายการในสถานะนี้
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-3">
        {items.map((item) => {
          const busy = busyId === item.id;
          const chosen = method[item.id] ?? "CASH";
          return (
            <div key={item.id} className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-label-sm text-label-sm font-bold text-primary">
                    {item.booking?.ref ?? item.id}
                  </p>
                  <p className="truncate font-headline-sm text-headline-sm font-bold text-on-surface">
                    {item.vehicle?.name ?? "รถเช่า"}
                    {item.vehicle?.licensePlate ? (
                      <span className="ml-2 rounded-md bg-surface-container px-1.5 py-0.5 font-label-sm text-[11px] text-tertiary">
                        {item.vehicle.licensePlate}
                      </span>
                    ) : null}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 font-label-sm text-label-sm font-bold ${
                    STATUS_STYLE[item.status] ?? "bg-surface-container text-on-surface"
                  }`}
                >
                  {STATUS_TEXT[item.status] ?? item.status}
                </span>
              </div>

              <div className="mt-3 grid gap-1 font-body-sm text-body-sm text-tertiary">
                <p>
                  <span className="material-symbols-outlined align-middle text-[16px]">
                    person
                  </span>{" "}
                  {item.booking?.user?.name ?? "-"} · {item.booking?.user?.phone ?? item.booking?.user?.email ?? "-"}
                </p>
                <p>
                  <span className="material-symbols-outlined align-middle text-[16px]">
                    schedule
                  </span>{" "}
                  {formatDateTime(item.pickupAt)} → {formatDateTime(item.dropoffAt)} · {item.days} วัน
                </p>
                <p>
                  <span className="material-symbols-outlined align-middle text-[16px]">
                    location_on
                  </span>{" "}
                  {item.branch?.name ?? "-"}
                </p>
                {item.driverName || item.driverPhone ? (
                  <p>
                    <span className="material-symbols-outlined align-middle text-[16px]">
                      badge
                    </span>{" "}
                    {item.driverName ?? "-"} · {item.driverPhone ?? "-"}
                  </p>
                ) : null}
                {item.rejectedReason ? <p>เหตุผลตีกลับ: {item.rejectedReason}</p> : null}
                {item.notes ? <p>หมายเหตุ: {item.notes}</p> : null}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/40 pt-3">
                <p className="font-label-md text-label-md font-bold text-on-surface">
                  ฿{CURRENCY.format(item.booking?.totalPrice ?? item.pricePerDay * item.days)}
                  <span className="ml-2 font-body-sm font-normal text-tertiary">
                    มัดจำ ฿{CURRENCY.format(item.depositAmount)}
                    {item.depositStatus
                      ? ` · ${DEPOSIT_TEXT[item.depositStatus] ?? item.depositStatus}`
                      : ""}
                  </span>
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {item.status === "PENDING_PARTNER" ? (
                    <>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => approve(item)}
                        className="h-10 rounded-xl bg-primary px-4 font-label-md text-label-md font-bold text-on-primary disabled:opacity-50"
                      >
                        อนุมัติ
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => reject(item)}
                        className="h-10 rounded-xl bg-error-container px-4 font-label-md text-label-md font-bold text-on-error-container disabled:opacity-50"
                      >
                        ตีกลับ
                      </button>
                    </>
                  ) : null}

                  {item.status === "RESERVED" ? (
                    <>
                      <select
                        value={chosen}
                        onChange={(event) =>
                          setMethod((prev) => ({
                            ...prev,
                            [item.id]: event.target.value as RentalPaymentMethod,
                          }))
                        }
                        className="h-10 rounded-xl bg-surface-container px-2 font-label-md text-label-md text-on-surface"
                      >
                        {PAYMENT_METHODS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => pay(item)}
                        className="h-10 rounded-xl bg-primary px-4 font-label-md text-label-md font-bold text-on-primary disabled:opacity-50"
                      >
                        บันทึกชำระเงิน
                      </button>
                    </>
                  ) : null}

                  {item.status === "PAID" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => pickup(item)}
                      className="h-10 rounded-xl bg-primary px-4 font-label-md text-label-md font-bold text-on-primary disabled:opacity-50"
                    >
                      ส่งมอบรถ
                    </button>
                  ) : null}

                  {item.status === "PICKED_UP" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => returnCar(item)}
                      className="h-10 rounded-xl bg-primary px-4 font-label-md text-label-md font-bold text-on-primary disabled:opacity-50"
                    >
                      รับรถคืน
                    </button>
                  ) : null}

                  {item.status === "RETURNED" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => complete(item)}
                      className="h-10 rounded-xl bg-secondary-container px-4 font-label-md text-label-md font-bold text-on-secondary disabled:opacity-50"
                    >
                      ปิดงาน + คืนมัดจำ
                    </button>
                  ) : null}

                  {item.status === "RESERVED" || item.status === "PAID" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => noShow(item)}
                      className="h-10 rounded-xl bg-surface-container px-3 font-label-md text-label-md font-semibold text-on-surface disabled:opacity-50"
                    >
                      ไม่มารับรถ
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
