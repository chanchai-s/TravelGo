"use client";

import { useState } from "react";
import {
  ACTIVITY_BOOKING,
  BOOKING_TABS,
  COMBO_BOOKING,
  CONCIERGE,
  LIVE_ALERT,
  PAST_TRAVELS,
  type BookingTabId,
} from "@/data/bookingdetails";

function QrGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm10-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm10 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 4h2v2h-2v-2zm-8-4h2v2h-2v-2zm2-4h2v2h-2v-2z" />
    </svg>
  );
}

export function BookingExplorer() {
  const [tab, setTab] = useState<BookingTabId>("upcoming");
  const [alertVisible, setAlertVisible] = useState(true);

  return (
    <>
      {/* Segmented Tabs */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-container-high p-1">
        {BOOKING_TABS.map((item) => {
          const active = item.id === tab;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 font-label-md text-label-md transition-all ${
                active
                  ? "bg-surface-container-lowest font-bold text-primary-container shadow-sm"
                  : "text-on-surface-variant"
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  active
                    ? "bg-primary-fixed font-bold text-on-primary-fixed"
                    : "bg-surface-variant font-semibold text-on-surface-variant"
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live Alert */}
      {alertVisible ? (
        <div className="my-2">
          <div className="flex items-start gap-3 rounded-xl bg-primary-fixed/60 p-3.5 shadow-sm">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
              <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-label-sm text-label-sm font-bold text-primary">
                  {LIVE_ALERT.tag}
                </span>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary-container" />
              </div>
              <p className="mt-0.5 font-body-md text-body-md font-semibold text-on-surface">
                {LIVE_ALERT.title}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {LIVE_ALERT.subtitle}
              </p>
            </div>
            <button
              type="button"
              aria-label="Dismiss banner"
              onClick={() => setAlertVisible(false)}
              className="shrink-0 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Cards */}
      <div className="mt-2 flex flex-col gap-4">
        {/* Combo Package Card */}
        <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-md transition-all duration-300">
          <div className="bg-gradient-to-r from-primary-container to-surface-tint p-4 text-on-primary-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">holiday_village</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wide opacity-90">
                  {COMBO_BOOKING.tag}
                </span>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-100 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> {COMBO_BOOKING.status}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <h2 className="font-headline-md text-headline-md font-bold tracking-tight">
                {COMBO_BOOKING.destination}
              </h2>
              <span className="font-label-sm text-label-sm opacity-90">{COMBO_BOOKING.nights}</span>
            </div>
            <p className="mt-0.5 font-body-sm text-body-sm opacity-85">{COMBO_BOOKING.dates}</p>
          </div>

          <div className="bg-surface-container-lowest p-4">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container font-bold text-primary">
                  <span className="material-symbols-outlined text-[16px]">airlines</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md font-bold text-on-surface">
                    {COMBO_BOOKING.flight.airline}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {COMBO_BOOKING.flight.aircraft}
                  </p>
                </div>
              </div>
              <span className="rounded-md bg-surface-container px-2 py-0.5 font-label-sm text-label-sm font-semibold text-on-surface-variant">
                {COMBO_BOOKING.flight.seats}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-3">
              <div className="text-left">
                <p className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
                  {COMBO_BOOKING.flight.departTime}
                </p>
                <p className="font-label-sm text-label-sm font-bold text-primary">
                  {COMBO_BOOKING.flight.departCode}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {COMBO_BOOKING.flight.departCity}
                </p>
              </div>
              <div className="flex flex-1 flex-col items-center px-4">
                <span className="font-label-sm text-label-sm font-medium text-on-surface-variant">
                  {COMBO_BOOKING.flight.duration}
                </span>
                <div className="my-1 flex w-full items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-primary-container" />
                  <div className="h-0.5 flex-1 bg-primary-fixed-dim" />
                  <span className="material-symbols-outlined rotate-90 text-[16px] text-primary">
                    flight
                  </span>
                  <div className="h-0.5 flex-1 bg-primary-fixed-dim" />
                  <div className="h-2 w-2 rounded-full bg-primary-container" />
                </div>
                <span className="font-label-sm text-label-sm font-semibold text-emerald-600">
                  {COMBO_BOOKING.flight.status}
                </span>
              </div>
              <div className="text-right">
                <p className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
                  {COMBO_BOOKING.flight.arriveTime}
                </p>
                <p className="font-label-sm text-label-sm font-bold text-primary">
                  {COMBO_BOOKING.flight.arriveCode}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {COMBO_BOOKING.flight.arriveCity}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-3">
              <img
                alt={COMBO_BOOKING.hotel.imageAlt}
                src={COMBO_BOOKING.hotel.image}
                className="h-20 w-20 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-secondary-container">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="font-label-sm text-label-sm font-bold">
                    {COMBO_BOOKING.hotel.rating}
                  </span>
                </div>
                <p className="truncate font-label-lg text-label-lg font-bold text-on-surface">
                  {COMBO_BOOKING.hotel.name}
                </p>
                <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
                  {COMBO_BOOKING.hotel.room}
                </p>
                <p className="mt-1 font-body-sm text-body-sm font-semibold text-primary">
                  {COMBO_BOOKING.hotel.checkin}
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-between bg-surface-container-lowest px-2">
            <div className="h-8 w-4 rounded-r-full bg-surface" />
            <div className="mx-2 flex-1 border-t-2 border-dashed border-surface-container" />
            <div className="h-8 w-4 rounded-l-full bg-surface" />
          </div>

          <div className="flex flex-col items-center bg-surface-container-lowest p-4">
            <div className="flex w-full items-center justify-between rounded-xl bg-surface-container-low p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest p-1.5 shadow-sm">
                  <QrGlyph className="h-full w-full text-on-surface" />
                </div>
                <div>
                  <p className="font-label-md text-label-md font-bold text-on-surface">
                    {COMBO_BOOKING.qr.title}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {COMBO_BOOKING.qr.subtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Enlarge QR Code"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high text-primary transition-colors hover:bg-primary hover:text-on-primary"
              >
                <span className="material-symbols-outlined text-[20px]">fullscreen</span>
              </button>
            </div>
            <div className="mt-4 flex w-full flex-col gap-2.5">
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-container font-label-lg text-label-lg font-bold text-on-primary-container shadow-sm transition-transform active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                View E-Ticket &amp; Boarding Pass
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-surface-container-low font-label-md text-label-md font-semibold text-on-surface transition-colors active:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">forum</span>
                  Chat with Host
                </button>
                <button
                  type="button"
                  className="flex h-11 items-center justify-center gap-1 rounded-xl bg-surface-container-low px-4 font-label-md text-label-md text-tertiary transition-colors active:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                  Manage
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Voucher Card */}
        <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-md transition-all duration-300">
          <div className="relative h-36 w-full">
            <img
              alt={ACTIVITY_BOOKING.imageAlt}
              src={ACTIVITY_BOOKING.image}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent" />
            <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
              <span className="flex items-center gap-1 rounded-full bg-surface-container-lowest/90 px-2.5 py-1 font-label-sm text-label-sm font-bold text-primary-container shadow-sm backdrop-blur-md">
                <span className="material-symbols-outlined text-[15px]">kayaking</span> Activity
                Voucher
              </span>
              <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-bold text-on-primary">
                {ACTIVITY_BOOKING.status}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-on-primary">
              <p className="font-body-sm text-body-sm opacity-85">{ACTIVITY_BOOKING.date}</p>
              <h2 className="font-headline-sm text-headline-sm font-bold leading-tight drop-shadow-sm">
                {ACTIVITY_BOOKING.title}
              </h2>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between pb-3 font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">group</span>
                <span className="font-semibold text-on-surface">{ACTIVITY_BOOKING.group}</span>
                {ACTIVITY_BOOKING.groupNote}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary-container">
                  alarm
                </span>
                <span>{ACTIVITY_BOOKING.pickup}</span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-lowest p-1 shadow-sm">
                  <QrGlyph className="h-7 w-7 text-on-surface" />
                </div>
                <div>
                  <p className="font-label-md text-label-md font-bold text-on-surface">
                    {ACTIVITY_BOOKING.checkinTitle}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {ACTIVITY_BOOKING.checkinSub}
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-tertiary">
                qr_code_scanner
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-secondary-container font-label-md text-label-md font-bold text-on-secondary shadow-sm transition-transform active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                View E-Voucher
              </button>
              <button
                type="button"
                className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-surface-container-low font-label-md text-label-md font-semibold text-on-surface transition-colors active:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">
                  directions
                </span>
                Get Directions
              </button>
            </div>
          </div>
        </div>

        {/* Past Travels */}
        <div className="flex items-center justify-between pt-3">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            {PAST_TRAVELS.title}
          </h3>
          <button
            type="button"
            onClick={() => setTab("completed")}
            className="flex items-center gap-0.5 font-label-sm text-label-sm font-bold text-primary"
          >
            {PAST_TRAVELS.viewAll}
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="rounded-xl bg-surface-container-lowest p-4 opacity-95 shadow-sm transition-all">
          <div className="flex gap-3.5">
            <img
              alt={PAST_TRAVELS.card.imageAlt}
              src={PAST_TRAVELS.card.image}
              className="h-20 w-20 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-surface-container px-2 py-0.5 text-[11px] font-bold text-tertiary">
                  {PAST_TRAVELS.card.badge}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {PAST_TRAVELS.card.nights}
                </span>
              </div>
              <p className="mt-1 truncate font-label-lg text-label-lg font-bold text-on-surface">
                {PAST_TRAVELS.card.name}
              </p>
              <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
                {PAST_TRAVELS.card.place}
              </p>
              <div className="mt-1 flex items-center gap-1 font-label-sm text-label-sm font-semibold text-emerald-600">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                {PAST_TRAVELS.card.paid}
              </div>
            </div>
          </div>
          <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-surface-container-high/60 pt-3">
            <button
              type="button"
              className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-surface-container-low font-label-md text-label-md font-semibold text-on-surface active:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[18px] text-amber-500">star</span>
              Rate &amp; Review
            </button>
            <button
              type="button"
              className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary-fixed font-label-md text-label-md font-bold text-on-primary-fixed-variant active:bg-primary-fixed-dim"
            >
              <span className="material-symbols-outlined text-[18px]">replay</span>
              Book Again
            </button>
          </div>
        </div>

        {/* Concierge */}
        <div className="mt-2 flex items-center justify-between rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
            </div>
            <div>
              <p className="font-label-md text-label-md font-bold text-on-surface">
                {CONCIERGE.title}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {CONCIERGE.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-xl bg-surface-container-lowest px-3.5 py-2 font-label-sm text-label-sm font-bold text-primary shadow-sm transition-transform active:scale-95"
          >
            {CONCIERGE.cta}
          </button>
        </div>
      </div>
    </>
  );
}
