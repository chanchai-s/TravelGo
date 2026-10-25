"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useFlightStore,
  type CabinClass,
} from "@/app/stores/flight.stores";

const API_BASE =
  process.env["NEXT_PUBLIC_API_BASE_URL"] ?? "http://localhost:4000";

const CABIN_CLASSES: CabinClass[] = [
  "Economy",
  "Economy/premium economy",
  "Premium economy",
  "Business/first",
  "Business",
  "First",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type DestinationResult = {
  id?: string;
  name: string;
  code?: string;
  cityName?: string;
  countryName?: string;
  type?: string;
};

function formatShort(value: string): string {
  if (!value) {
    return "";
  }
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function useDestinationLookup() {
  const [items, setItems] = useState<DestinationResult[]>([]);
  const [loading, setLoading] = useState(false);

  const lookup = async (query: string) => {
    const trimmed = query.trim();
    if (trimmed === "") {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/flights/search?query=${encodeURIComponent(trimmed)}`,
      );
      const json = (await res.json()) as { data?: unknown };
      const raw = json.data as unknown;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as { data?: unknown } | null)?.data)
          ? ((raw as { data: unknown[] }).data as DestinationResult[])
          : [];
      setItems(list.slice(0, 6));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return { items, loading, lookup, clear: () => setItems([]) };
}

export function FlightForm() {
  const router = useRouter();
  const setFlightParams = useFlightStore((state) => state.setFlightParams);

  const formRef = useRef<HTMLDivElement>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const now = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [paxOpen, setPaxOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<CabinClass>("Economy");

  const fromLookup = useDestinationLookup();
  const toLookup = useDestinationLookup();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (fromOpen && from.trim() !== "") {
        void fromLookup.lookup(from);
      }
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, fromOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (toOpen && to.trim() !== "") {
        void toLookup.lookup(to);
      }
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, toOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        formRef.current &&
        !formRef.current.contains(event.target as Node)
      ) {
        setFromOpen(false);
        setToOpen(false);
        setCalendarOpen(false);
        setPaxOpen(false);
        setClassOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pax = adults + children + infants;

  const pickDate = (day: number) => {
    const iso = toISO(viewYear, viewMonth, day);
    if (!depart || (depart && ret)) {
      setDepart(iso);
      setRet("");
      return;
    }
    if (iso > depart) {
      setRet(iso);
      setCalendarOpen(false);
      return;
    }
    setDepart(iso);
    setRet("");
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
  const leadBlanks = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const dateLabel =
    depart && ret
      ? `${formatShort(depart)} - ${formatShort(ret)}`
      : "Select dates";

  const step = (
    label: string,
    hint: string,
    value: number,
    min: number,
    max: number,
    onChange: (next: number) => void,
  ) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Fewer ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-lg text-slate-400"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-semibold text-slate-800">
          {value}
        </span>
        <button
          type="button"
          aria-label={`More ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-600 text-lg text-blue-600"
        >
          +
        </button>
      </div>
    </div>
  );

  const go = (bundle: boolean) => {
    setFlightParams({
      from,
      to,
      depart,
      ret,
      adults,
      children,
      infants,
      pax,
      cabinClass,
      bundle,
    });
    const params = new URLSearchParams({
      from,
      to,
      depart,
      ret,
      pax: String(pax),
      adults: String(adults),
      children: String(children),
      infants: String(infants),
      class: cabinClass,
      bundle: bundle ? "1" : "0",
    });
    router.push(`/flight?${params.toString()}`);
  };

  const renderDestinationList = (
    results: DestinationResult[],
    loading: boolean,
    onPick: (label: string) => void,
  ) =>
    loading ? (
      <p className="px-3 py-2 text-sm text-slate-500">Searching...</p>
    ) : results.length === 0 ? (
      <p className="px-3 py-2 text-sm text-slate-500">No matches — try another keyword</p>
    ) : (
      <div className="max-h-[320px] overflow-y-auto pr-1">
        {results.map((item, index) => {
          const isCity = item.type === "CITY";
          const label =
            item.code !== undefined && item.code !== ""
              ? `${item.name} (${item.code})`
              : item.name;
          return (
            <button
              key={item.id ?? `${label}-${index}`}
              type="button"
              onClick={() => onPick(label)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-500">
                {isCity ? "place" : "flight_takeoff"}
              </span>
              <div className="min-w-0">
                {isCity ? (
                  <>
                    <p className="text-sm text-slate-800">
                      {item.name} · <span className="text-blue-600">All airports</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      {[item.cityName, item.countryName]
                        .filter((part) => part !== undefined && part !== "")
                        .join(", ") || item.countryName}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-slate-800">
                      {item.code !== undefined && item.code !== "" ? (
                        <span className="font-bold text-blue-600">{item.code} </span>
                      ) : null}
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {[item.cityName, item.countryName]
                        .filter((part) => part !== undefined && part !== "")
                        .join(", ")}
                    </p>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );

  return (
    <div ref={formRef} className="grid gap-2 md:grid-cols-[1.4fr_1fr_1.2fr_auto]">
      {/* From / To */}
      <div className="relative flex items-stretch gap-3">
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={from}
            onFocus={() => {
              setFromOpen(true);
              setToOpen(false);
            }}
            onChange={(event) => {
              setFrom(event.target.value);
              setFromOpen(true);
            }}
            placeholder="Leaving from"
            aria-label="Leaving from"
            className="h-[52px] w-full rounded-xl border border-slate-200 bg-surface-container-lowest px-4 text-sm font-medium text-on-surface outline-none placeholder:text-slate-400"
          />
          {fromOpen && (
            <div className="absolute left-0 top-full z-20 mt-3 w-[160%] min-w-64 max-w-[400px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              {renderDestinationList(fromLookup.items, fromLookup.loading, (label) => {
                setFrom(label);
                setFromOpen(false);
              })}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
          aria-label="Swap origin and destination"
          className="absolute left-1/2 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-md"
        >
          <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
        </button>
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={to}
            onFocus={() => {
              setToOpen(true);
              setFromOpen(false);
            }}
            onChange={(event) => {
              setTo(event.target.value);
              setToOpen(true);
            }}
            placeholder="Going to"
            aria-label="Going to"
            className="h-[52px] w-full rounded-xl border border-slate-200 bg-surface-container-lowest px-4 text-sm font-medium text-on-surface outline-none placeholder:text-slate-400"
          />
          {toOpen && (
            <div className="absolute right-0 top-full z-20 mt-3 w-[160%] min-w-64 max-w-[400px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              {renderDestinationList(toLookup.items, toLookup.loading, (label) => {
                setTo(label);
                setToOpen(false);
              })}
            </div>
          )}
        </div>
      </div>

      {/* Depart / Return calendar */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setCalendarOpen((prev) => !prev);
            setPaxOpen(false);
          }}
          className="flex w-full items-center gap-3 rounded-xl bg-surface-container-low p-3 text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-lowest text-primary shadow-xs">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Depart – Return
            </p>
            <p className="mt-0.5 text-sm font-semibold text-on-surface">{dateLabel}</p>
          </div>
          <span className="material-symbols-outlined text-[20px] text-outline-variant">
            expand_more
          </span>
        </button>
        {calendarOpen && (
          <div className="absolute left-0 top-full z-20 mt-3 w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="text-sm font-semibold text-slate-600"
                aria-label="Previous month"
              >
                ‹
              </button>
              <p className="text-sm font-bold text-slate-800">{monthLabel}</p>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="text-sm font-semibold text-slate-600"
                aria-label="Next month"
              >
                ›
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-medium text-slate-500">
              {DAYS.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2">
              {Array.from({ length: leadBlanks }, (_, i) => (
                <div key={`blank-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const iso = toISO(viewYear, viewMonth, day);
                const isSelected = depart === iso || ret === iso;
                const inRange = depart !== "" && ret !== "" && iso > depart && iso < ret;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => pickDate(day)}
                    className={`h-10 rounded-lg text-sm transition ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : inRange
                          ? "bg-blue-100 text-blue-800"
                          : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Travelers + Class */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setPaxOpen((prev) => !prev);
            setCalendarOpen(false);
          }}
          className="flex w-full items-center gap-3 rounded-xl bg-surface-container-low p-3 text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-lowest text-primary shadow-xs">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="mt-0.5 truncate text-sm font-semibold text-on-surface">
              {pax} adult{pax > 1 ? "s" : ""} · {cabinClass}
            </p>
          </div>
          <span className="material-symbols-outlined text-[20px] text-outline-variant">
            {paxOpen ? "expand_less" : "expand_more"}
          </span>
        </button>
        {paxOpen && (
          <div className="absolute left-0 top-full z-20 mt-3 w-full max-w-[360px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <p className="mb-3 text-xs text-slate-500">
              Please select the exact number of passengers to view the best prices
            </p>
            <div className="space-y-4">
              {step("Adults", "12+ years old", adults, 1, 9, setAdults)}
              {step("Children", "2–11 years old", children, 0, 6, setChildren)}
              {step("Infants on lap", "Under 2 years old", infants, 0, 4, setInfants)}
            </div>
            <div className="relative mt-4">
              <button
                type="button"
                onClick={() => setClassOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-800"
              >
                <span>{cabinClass}</span>
                <span className="text-xs text-slate-500">{classOpen ? "▲" : "▼"}</span>
              </button>
              {classOpen && (
                <div className="absolute left-0 top-full z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl">
                  {CABIN_CLASSES.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setCabinClass(option);
                        setClassOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-100 ${
                        option === cabinClass
                          ? "font-semibold text-blue-600"
                          : "text-slate-700"
                      }`}
                    >
                      <span>{option}</span>
                      {option === cabinClass ? <span>✓</span> : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setPaxOpen(false);
                  setClassOpen(false);
                }}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-on-primary shadow-sm transition-all active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => go(false)}
          className="flex h-[52px] items-center justify-center gap-2 rounded-xl bg-secondary-container px-5 font-headline-sm text-headline-sm font-bold text-on-secondary shadow-[0_8px_20px_rgba(255,87,34,0.30)] transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[22px]">search</span>
          <span>Search Flights</span>
        </button>
        <button
          type="button"
          onClick={() => go(true)}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-label-md text-label-md font-bold text-on-primary shadow-sm transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[20px]">hotel</span>
          <span>Flight + Hotel</span>
        </button>
      </div>
    </div>
  );
}
