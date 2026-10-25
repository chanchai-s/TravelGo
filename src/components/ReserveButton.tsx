"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiCreateBooking, apiStayAvailability, apiValidateVoucher } from "@/app/Api/mainApi";

function plusDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

const inputClass =
  "h-11 w-full rounded-xl bg-surface-container-low px-3 font-body-md text-body-md text-on-surface focus:outline-none";

/**
 * ปุ่มจอง — เลือกวันเข้าออก แล้วสร้าง Booking จริง
 */
export function ReserveButton({
  stayId,
  roomTypeId,
  price,
  maxGuests = 2,
  totalRooms = 1,
}: {
  stayId: string;
  roomTypeId: string;
  price: number;
  maxGuests?: number;
  totalRooms?: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(plusDays(1));
  const [checkOut, setCheckOut] = useState(plusDays(2));
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [available, setAvailable] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");

  // ดูห้องว่างของประเภทห้องนี้ในช่วงวันที่ที่เลือก
  const loadAvailability = (from: string, to: string) => {
    apiStayAvailability(stayId, from, to)
      .then((res) => {
        const rooms2 = ((res.data ?? {}) as { data?: { rooms: { roomTypeId: string; available: number }[] } }).data?.rooms ?? [];
        const row = rooms2.find((item) => item.roomTypeId === roomTypeId);
        setAvailable(row?.available ?? 0);
      })
      .catch(() => setAvailable(null));
  };

  const nights = Math.max(
    1,
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000),
  );

  const maxRooms = Math.max(1, Math.min(totalRooms, 9));
  const guestLimit = rooms * maxGuests;

  const validatePromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const res = await apiValidateVoucher(promoCode.trim(), stayId, price * rooms * nights);
      const data = (res.data ?? {}) as { data?: { discount?: number; message?: string } };
      setDiscount(data.data?.discount ?? 0);
      setPromoMsg(`ส่วนลด ฿${(data.data?.discount ?? 0).toLocaleString("en-US")}`);
    } catch (err: unknown) {
      setDiscount(0);
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPromoMsg(message ?? "โค้ดไม่ถูกต้อง");
    }
  };

  const book = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await apiCreateBooking({ stayId, roomTypeId, checkIn, checkOut, rooms, guests, voucherCode: promoCode.trim() || undefined });
      const ref = ((res.data ?? {}) as { data?: { ref?: string } }).data?.ref ?? "";
      setDone(`จองสำเร็จ เลขที่ ${ref}`);
    } catch (err: unknown) {
      const code = (err as { response?: { status?: number } })?.response?.status;
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(code === 401 ? "กรุณาล็อกอินก่อนจอง" : (message ?? "จองไม่สำเร็จ"));
    } finally {
      setSaving(false);
    }
  };

  if (done !== "") {
    return (
      <div className="mt-2 text-right">
        <p className="font-label-md text-label-md font-bold text-secondary">{done}</p>
        <button
          type="button"
          onClick={() => router.push("/mytrips")}
          className="mt-1 font-label-sm text-label-sm font-bold text-primary underline"
        >
          ดูการจองของฉัน
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-xl bg-primary py-2.5 font-label-md text-label-md font-bold text-on-primary shadow-sm transition-all active:scale-95"
      >
        {open ? "ปิด" : "Reserve"}
      </button>

      {open ? (
        <div className="mt-2 rounded-xl bg-surface-container-low p-3 text-left">
          <label className="block font-label-sm text-label-sm font-bold text-on-surface">
            เช็คอิน
            <input
              type="date"
              value={checkIn}
              onChange={(event) => {
                setCheckIn(event.target.value);
                loadAvailability(event.target.value, checkOut);
              }}
              className={`${inputClass} mt-1`}
            />
          </label>
          <label className="mt-2 block font-label-sm text-label-sm font-bold text-on-surface">
            เช็คเอาท์
            <input
              type="date"
              value={checkOut}
              onChange={(event) => {
                setCheckOut(event.target.value);
                loadAvailability(checkIn, event.target.value);
              }}
              className={`${inputClass} mt-1`}
            />
          </label>
          <p className="mt-2 font-body-sm text-body-sm text-tertiary">
            {nights} คืน · รวม ฿{(price * rooms * nights - discount).toLocaleString("en-US")}
            {discount > 0 ? ` (ส่วนลด ฿${discount.toLocaleString("en-US")})` : ""}
          </p>

          {/* จำนวนห้อง / ผู้เข้าพัก */}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="font-label-sm text-label-sm font-bold text-on-surface">
              จำนวนห้อง
              <select
                value={rooms}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setRooms(next);
                  setGuests((prev) => Math.min(prev, next * maxGuests));
                }}
                className={`${inputClass} mt-1`}
              >
                {Array.from({ length: maxRooms }).map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1} ห้อง
                  </option>
                ))}
              </select>
            </label>
            <label className="font-label-sm text-label-sm font-bold text-on-surface">
              ผู้เข้าพัก
              <select
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
                className={`${inputClass} mt-1`}
              >
                {Array.from({ length: guestLimit }).map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1} คน
                  </option>
                ))}
              </select>
            </label>
          </div>

          {available !== null ? (
            <p
              className={`mt-1 font-body-sm text-body-sm font-bold ${
                available >= rooms ? "text-secondary" : "text-error"
              }`}
            >
              {available >= rooms
                ? `เหลือ ${available} ห้องในช่วงวันที่เลือก`
                : "ห้องเต็มแล้ว (หรือถูกปิดขาย)"}
            </p>
          ) : null}
           <div className="mt-2 flex gap-2">
             <input
               value={promoCode}
               onChange={(e) => setPromoCode(e.target.value)}
               placeholder="โค้ดส่วนลด"
               className={`${inputClass} flex-1`}
             />
             <button type="button" onClick={validatePromo} className="rounded-xl bg-surface-container-high px-3 font-label-sm text-label-sm font-bold text-on-surface">
               ใช้
             </button>
           </div>
           {promoMsg !== "" ? <p className="mt-1 font-body-sm text-body-sm text-secondary">{promoMsg}</p> : null}
           {error !== "" ? (
            <p className="mt-1 font-body-sm text-body-sm text-error">{error}</p>
          ) : null}
          <button
            type="button"
            onClick={book}
            disabled={saving || available !== null && available < rooms}
            className="mt-2 w-full rounded-xl bg-secondary-container py-2 font-label-md text-label-md font-bold text-on-secondary disabled:opacity-60"
          >
            {saving ? "กำลังจอง..." : "ยืนยันการจอง"}
          </button>
        </div>
      ) : null}
    </div>
  );
}