"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/app/stores/booking.stores";
import { SERVICE_TABS, type ServiceTabId } from "@/data/homepage";
import {
  destinationOptions,
  type DestinationOption,
} from "@/data/destinations";
import { FlightForm } from "@/components/FlightForm";

type GuestState = {
  rooms: number;
  adults: number;
  children: number;
  childAges: number[];
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calendarDays = Array.from({ length: 35 }, (_, index) => index + 1);

export function SearchCard() {
  const router = useRouter();
  const setBookingSearchParams = useBookingStore(
    (state) => state.setSearchParams,
  );
  const searchCardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<ServiceTabId>("hotels");
  const [destinationInput, setDestinationInput] = useState("Bangkok, Thailand");
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationOption | null>({
      id: "bkk",
      name: "Bangkok",
      country: "Thailand",
      type: "city",
    });
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    checkIn: "2026-10-12",
    checkOut: "2026-10-15",
  });
  const [guestState, setGuestState] = useState<GuestState>({
    rooms: 1,
    adults: 2,
    children: 0,
    childAges: [],
  });

  const ctaLabel =
    SERVICE_TABS.find((tab) => tab.id === activeTab)?.ctaLabel ??
    "Search Hotels";

  const guestLabel = useMemo(
    () =>
      `${guestState.adults} Adults · ${guestState.children} Children · ${guestState.rooms} Room${guestState.rooms > 1 ? "s" : ""}`,
    [guestState],
  );

  const dateLabel = useMemo(() => {
    if (!dateRange.checkIn || !dateRange.checkOut) return "Select dates";

    const format = (value: string) =>
      new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

    return `${format(dateRange.checkIn)} - ${format(dateRange.checkOut)}`;
  }, [dateRange]);

  const filteredDestinations = useMemo(() => {
    const query = destinationInput.trim().toLowerCase();

    if (!query) {
      return destinationOptions.slice(0, 6);
    }

    return destinationOptions.filter((option) => {
      const label = `${option.name} ${option.country}`.toLowerCase();
      return label.includes(query);
    });
  }, [destinationInput]);

  const updateGuest = (key: "rooms" | "adults" | "children", delta: number) => {
    setGuestState((prev) => {
      const nextValue = Math.max(0, prev[key] + delta);
      const updated = { ...prev, [key]: nextValue };

      if (key === "children" && nextValue < prev.childAges.length) {
        updated.childAges = prev.childAges.slice(0, nextValue);
      }

      if (key === "children" && nextValue > prev.childAges.length) {
        const addCount = nextValue - prev.childAges.length;
        updated.childAges = [
          ...prev.childAges,
          ...Array.from({ length: addCount }, () => 8),
        ];
      }

      return updated;
    });
  };

  const handleDateSelect = (day: number) => {
    const isoDate = `2026-10-${day.toString().padStart(2, "0")}`;

    if (!dateRange.checkIn || (dateRange.checkIn && dateRange.checkOut)) {
      setDateRange({ checkIn: isoDate, checkOut: "" });
      return;
    }

    const selectedDate = new Date(isoDate);
    const currentCheckIn = new Date(dateRange.checkIn);

    if (selectedDate > currentCheckIn) {
      setDateRange((prev) => ({ ...prev, checkOut: isoDate }));
      setCalendarOpen(false);
      return;
    }

    setDateRange({ checkIn: isoDate, checkOut: "" });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchCardRef.current &&
        !searchCardRef.current.contains(event.target as Node)
      ) {
        setDestinationOpen(false);
        setCalendarOpen(false);
        setGuestOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeCalendar = () => setCalendarOpen(false);
  const closeGuest = () => setGuestOpen(false);

  return (
    <div
      ref={searchCardRef}
      className="relative z-10 overflow-visible rounded-2xl bg-surface-container-lowest p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
    >
      <div className="mb-4 grid grid-cols-4 gap-1.5 rounded-xl bg-surface-container-low p-1">
        {SERVICE_TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-center font-label-md text-label-md transition-all ${
                active
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {tab.icon}
              </span>
              <span className="leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative">
        {activeTab === "flights" ? (
          <FlightForm />
        ) : (
        <div className="grid gap-2 md:grid-cols-[1.6fr_1.3fr_1.3fr_auto]">
          <div className="relative">
            <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-lowest text-primary shadow-xs">
                <span className="material-symbols-outlined text-[20px]">
                  location_on
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Where to?
                </p>
                <input
                  type="text"
                  value={destinationInput}
                  onFocus={() => setDestinationOpen(true)}
                  onChange={(event) => {
                    setDestinationInput(event.target.value);
                    setSelectedDestination(null);
                    setDestinationOpen(true);
                  }}
                  placeholder="Bangkok, Thailand"
                  className="mt-0.5 w-full border-0 bg-transparent p-0 text-sm font-medium text-on-surface outline-none placeholder:text-on-surface-variant"
                />
              </div>

              <span className="material-symbols-outlined text-[20px] text-outline-variant">
                chevron_right
              </span>
            </div>

            {destinationOpen && filteredDestinations.length > 0 && (
              <div className="absolute left-0 top-full z-20 mt-3 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="max-h-64 overflow-y-auto pr-1 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-slate-100">
                  {filteredDestinations.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSelectedDestination(option);
                        setDestinationInput(
                          `${option.name}, ${option.country}`,
                        );
                        setDestinationOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-slate-100"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {option.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {option.country}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-slate-500">
                        {option.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setCalendarOpen((prev) => !prev);
                setGuestOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl bg-surface-container-low p-3 text-left"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-lowest text-primary shadow-xs">
                <span className="material-symbols-outlined text-[20px]">
                  calendar_month
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Dates
                </p>
                <p className="mt-0.5 text-sm font-semibold text-on-surface">
                  {dateLabel}
                </p>
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
                    className="text-sm font-semibold text-slate-600"
                  >
                    ‹
                  </button>
                  <p className="text-sm font-bold text-slate-800">
                    October 2026
                  </p>
                  <button
                    type="button"
                    className="text-sm font-semibold text-slate-600"
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
                  {calendarDays.map((day) => {
                    const isoDate = `2026-10-${day.toString().padStart(2, "0")}`;
                    const isSelected =
                      dateRange.checkIn === isoDate ||
                      dateRange.checkOut === isoDate;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        className={`h-10 rounded-lg text-sm transition ${
                          isSelected
                            ? "bg-blue-600 text-white"
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

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setGuestOpen((prev) => !prev);
                setCalendarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl bg-surface-container-low p-3 text-left"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-lowest text-primary shadow-xs">
                <span className="material-symbols-outlined text-[20px]">
                  group
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Guests &amp; Rooms
                </p>
                <p className="mt-0.5 text-sm font-semibold text-on-surface">
                  {guestLabel}
                </p>
              </div>

              <span className="material-symbols-outlined text-[20px] text-outline-variant">
                tune
              </span>
            </button>

            {guestOpen && (
              <div className="absolute left-0 top-full z-20 mt-3 w-full max-w-[360px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <div className="space-y-4">
                  {[
                    { key: "rooms", label: "Rooms" },
                    { key: "adults", label: "Adults" },
                    { key: "children", label: "Children" },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateGuest(
                              item.key as "rooms" | "adults" | "children",
                              -1,
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm font-semibold text-slate-800">
                          {
                            guestState[
                              item.key as "rooms" | "adults" | "children"
                            ]
                          }
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateGuest(
                              item.key as "rooms" | "adults" | "children",
                              1,
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  {guestState.children > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-500">
                        Children ages
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {guestState.childAges.map((age, index) => (
                          <select
                            key={`${index}-${age}`}
                            value={age}
                            onChange={(event) => {
                              const nextAge = Number(event.target.value);
                              setGuestState((prev) => {
                                const updatedAges = [...prev.childAges];
                                updatedAges[index] = nextAge;
                                return { ...prev, childAges: updatedAges };
                              });
                            }}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                              (value) => (
                                <option key={value} value={value}>
                                  {value} years
                                </option>
                              ),
                            )}
                          </select>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              const destination = selectedDestination ?? {
                id: "manual",
                name: destinationInput.trim() || "Bangkok",
                country: "Thailand",
                type: "custom" as const,
              };

              const payload = {
                destination: destination.name,
                country: destination.country || "Thailand",
                checkIn: dateRange.checkIn,
                checkOut: dateRange.checkOut,
                adults: guestState.adults,
                children: guestState.children,
                rooms: guestState.rooms,
                tab: activeTab,
              };

              setBookingSearchParams(payload);

              const params = new URLSearchParams({
                destination: payload.destination,
                country: payload.country,
                checkIn: payload.checkIn,
                checkOut: payload.checkOut,
                adults: String(payload.adults),
                children: String(payload.children),
                rooms: String(payload.rooms),
                tab: payload.tab,
              });

              router.push(`/bookingdetails?${params.toString()}`);
            }}
            className="flex h-[52px] items-center justify-center gap-2 rounded-xl bg-secondary-container px-6 font-headline-sm text-headline-sm font-bold text-on-secondary shadow-[0_8px_20px_rgba(255,87,34,0.30)] transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[22px]">
              search
            </span>
            <span>{ctaLabel}</span>
          </button>
          </div>
        )}
      </div>
    </div>
  );
}
