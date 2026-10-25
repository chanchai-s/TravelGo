"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiMyListings, apiResubmitProperty } from "@/app/Api/mainApi";

type Listing = {
  id: string;
  name: string;
  propertyType: string;
  status: string;
  currentStep: number;
  location: string;
  pricePerNight: number;
  rejectedReason: string | null;
  photos: { url: string }[];
};

const BADGE: Record<string, { text: string; tone: string }> = {
  DRAFT: { text: "ร่าง", tone: "bg-surface-container-high text-on-surface-variant" },
  PENDING_REVIEW: { text: "รอตรวจ", tone: "bg-secondary-container text-on-secondary" },
  PUBLISHED: { text: "ขึ้นเว็บแล้ว", tone: "bg-primary-container text-on-primary-container" },
  REJECTED: { text: "ตีกลับ", tone: "bg-error-container text-on-error-container" },
};

export default function MyListingsPage() {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiMyListings();
      const data = ((res.data ?? {}) as { data?: Listing[] }).data;
      setItems(data ?? []);
      setError("");
    } catch (err: unknown) {
      const code = (err as { response?: { status?: number } })?.response?.status;
      setError(code === 401 ? "กรุณาล็อกอินก่อน" : "โหลดรายการไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resubmit = async (id: string) => {
    setError("");
    setNotice("");
    try {
      await apiResubmitProperty(id);
      setNotice("ส่งเข้าคิวตรวจแล้ว");
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "ส่งใหม่ไม่สำเร็จ");
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-margin py-4 md:py-8">
      <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
        ประกาศของฉัน
      </h1>
      <p className="mt-1 font-body-md text-body-md text-tertiary">
        ดูสถานะทุกประกาศ แก้ไข หรือส่งเข้าคิวตรวจใหม่
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href="/host"
          className="flex h-11 items-center rounded-xl bg-primary px-4 font-label-md text-label-md font-bold text-on-primary shadow-sm"
        >
          + ลงประกาศใหม่
        </Link>
        <Link
          href="/host/payout"
          className="flex h-11 items-center rounded-xl bg-surface-container-low px-4 font-label-md text-label-md font-bold text-on-surface"
        >
          บัญชีรับเงิน / สัญญา
        </Link>
        <Link
          href="/host/status"
          className="flex h-11 items-center rounded-xl bg-surface-container-low px-4 font-label-md text-label-md font-bold text-on-surface"
        >
          สถานะเจ้าของ
        </Link>
      </div>

      {notice !== "" ? <p className="mt-3 font-body-md text-body-md text-secondary">{notice}</p> : null}
      {error !== "" ? <p className="mt-3 font-body-md text-body-md text-error">{error}</p> : null}

      <div className="mt-4 flex flex-col gap-3">
        {loading ? <p className="font-body-md text-body-md text-tertiary">กำลังโหลด...</p> : null}

        {!loading && items.map((item) => {
          const badge = BADGE[item.status] ?? { text: item.status, tone: "bg-surface-container-low" };
          return (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div className="flex min-w-0 gap-3">
                {item.photos[0] ? (
                  <img src={item.photos[0].url} alt="" className="h-16 w-20 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-[20px] text-tertiary">image</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-headline-sm text-headline-sm font-bold text-on-surface">
                    {item.name}
                  </p>
                  <p className="font-body-sm text-body-sm text-tertiary">
                    {item.location || "-"} · ฿{item.pricePerNight.toLocaleString()}
                  </p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 font-label-sm text-label-sm font-bold ${badge.tone}`}>
                    {badge.text}
                  </span>
                  {item.rejectedReason ? (
                    <p className="mt-1 font-body-sm text-body-sm text-error">
                      เหตุผล: {item.rejectedReason}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                {item.status === "PUBLISHED" ? (
                  <Link
                    href={`/bookingdetails/${item.id}?source=wandergo`}
                    className="flex h-11 items-center rounded-xl bg-surface-container-low px-4 font-label-md text-label-md font-bold text-on-surface"
                  >
                    ดูหน้าเว็บ
                  </Link>
                ) : null}
                <Link
                  href={`/host/edit/${item.id}`}
                  className="flex h-11 items-center rounded-xl bg-surface-container-low px-4 font-label-md text-label-md font-bold text-on-surface"
                >
                  แก้ไข
                </Link>
                {item.status === "REJECTED" ? (
                  <button
                    type="button"
                    onClick={() => resubmit(item.id)}
                    className="h-11 rounded-xl bg-secondary-container px-4 font-label-md text-label-md font-bold text-on-secondary shadow-sm"
                  >
                    ส่งใหม่
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}

        {!loading && items.length === 0 ? (
          <p className="rounded-2xl bg-surface-container-lowest p-8 text-center font-body-md text-body-md text-tertiary shadow-sm">
            ยังไม่มีประกาศ — กด &ldquo;ลงประกาศใหม่&rdquo; เพื่อเริ่ม
          </p>
        ) : null}
      </div>
    </main>
  );
}