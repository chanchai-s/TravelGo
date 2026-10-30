"use client";

import { useEffect, useMemo, useState } from "react";
import {
  apiCreateRentalBooking,
  apiListVehicleCategories,
  apiQuoteVehicle,
  apiSearchVehicles,
} from "@/app/Api/mainApi";
import type {
  RentalBookingResult,
  RentalQuote,
  VehicleCategoryItem,
  VehicleListItem,
} from "@/app/[locale]/rentcars/resources/data";

const DAY_MS = 24 * 60 * 60 * 1000;

function inputDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

// ใช้เวลา 10:00 ตามเวลาท้องถิ่น แล้วแปลงเป็น ISO ให้ backend
function toIso(date: string, hour = 10): string {
  return new Date(`${date}T${String(hour).padStart(2, "0")}:00:00`).toISOString();
}

function dayCount(from: string, to: string): number {
  if (!from || !to) return 0;
  const ms = new Date(`${to}T10:00:00`).getTime() - new Date(`${from}T10:00:00`).getTime();
  return Math.max(0, Math.ceil(ms / DAY_MS));
}

function formatDate(value: string): string {
  if (!value) return "-";
  const d = new Date(`${value}T10:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
}

function errorMessage(error: unknown, fallback: string): string {
  const response = (
    error as { response?: { status?: number; data?: { message?: string } } }
  )?.response;
  // เส้นทางที่ต้อง login จะถูก middleware ตอบเป็น HTML — แสดงข้อความไทยแทน
  if (response?.status === 401) return "กรุณาเข้าสู่ระบบก่อนจอง";
  const message = response?.data?.message;
  return typeof message === "string" && message !== "" ? message : fallback;
}

const CURRENCY = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export default function RentCarsPage() {
  const [mode, setMode] = useState<"rental" | "ride">("rental");
  const [categories, setCategories] = useState<VehicleCategoryItem[]>([]);
  const [vehicles, setVehicles] = useState<VehicleListItem[]>([]);
  const [category, setCategory] = useState("ALL");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<string | null>(null);
  const [quote, setQuote] = useState<RentalQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [booked, setBooked] = useState<RentalBookingResult | null>(null);

  const days = dayCount(pickupDate, returnDate);

  // ค่าเริ่มต้น: รับรถพรุ่งนี้ คืนอีก 3 วัน
  useEffect(() => {
    setPickupDate(inputDate(1));
    setReturnDate(inputDate(4));
  }, []);

  useEffect(() => {
    apiListVehicleCategories()
      .then((res) => setCategories(res.data?.data ?? []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!pickupDate || !returnDate) return;
    if (days < 1) {
      setVehicles([]);
      setError("วันคืนรถต้องอยู่หลังวันรับรถ");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    apiSearchVehicles({
      category: category === "ALL" ? undefined : category,
      pickupAt: toIso(pickupDate),
      dropoffAt: toIso(returnDate),
      size: 50,
    })
      .then((res) => {
        if (active) setVehicles(res.data?.data?.items ?? []);
      })
      .catch((err) => {
        if (active) setError(errorMessage(err, "โหลดรายการรถไม่สำเร็จ"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [category, pickupDate, returnDate, days]);

  // ขอใบเสนอราคาเมื่อเลือกรถ (หรือเปลี่ยนวันที่)
  useEffect(() => {
    if (!selected || days < 1) {
      setQuote(null);
      return;
    }

    let active = true;
    setQuote(null);
    setQuoteLoading(true);
    setBookingError(null);
    setBooked(null);

    apiQuoteVehicle(selected, toIso(pickupDate), toIso(returnDate))
      .then((res) => {
        if (active) setQuote(res.data?.data ?? null);
      })
      .catch((err) => {
        if (active) setBookingError(errorMessage(err, "ขอใบเสนอราคาไม่สำเร็จ"));
      })
      .finally(() => {
        if (active) setQuoteLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selected, pickupDate, returnDate, days]);

  const current = useMemo(
    () => vehicles.find((v) => v.id === selected) ?? null,
    [vehicles, selected],
  );

  const categoryFilters = useMemo(
    () => [{ id: "ALL", name: "All Cars" }, ...categories.map((c) => ({ id: c.slug, name: c.name }))],
    [categories],
  );

  const closeSheet = () => {
    setSelected(null);
    setQuote(null);
    setBooked(null);
    setBookingError(null);
  };

  const confirmBooking = async () => {
    if (!selected) return;
    setSubmitting(true);
    setBookingError(null);
    try {
      const res = await apiCreateRentalBooking({
        vehicleId: selected,
        pickupAt: toIso(pickupDate),
        dropoffAt: toIso(returnDate),
      });
      setBooked((res.data?.data ?? null) as RentalBookingResult | null);
    } catch (err) {
      setBookingError(errorMessage(err, "จองไม่สำเร็จ กรุณาลองใหม่"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface font-body-md text-body-md text-on-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container">
              <span className="material-symbols-outlined text-[20px] text-on-primary-container">
                explore
              </span>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold tracking-tight">
              RentCars
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex h-11 w-11 items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[24px]">
                notifications
              </span>
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="material-symbols-outlined text-[18px] text-on-primary">
                person
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-col px-4 pb-8">
        {/* Segmented control */}
        <div className="mt-4 mb-4 flex w-full items-center justify-between rounded-xl bg-surface-container p-1 shadow-sm">
          <button
            onClick={() => setMode("rental")}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2.5 font-headline-sm text-headline-sm transition-all ${
              mode === "rental"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-tertiary"
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              directions_car
            </span>
            Car Rental
          </button>
          <button
            onClick={() => setMode("ride")}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2.5 font-headline-sm text-headline-sm transition-all ${
              mode === "ride"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-tertiary"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              local_taxi
            </span>
            Ride-Hailing
          </button>
        </div>

        {/* Search card */}
        <div className="mb-4 flex w-full flex-col gap-2 rounded-xl bg-surface-container-lowest p-4 shadow-md">
          <div className="flex items-center gap-2 rounded-lg bg-surface-container p-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
              <span className="material-symbols-outlined text-[18px]">
                calendar_month
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
                Pick-up date
              </span>
              <input
                type="date"
                value={pickupDate}
                min={inputDate(0)}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-transparent font-headline-sm text-headline-sm text-on-surface outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-surface-container p-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
              <span className="material-symbols-outlined text-[18px]">
                event_available
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">
                Drop-off date
              </span>
              <input
                type="date"
                value={returnDate}
                min={pickupDate || inputDate(0)}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-transparent font-headline-sm text-headline-sm text-on-surface outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1 pt-1">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px] text-primary">
                check_circle
              </span>
              <span className="font-body-md text-body-md font-medium">
                Return to same branch
              </span>
            </span>
            <div className="flex items-center gap-1.5 rounded-full bg-secondary-fixed px-2.5 py-1 text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span className="font-label-sm text-label-sm">{days || 0} days</span>
            </div>
          </div>

          <div className="px-1 font-body-sm text-body-sm text-tertiary">
            {pickupDate && returnDate
              ? `${formatDate(pickupDate)} 10:00 → ${formatDate(returnDate)} 10:00`
              : "เลือกวันรับรถและวันคืนรถ"}
          </div>
        </div>

        {/* Quick switch banner */}
        {mode === "rental" && (
          <button
            onClick={() => setMode("ride")}
            className="mb-4 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-primary to-primary-container p-4 text-on-primary shadow-md transition-transform active:scale-[0.99]"
          >
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-on-primary/15">
                <span className="material-symbols-outlined text-[24px]">
                  hail
                </span>
              </div>
              <div className="flex min-w-0 flex-col text-left">
                <span className="truncate font-headline-sm text-headline-sm">
                  Need a quick ride right now?
                </span>
                <span className="truncate font-body-sm text-body-sm text-on-primary/80">
                  Instant city pickups with vetted drivers
                </span>
              </div>
            </div>
            <div className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-on-primary/20">
              <span className="material-symbols-outlined text-[18px] text-on-primary">
                arrow_forward
              </span>
            </div>
          </button>
        )}

        {/* Filter pills */}
        <div className="mb-1 flex w-full items-center gap-1 overflow-x-auto pb-2">
          {categoryFilters.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-label-md text-label-md shadow-sm transition-all ${
                category === c.id
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between pb-1 pt-2">
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
            {loading ? "Loading..." : `${vehicles.length} Vehicles Available`}
          </span>
          <span className="flex items-center gap-0.5 font-label-md text-label-md text-primary">
            <span className="material-symbols-outlined text-[16px]">tune</span>{" "}
            Live
          </span>
        </div>

        {error && (
          <p className="mb-3 rounded-lg bg-error-container/40 px-3 py-2 font-body-sm text-body-sm text-on-error-container">
            {error}
          </p>
        )}

        {/* Vehicle cards */}
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="relative mb-4 flex w-full flex-col gap-2 rounded-xl bg-surface-container-lowest p-4 shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex min-w-0 flex-col">
                <div className="mb-0.5 flex items-center gap-1">
                  <span className="rounded-full bg-primary-fixed px-2 py-0.5 font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-primary-fixed">
                    {v.category?.name ?? "Car"}
                  </span>
                  <span className="font-body-sm text-body-sm text-tertiary">
                    or similar
                  </span>
                </div>
                <h3 className="truncate font-headline-md text-headline-md text-on-surface">
                  {v.name}
                </h3>
              </div>
              {v.partner && (
                <div className="ml-2 max-w-[45%] truncate rounded-md bg-secondary-container px-2.5 py-1 font-headline-sm text-headline-sm font-black tracking-tight text-on-secondary shadow-sm">
                  {v.partner.companyName}
                </div>
              )}
            </div>

            <div className="relative h-40 w-full overflow-hidden rounded-xl bg-surface-container-low">
              {v.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.imageUrl} alt={v.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-[48px]">directions_car</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-surface-container-lowest/90 px-2.5 py-1 shadow-sm backdrop-blur-md">
                <span className="material-symbols-outlined text-[14px] text-secondary-container">
                  location_on
                </span>
                <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                  {v.branch?.name ?? "Branch"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 py-1">
              <div className="flex items-center gap-1.5 rounded-lg bg-surface-container p-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-tertiary">
                  airline_seat_recline_normal
                </span>
                <span className="font-label-sm text-label-sm font-semibold">
                  {v.seats} Seats
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-surface-container p-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-tertiary">
                  luggage
                </span>
                <span className="font-label-sm text-label-sm font-semibold">
                  {v.bags} Bags
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-surface-container p-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-tertiary">
                  settings
                </span>
                <span className="font-label-sm text-label-sm font-semibold">
                  {v.transmission}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-md text-headline-md font-extrabold text-on-surface">
                    ฿{CURRENCY.format(v.pricePerDay)}
                  </span>
                  <span className="font-body-sm text-body-sm text-tertiary">
                    / day
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-tertiary">
                  Total ฿{CURRENCY.format(v.pricePerDay * Math.max(1, days))} (
                  {Math.max(1, days)} days)
                </span>
              </div>
              <button
                onClick={() => setSelected(v.id)}
                disabled={days < 1}
                className="flex h-12 items-center justify-center gap-1 rounded-xl bg-secondary-container px-6 font-label-lg text-label-lg font-bold text-on-secondary shadow-md transition-all hover:opacity-95 active:scale-95 disabled:opacity-50"
              >
                Rent Now
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        ))}

        {!loading && vehicles.length === 0 && !error && (
          <p className="py-10 text-center text-tertiary">ไม่พบรถในช่วงวันที่เลือก</p>
        )}

        {/* Trust card */}
        <div className="flex w-full items-center gap-4 rounded-xl bg-surface-container p-4 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
            <span className="material-symbols-outlined text-[26px]">
              verified_user
            </span>
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
              100% Price Match Guarantee
            </span>
            <span className="font-body-sm text-body-sm text-tertiary">
              Zero hidden airport depot fees &amp; 24/7 roadside rescue.
            </span>
          </div>
        </div>
      </div>

      {/* Booking sheet */}
      {current && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeSheet}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-surface-container-lowest p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="min-w-0">
                <h2 className="truncate font-headline-md text-headline-md font-bold">
                  {current.name}
                </h2>
                <p className="font-body-sm text-body-sm text-tertiary">
                  {current.partner?.companyName} · {current.seats} seats ·{" "}
                  {current.transmission}
                </p>
              </div>
              <button onClick={closeSheet} className="text-tertiary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {current.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.imageUrl}
                alt={current.name}
                className="mb-3 h-40 w-full rounded-xl object-cover"
              />
            )}

            {booked ? (
              <div className="rounded-xl bg-secondary-container/40 p-4 text-center">
                <span className="material-symbols-outlined text-[40px] text-secondary">
                  check_circle
                </span>
                <p className="mt-1 font-headline-sm text-headline-sm font-bold">
                  ส่งคำขอจองแล้ว
                </p>
                <p className="font-body-sm text-body-sm text-tertiary">
                  เลขที่จอง {booked.ref}
                </p>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface">
                  {booked.rentalDetail?.status === "RESERVED"
                    ? "อนุมัติอัตโนมัติแล้ว — ชำระเงินที่สาขาเมื่อรับรถ"
                    : "รอพาร์ทเนอร์อนุมัติ — จะแจ้งผลให้ทราบ"}
                </p>
                <button
                  onClick={closeSheet}
                  className="mt-4 w-full rounded-xl bg-primary py-3 font-label-lg text-label-lg font-bold text-on-primary shadow-md active:scale-[0.98]"
                >
                  เสร็จสิ้น
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-tertiary">
                      ค่าเช่า ({quote?.days ?? Math.max(1, days)} วัน)
                    </span>
                    <span className="font-semibold">
                      {quoteLoading
                        ? "..."
                        : `฿${CURRENCY.format(quote?.rentalTotal ?? current.pricePerDay * Math.max(1, days))}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tertiary">
                      รวม VAT {quote?.vatRate ?? 7}% แล้ว
                    </span>
                    <span className="text-tertiary">
                      ฐาน ฿{CURRENCY.format(quote?.baseAmount ?? 0)} + VAT ฿
                      {CURRENCY.format(quote?.vatAmount ?? 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tertiary">เงินประกัน (คืนเมื่อคืนรถ)</span>
                    <span className="font-semibold">
                      ฿{CURRENCY.format(quote?.depositAmount ?? current.depositAmount)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-outline-variant pt-2">
                    <span className="font-bold">จ่ายที่สาขา</span>
                    <span className="text-lg font-extrabold text-primary">
                      {quoteLoading
                        ? "..."
                        : `฿${CURRENCY.format(quote?.totalDueAtBranch ?? 0)}`}
                    </span>
                  </div>
                </div>

                {bookingError && (
                  <p className="mt-3 rounded-lg bg-error-container/40 px-3 py-2 font-body-sm text-body-sm text-on-error-container">
                    {bookingError}
                  </p>
                )}

                <button
                  onClick={confirmBooking}
                  disabled={submitting || quoteLoading || !quote}
                  className="mt-4 w-full rounded-xl bg-primary py-3 font-label-lg text-label-lg font-bold text-on-primary shadow-md active:scale-[0.98] disabled:opacity-50"
                >
                  {submitting ? "กำลังจอง..." : "ยืนยันการจอง"}
                </button>
                <p className="mt-2 text-center font-body-sm text-body-sm text-tertiary">
                  ชำระมัดจำ + ค่าเช่าที่สาขา · ยกเลิกได้ก่อนรับรถ
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-surface-container-lowest/90 pb-safe shadow-[0_-2px_12px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-1">
          <a
            href="/th/homepage"
            className="flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-primary-container"
          >
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="font-label-sm text-label-sm font-semibold">
              Home
            </span>
          </a>
          <a
            href="/th/mytrips"
            className="flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-tertiary"
          >
            <span className="material-symbols-outlined text-[24px]">
              confirmation_number
            </span>
            <span className="font-label-sm text-label-sm">My Trips</span>
          </a>
          <a
            href="/th/bookingdetails"
            className="flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-tertiary"
          >
            <span className="material-symbols-outlined text-[24px]">
              favorite
            </span>
            <span className="font-label-sm text-label-sm">Saved</span>
          </a>
          <a
            href="/th/transport"
            className="flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-tertiary"
          >
            <span className="material-symbols-outlined text-[24px]">
              shopping_bag
            </span>
            <span className="font-label-sm text-label-sm">Cart</span>
          </a>
          <a
            href="/th/login"
            className="flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-tertiary"
          >
            <span className="material-symbols-outlined text-[24px]">
              account_circle
            </span>
            <span className="font-label-sm text-label-sm">Profile</span>
          </a>
        </div>
      </nav>
    </main>
  );
}
