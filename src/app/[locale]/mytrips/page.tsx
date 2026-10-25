"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiCancelBooking, apiChangeBookingDates, apiCreateReview, apiMyBookings } from "@/app/Api/mainApi";

type Booking = {
  id: string;
  ref: string;
  type: string;
  status: string;
  totalPrice: number;
  travelDate: string | null;
  checkIn: string | null;
  checkOut: string | null;
  stay: {
    id: string;
    name: string;
    location: string;
    photos: { url: string }[];
  } | null;
  review: { id: string; rating: number; text: string | null } | null;
};

const TABS = [
  { key: "UPCOMING", label: "กำลังจะไป" },
  { key: "COMPLETED", label: "ไปแล้ว" },
  { key: "CANCELLED", label: "ยกเลิก" },
];

const STATUS_TEXT: Record<string, string> = {
  UPCOMING: "ยืนยันแล้ว",
  COMPLETED: "เสร็จสิ้น",
  CANCELLED: "ยกเลิกแล้ว",
};

export default function MyTripsPage() {
  const [tab, setTab] = useState("UPCOMING");
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  // กำลังเปลี่ยนวัน: bookingId
  const [editing, setEditing] = useState("");
  const [newCheckIn, setNewCheckIn] = useState("");
  const [newCheckOut, setNewCheckOut] = useState("");

  // กำลังเขียนรีวิว: stayId
  const [reviewStay, setReviewStay] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiMyBookings();
      setItems(((res.data ?? {}) as { data?: Booking[] }).data ?? []);
      setError("");
    } catch (err: unknown) {
      const code = (err as { response?: { status?: number } })?.response?.status;
      setError(code === 401 ? "กรุณาล็อกอินก่อน" : "โหลดการจองไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cancel = async (id: string) => {
    setError("");
    setNotice("");
    if (!window.confirm("ยกเลิกการจองนี้ใช่ไหม? (ยังไม่มีระบบคืนเงินอัตโนมัติ)")) {
      return;
    }
    try {
      const res = await apiCancelBooking(id);
      setNotice(
        ((res.data ?? {}) as { message?: string }).message ?? "ยกเลิกแล้ว",
      );
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "ยกเลิกไม่สำเร็จ");
    }
  };

  const saveDates = async (id: string) => {
    setError("");
    setNotice("");
    try {
      await apiChangeBookingDates(id, newCheckIn, newCheckOut);
      setEditing("");
      setNotice("เปลี่ยนวันที่แล้ว");
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "เปลี่ยนวันไม่สำเร็จ");
    }
  };

  const submitReview = async () => {
    setError("");
    try {
      await apiCreateReview(reviewStay, reviewRating, reviewText);
      setReviewStay("");
      setReviewText("");
      setReviewRating(5);
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "ส่งรีวิวไม่สำเร็จ");
    }
  };

  const visible = items.filter((item) => item.status === tab);

  return (
    <main className="mx-auto w-full max-w-4xl px-margin py-4 md:py-8">
      <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
        การเดินทางของฉัน
      </h1>

      <div className="mt-4 flex items-center justify-between gap-1 rounded-xl bg-surface-container-high p-1">
        {TABS.map((item) => {
          const count = items.filter((row) => row.status === item.key).length;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 font-label-md text-label-md ${
                tab === item.key
                  ? "bg-surface-container-lowest font-bold text-primary-container shadow-sm"
                  : "text-on-surface-variant"
              }`}
            >
              {item.label}
              <span className="rounded-full bg-primary-fixed px-1.5 py-0.5 text-[10px] font-bold text-on-primary-fixed">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {notice !== "" ? <p className="mt-3 font-body-md text-body-md text-secondary">{notice}</p> : null}
      {error !== "" ? <p className="mt-3 font-body-md text-body-md text-error">{error}</p> : null}

      <div className="mt-4 flex flex-col gap-3">
        {loading ? <p className="font-body-md text-body-md text-tertiary">กำลังโหลด...</p> : null}

        {!loading &&
          visible.map((item) => (
            <div key={item.id} className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
              <div className="flex gap-3">
                {item.stay?.photos[0] ? (
                  <img src={item.stay.photos[0].url} alt="" className="h-20 w-24 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="h-20 w-24 shrink-0 rounded-xl bg-surface-container-low" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-label-sm text-label-sm font-bold text-primary">
                    {item.ref} · {STATUS_TEXT[item.status] ?? item.status}
                  </p>
                  <p className="truncate font-headline-sm text-headline-sm font-bold text-on-surface">
                    {item.stay?.name ?? "-"}
                  </p>
                  <p className="font-body-sm text-body-sm text-tertiary">
                    {item.stay?.location ?? "-"} ·{" "}
                    {item.travelDate ? new Date(item.travelDate).toLocaleDateString("th-TH") : "-"}
                  </p>
                  <p className="mt-1 font-label-md text-label-md font-bold text-on-surface">
                    ฿{item.totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>

              {item.status === "UPCOMING" ? (
                <>
                  <p className="mt-3 flex items-center gap-2 rounded-xl bg-primary-fixed/60 px-3 py-2 font-body-sm text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                    แสดงคิวอาร์ดตอนเช็คอินที่หน้าที่พัก
                  </p>

                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(item.id);
                        setNewCheckIn(item.checkIn ?? "");
                        setNewCheckOut(item.checkOut ?? "");
                      }}
                      className="h-11 flex-1 rounded-xl bg-surface-container-low font-label-md text-label-md font-bold text-on-surface"
                    >
                      เปลี่ยนวัน
                    </button>
                    <button
                      type="button"
                      onClick={() => cancel(item.id)}
                      className="h-11 flex-1 rounded-xl bg-error-container font-label-md text-label-md font-bold text-on-error-container"
                    >
                      ยกเลิก
                    </button>
                  </div>

                  {editing === item.id ? (
                    <div className="mt-2 rounded-xl bg-surface-container-low p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <label className="font-label-sm text-label-sm font-bold text-on-surface">
                          เช็คอิน
                          <input
                            type="date"
                            value={newCheckIn}
                            onChange={(event) => setNewCheckIn(event.target.value)}
                            className="mt-1 h-10 w-full rounded-lg bg-surface-container-lowest px-2"
                          />
                        </label>
                        <label className="font-label-sm text-label-sm font-bold text-on-surface">
                          เช็คเอาท์
                          <input
                            type="date"
                            value={newCheckOut}
                            onChange={(event) => setNewCheckOut(event.target.value)}
                            className="mt-1 h-10 w-full rounded-lg bg-surface-container-lowest px-2"
                          />
                        </label>
                      </div>
                      <p className="mt-2 font-body-sm text-body-sm text-tertiary">
                        ระบบจะเช็คห้องว่างของช่วงใหม่ก่อนบันทึก
                      </p>
                      <button
                        type="button"
                        onClick={() => saveDates(item.id)}
                        className="mt-2 h-10 w-full rounded-xl bg-primary font-label-md text-label-md font-bold text-on-primary"
                      >
                        บันทึกวันที่ใหม่
                      </button>
                    </div>
                  ) : null}
                </>
              ) : null}

              {item.status === "COMPLETED" && item.stay ? (
                item.review ? (
                  <div className="mt-3 rounded-xl bg-surface-container-low p-3">
                    <p className="font-label-sm text-label-sm font-bold text-on-surface">
                      รีวิวของคุณ: {"★".repeat(item.review.rating)}
                    </p>
                    {item.review.text ? (
                      <p className="font-body-sm text-body-sm text-tertiary">{item.review.text}</p>
                    ) : null}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setReviewStay(item.stay!.id)}
                    className="mt-3 h-11 w-full rounded-xl bg-secondary-container font-label-md text-label-md font-bold text-on-secondary"
                  >
                    เขียนรีวิว
                  </button>
                )
              ) : null}
            </div>
          ))}

        {!loading && visible.length === 0 ? (
          <p className="rounded-2xl bg-surface-container-lowest p-8 text-center font-body-md text-body-md text-tertiary shadow-sm">
            ยังไม่มีรายการในแท็บนี้
          </p>
        ) : null}
      </div>

      {reviewStay !== "" ? (
        <div className="mt-5 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">เขียนรีวิว</h2>

          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                onClick={() => setReviewRating(score)}
                className={`h-10 w-10 rounded-xl text-[20px] ${
                  score <= reviewRating ? "text-amber-500" : "text-outline"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            rows={3}
            placeholder="ประทับใจกับที่พักนี้อย่างไร"
            className="mt-2 w-full rounded-xl bg-surface-container-low p-3 font-body-md text-body-md text-on-surface"
          />

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={submitReview}
              className="h-11 flex-1 rounded-xl bg-primary font-label-md text-label-md font-bold text-on-primary"
            >
              ส่งรีวิว
            </button>
            <button
              type="button"
              onClick={() => setReviewStay("")}
              className="h-11 rounded-xl bg-surface-container-low px-5 font-label-md text-label-md font-bold text-on-surface"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}