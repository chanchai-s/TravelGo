"use client";

import { useEffect, useRef, useState } from "react";
import {
  CHECKOUT,
  COST,
  DAY_PLANS,
  PLAN_QUERY,
  PREFERENCES,
  type Stop,
} from "@/data/plan";

type BookState = "idle" | "securing" | "confirmed";

function StopRow({ stop }: { stop: Stop }) {
  const dotClass = stop.dot === "primary" ? "bg-primary" : "bg-secondary-container";
  const timeClass = stop.timeTone === "primary" ? "text-primary" : "text-secondary";
  const metaClass =
    stop.metaTone === "coral"
      ? "text-secondary"
      : stop.metaTone === "primary"
        ? "text-primary"
        : "text-tertiary";

  return (
    <div className="relative flex items-start gap-3">
      <span
        className={`absolute -left-6 top-1 h-3.5 w-3.5 rounded-full ring-4 ring-surface-container-lowest ${dotClass}`}
      />
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-surface-container">
        <img alt={stop.imageAlt} src={stop.image} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className={`font-label-sm text-label-sm font-bold ${timeClass}`}>
            {stop.time}
          </span>
          <span className="font-label-sm text-label-sm font-bold text-on-surface">
            {stop.price}
          </span>
        </div>
        <h4 className="truncate font-label-lg text-label-lg font-bold text-on-surface">
          {stop.name}
        </h4>
        <p className="mt-0.5 line-clamp-1 font-body-sm text-body-sm text-on-surface-variant">
          {stop.desc}
        </p>
        <div className={`mt-1 flex items-center gap-1 font-label-sm text-label-sm ${metaClass}`}>
          <span className="material-symbols-outlined text-[13px]">{stop.metaIcon}</span>
          <span>{stop.meta}</span>
        </div>
      </div>
    </div>
  );
}

