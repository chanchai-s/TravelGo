"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiMyPayouts, apiPayoutBalance, apiRequestPayout, apiStripeOnboarding } from "@/app/Api/mainApi";

type Balance = {
  payoutReady: number;
  payoutPending: number;
  payoutInFlight: number;
  bankVerified: boolean;
  stripeConnected: boolean;
  stripeEnabled: boolean;
  commissionRate: number;
};

type Payout = {
  id: string;
  amount: number;
  status: string;
  provider: string | null;
  providerRef: string | null;
  note: string | null;
  requestedAt: string;
  paidAt: string | null;
};

const STATUS: Record<string, { text: string; tone: string }> = {
  PENDING: { text: "รอผู้ดูแลอนุมัติ", tone: "bg-secondary-container text-on-secondary" },
  PROCESSING: { text: "กำลังโอน", tone: "bg-surface-container-high text-on-surface-variant" },
  PAID: { text: "จ่ายแล้ว", tone: "bg-primary-container text-on-primary-container" },
  FAILED: { text: "ไม่สำเร็จ", tone: "bg-error-container text-on-error-container" },
};

export default function HostPayoutsPage() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [items, setItems] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [bal, list] = await Promise.all([apiPayoutBalance(), apiMyPayouts()]);
      setBalance(((bal.data ?? {}) as { data?: Balance }).data ?? null);
      setItems(((list.data ?? {}) as { data?: Payout[] }).data ?? []);
      setError("");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const request = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const res = await apiRequestPayout();
      setNotice(
        ((res.data ?? {}) as { message?: string }).message ?? "ส่งคำขอแล้ว",
      );
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "ส่งคำขอไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  };

  const connect = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await apiStripeOnboarding();
      const url = ((res.data ?? {}) as { data?: { url?: string } }).data?.url;
      if (url) {
        window.location.href = url;
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "เชื่อม Stripe ไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-margin py-4 md:py-8">
      <Link href="/host/dashboard" className="inline-flex items-center gap-1 font-label-md text-label-md font-bold text-primary">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        ภาพรวมของฉัน
      </Link>

      <h1 className="mt-3 font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
        รายได้และการจ่ายเงิน
      </h1>

      {notice !== "" ? <p className="mt-3 font-body-md text-body-md text-secondary">{notice}</p> : null}
      {error !== "" ? <p className="mt-3 font-body-md text-body-md text-error">{error}</p> : null}

      {loading ? (
        <p className="mt-4 font-body-md text-body-md text-tertiary">กำลังโหลด...</p>
      ) : balance === null ? (
        <p className="mt-4 font-body-md text-body-md text-tertiary">ยังไม่มีข้อมูล</p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
              <p className="font-label-sm text-label-sm text-tertiary">พร้อมจ่าย</p>
              <p className="font-headline-md text-headline-md font-extrabold text-primary">
                ฿{balance.payoutReady.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
              <p className="font-label-sm text-label-sm text-tertiary">รอครบกำหนด</p>
              <p className="font-headline-md text-headline-md font-extrabold text-on-surface">
                ฿{balance.payoutPending.toLocaleString()}
              </p>
              <p className="font-body-sm text-body-sm text-tertiary">เข้าพักเสร็จแล้วจึงจ่ายได้</p>
            </div>
            <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
              <p className="font-label-sm text-label-sm text-tertiary">กำลังดำเนินการ</p>
              <p className="font-headline-md text-headline-md font-extrabold text-on-surface">
                ฿{balance.payoutInFlight.toLocaleString()}
              </p>
            </div>
          </div>

          {balance.commissionRate > 0 ? (
            <p className="mt-2 font-body-sm text-body-sm text-tertiary">
              ค่าคอมมิชชันแพลตฟอร์ม {balance.commissionRate}% หักจากยอดขายก่อนจ่ายเจ้าของ
            </p>
          ) : null}

          {/* เชื่อมบัญชี Stripe */}
          <section className="mt-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              บัญชีรับเงินผ่าน Stripe
            </h2>
            {balance.stripeConnected ? (
              <p className="mt-2 font-body-md text-body-md text-secondary">
                เชื่อมบัญชี Stripe เรียบร้อยแล้ว
              </p>
            ) : balance.stripeEnabled ? (
              <button
                type="button"
                onClick={connect}
                disabled={busy}
                className="mt-2 h-11 rounded-xl bg-primary px-4 font-label-md text-label-md font-bold text-on-primary shadow-sm disabled:opacity-60"
              >
                เชื่อมบัญชี Stripe
              </button>
            ) : (
              <p className="mt-2 font-body-sm text-body-sm text-tertiary">
                ยังไม่ได้ตั้งค่า Stripe ที่เซิร์ฟเวอร์ — ตอนนี้ระบบจะจำลองการจ่าย (ไม่มีเงินโอนจริง)
              </p>
            )}
          </section>

          {/* ขอจ่าย */}
          <button
            type="button"
            onClick={request}
            disabled={busy || balance.payoutReady <= 0 || !balance.bankVerified}
            className="mt-4 h-12 w-full rounded-xl bg-secondary-container font-headline-sm text-headline-sm font-bold text-on-secondary shadow-md disabled:opacity-50"
          >
            ขอจ่ายเงิน ฿{balance.payoutReady.toLocaleString()}
          </button>
          {!balance.bankVerified ? (
            <p className="mt-1 text-center font-body-sm text-body-sm text-error">
              ต้องตรวจสอบบัญชีรับเงินให้ผ่านก่อน
            </p>
          ) : null}

          {/* ประวัติ */}
          <h2 className="mt-6 font-headline-sm text-headline-sm font-bold text-on-surface">
            ประวัติการจ่าย
          </h2>
          {items.length === 0 ? (
            <p className="mt-2 rounded-2xl bg-surface-container-lowest p-8 text-center font-body-md text-body-md text-tertiary shadow-sm">
              ยังไม่มีคำขอจ่ายเงิน
            </p>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              {items.map((item) => {
                const badge = STATUS[item.status] ?? { text: item.status, tone: "bg-surface-container-low" };
                return (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
                    <div className="min-w-0">
                      <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                        ฿{item.amount.toLocaleString()}
                      </p>
                      <p className="font-body-sm text-body-sm text-tertiary">
                        ขอเมื่อ {new Date(item.requestedAt).toLocaleDateString("th-TH")}
                        {item.providerRef ? ` · ${item.providerRef}` : ""}
                      </p>
                      {item.note ? (
                        <p className="font-body-sm text-body-sm text-tertiary">{item.note}</p>
                      ) : null}
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 font-label-sm text-label-sm font-bold ${badge.tone}`}>
                      {badge.text}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </main>
  );
}