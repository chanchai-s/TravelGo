"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiHostDashboard } from "@/app/Api/mainApi";

type Dashboard = {
  listings: { total: number; published: number; pending: number; rejected: number; draft: number };
  bookings: { total: number; active: number; upcoming: number; completed: number; cancelled: number };
  revenue: { gross: number; commissionRate: number; commission: number; net: number };
  recentBookings: {
    id: string;
    ref: string;
    status: string;
    totalPrice: number;
    travelDate: string | null;
    stayName: string;
    createdAt: string;
  }[];
};

const cardClass =
  "rounded-2xl bg-surface-container-lowest p-4 shadow-sm";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className={cardClass}>
      <p className="font-label-sm text-label-sm text-tertiary">{label}</p>
      <p className="font-headline-md text-headline-md font-extrabold text-on-surface">{value}</p>
      {hint ? <p className="font-body-sm text-body-sm text-tertiary">{hint}</p> : null}
    </div>
  );
}

export default function HostDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiHostDashboard()
      .then((res) => {
        setData(((res.data ?? {}) as { data?: Dashboard }).data ?? null);
      })
      .catch((err: unknown) => {
        const code = (err as { response?: { status?: number } })?.response?.status;
        setError(code === 401 ? "กรุณาล็อกอินก่อน" : "โหลดแดชบอร์ดไม่สำเร็จ");
      });
  }, []);

  if (error !== "") {
    return (
      <main className="mx-auto w-full max-w-4xl px-margin py-8">
        <p className="font-body-md text-body-md text-error">{error}</p>
        <Link href="/login" className="mt-2 inline-block font-label-md text-label-md font-bold text-primary">
          ไปหน้า login
        </Link>
      </main>
    );
  }

  if (data === null) {
    return (
      <main className="mx-auto w-full max-w-4xl px-margin py-8">
        <p className="font-body-md text-body-md text-tertiary">กำลังโหลด...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-margin py-4 md:py-8">
      <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
        ภาพรวมของฉัน
      </h1>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/host/listings" className="flex h-11 items-center rounded-xl bg-surface-container-low px-4 font-label-md text-label-md font-bold text-on-surface">
          ประกาศของฉัน
        </Link>
        <Link href="/host/payout" className="flex h-11 items-center rounded-xl bg-surface-container-low px-4 font-label-md text-label-md font-bold text-on-surface">
          บัญชีรับเงิน / สัญญา
        </Link>
      </div>

      {/* ยอดขาย */}
      <h2 className="mt-5 font-headline-sm text-headline-sm font-bold text-on-surface">ยอดขาย</h2>
      <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Stat label="ยอดขายรวม" value={`฿${data.revenue.gross.toLocaleString()}`} />
        <Stat
          label="ค่าคอมมิชชัน"
          value={`฿${data.revenue.commission.toLocaleString()}`}
          hint={`${data.revenue.commissionRate}% (ยังไม่หักจริง)`}
        />
        <Stat label="รับจริงโดยประมาณ" value={`฿${data.revenue.net.toLocaleString()}`} />
      </div>

      {/* ประกาศ */}
      <h2 className="mt-5 font-headline-sm text-headline-sm font-bold text-on-surface">ประกาศ</h2>
      <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="ทั้งหมด" value={String(data.listings.total)} />
        <Stat label="ขึ้นเว็บ" value={String(data.listings.published)} />
        <Stat label="รอตรวจ" value={String(data.listings.pending)} />
        <Stat label="ถูกตีกลับ" value={String(data.listings.rejected)} />
        <Stat label="ร่าง" value={String(data.listings.draft)} />
      </div>

      {/* การจอง */}
      <h2 className="mt-5 font-headline-sm text-headline-sm font-bold text-on-surface">การจอง</h2>
      <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="ทั้งหมด" value={String(data.bookings.total)} />
        <Stat label="กำลังจะไป" value={String(data.bookings.upcoming)} />
        <Stat label="เสร็จสิ้น" value={String(data.bookings.completed)} />
        <Stat label="ยกเลิก" value={String(data.bookings.cancelled)} />
      </div>

      {/* ล่าสุด */}
      <h2 className="mt-5 font-headline-sm text-headline-sm font-bold text-on-surface">
        การจองล่าสุด
      </h2>
      {data.recentBookings.length === 0 ? (
        <p className="mt-2 rounded-2xl bg-surface-container-lowest p-8 text-center font-body-md text-body-md text-tertiary shadow-sm">
          ยังไม่มีการจองเข้ามา
        </p>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          {data.recentBookings.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-lowest p-3 shadow-sm">
              <div className="min-w-0">
                <p className="truncate font-label-md text-label-md font-bold text-on-surface">
                  {item.stayName || "-"}
                </p>
                <p className="font-body-sm text-body-sm text-tertiary">
                  {item.ref} · {item.travelDate ? new Date(item.travelDate).toLocaleDateString("th-TH") : "-"}
                </p>
              </div>
              <p className="shrink-0 font-headline-sm text-headline-sm font-bold text-primary">
                ฿{item.totalPrice.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}