export function PlanExplorer() {
  const [prefs, setPrefs] = useState<ReadonlySet<string>>(new Set(["culture"]));
  const [day, setDay] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [book, setBook] = useState<BookState>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const togglePref = (id: string) => {
    setPrefs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const regenerate = () => {
    if (spinning) {
      return;
    }
    setSpinning(true);
    timers.current.push(setTimeout(() => setSpinning(false), 500));
  };

  const bookTrip = () => {
    if (book !== "idle") {
      return;
    }
    setBook("securing");
    timers.current.push(
      setTimeout(() => {
        setBook("confirmed");
        timers.current.push(setTimeout(() => setBook("idle"), 2200));
      }, 1200),
    );
  };

  const activePlan = DAY_PLANS.find((plan) => plan.day === day) ?? DAY_PLANS[0];

  return (
    <>
      {/* Smart Prompt Query */}
      <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[16px] text-primary">
              magic_button
            </span>
            <span>Smart Prompt Query</span>
          </div>
          <button
            type="button"
            onClick={regenerate}
            className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2.5 py-1 font-label-sm text-label-sm text-on-surface transition-all active:scale-95"
          >
            <span
              className={`material-symbols-outlined text-[14px] text-primary transition-transform duration-500 ${spinning ? "rotate-180" : ""}`}
            >
              sync
            </span>
            <span>Regenerate</span>
          </button>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-surface-container-low p-3">
          <span className="material-symbols-outlined mt-0.5 text-[20px] text-primary">
            travel_explore
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-label-md text-label-md font-semibold text-on-surface">
              {PLAN_QUERY.destination}
            </p>
            <p className="mt-0.5 flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
              <span>{PLAN_QUERY.meta[0]}</span>
              <span className="text-tertiary">•</span>
              <span>{PLAN_QUERY.meta[1]}</span>
              <span className="text-tertiary">•</span>
              <span className="font-semibold text-secondary">{PLAN_QUERY.status}</span>
            </p>
          </div>
          <button
            type="button"
            className="pt-0.5 font-label-sm text-label-sm font-bold text-primary active:opacity-70"
          >
            Edit
          </button>
        </div>

        <div className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1 pt-3">
          {PREFERENCES.map((pref) => {
            const active = prefs.has(pref.id);
            return (
              <button
                key={pref.id}
                type="button"
                onClick={() => togglePref(pref.id)}
                className={`flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-1.5 font-label-sm text-label-sm ${
                  active
                    ? "bg-primary-container text-on-primary-container shadow-sm"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{pref.icon}</span>
                <span>{pref.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-label-md text-label-md font-bold text-on-surface-variant">
            Estimated Cost Breakdown
          </span>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-secondary-fixed/50 px-2 py-0.5 font-label-sm text-label-sm font-bold text-secondary">
            <span className="material-symbols-outlined text-[13px]">savings</span>
            <span>{COST.saved}</span>
          </span>
        </div>
        <div className="mb-2 flex items-baseline justify-between">
          <div>
            <span className="font-headline-lg text-headline-lg font-extrabold tracking-tight text-on-surface">
              {COST.total}
            </span>
            <span className="ml-1 font-body-sm text-body-sm text-tertiary">{COST.cap}</span>
          </div>
          <span className="font-label-sm text-label-sm font-bold text-primary">
            {COST.allocated}
          </span>
        </div>
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
          <div
            className="h-full rounded-full bg-primary-container transition-all duration-700"
            style={{ width: `${COST.barPct}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between font-label-sm text-label-sm text-tertiary">
          {COST.legend.map((item) => (
            <span key={item.label} className="flex items-center gap-1">
              <span className={`inline-block h-2 w-2 rounded-full ${item.color}`} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Itinerary */}
      <div>
        <div className="mb-space-sm flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Curated Itinerary</h2>
          <div className="flex cursor-pointer items-center gap-1 font-label-sm text-label-sm font-bold text-primary">
            <span className="material-symbols-outlined text-[16px]">share</span>
            <span>Export</span>
          </div>
        </div>
        <div className="mb-space-md flex gap-1 rounded-xl bg-surface-container-high p-1">
          {DAY_PLANS.map((plan) => {
            const active = plan.day === day;
            return (
              <button
                key={plan.day}
                type="button"
                onClick={() => setDay(plan.day)}
                className={`flex-1 rounded-lg py-1.5 text-center font-label-md text-label-md transition-all ${
                  active
                    ? "bg-surface-container-lowest font-bold text-primary shadow-sm"
                    : "font-semibold text-tertiary"
                }`}
              >
                Day {plan.day}
              </button>
            );
          })}
        </div>

        {activePlan !== undefined ? (
          <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
            <div className="flex items-center justify-between pb-3">
              <div>
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                  {activePlan.focus}
                </span>
                <h3 className="mt-0.5 font-headline-sm text-headline-sm text-on-surface">
                  {activePlan.title}
                </h3>
              </div>
              <span className="rounded-full bg-surface-container px-2.5 py-1 font-label-sm text-label-sm text-tertiary">
                {activePlan.stopsLabel}
              </span>
            </div>
            <div className="relative mt-2 flex flex-col gap-space-md pl-6 before:absolute before:bottom-3 before:left-2.5 before:top-2 before:w-0.5 before:bg-surface-container-high before:content-['']">
              {activePlan.stops.map((stop) => (
                <StopRow key={stop.id} stop={stop} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Sticky Checkout Bar */}
      <div className="fixed inset-x-4 bottom-24 z-40 bg-surface-container-lowest/95 px-margin py-3 shadow-xl backdrop-blur-xl md:bottom-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
                {CHECKOUT.total}
              </span>
              <span className="font-label-sm text-label-sm text-tertiary">total</span>
            </div>
            <button
              type="button"
              className="text-left font-label-sm text-label-sm font-semibold text-primary underline"
            >
              {CHECKOUT.itemsLabel}
            </button>
          </div>
          <button
            type="button"
            onClick={bookTrip}
            className="flex h-[52px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-secondary-container px-4 font-label-lg text-label-lg font-bold text-on-secondary shadow-md transition-all hover:opacity-95 active:scale-[0.98]"
          >
            {book === "idle" ? (
              <>
                <span>{CHECKOUT.bookLabel}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            ) : book === "securing" ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  progress_activity
                </span>
                <span>{CHECKOUT.securingLabel}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>{CHECKOUT.confirmedLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
