"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiltersSidebar } from "@/components/FiltersSidebar";
import { StayFilters } from "@/components/StayFilters";
import { scoreResult, useBookingStore, type BookingResult } from "@/app/stores/booking.stores";

type SortTab = "recommended" | "price" | "rating";

const SORT_TABS: { id: SortTab; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "price", label: "ราคาต่ำสุด" },
  { id: "rating", label: "คะแนนสูงสุด" },
];

function BookingDetailsContent() {
  const searchParams = useSearchParams();
  const { setSearchParams, searchHotels, searchStays, results, stays, loading, error } =
    useBookingStore();
  const [sort, setSort] = useState<SortTab>("recommended");

  const destination = searchParams.get("destination") ?? "Bangkok";
  const country = searchParams.get("country") ?? "Thailand";
  const checkIn = searchParams.get("checkIn") ?? "2026-10-11";
  const checkOut = searchParams.get("checkOut") ?? "2026-10-14";
  const adults = searchParams.get("adults") ?? "2";
  const children = searchParams.get("children") ?? "0";
  const rooms = searchParams.get("rooms") ?? "1";

  useEffect(() => {
    const payload = {
      destination,
      country,
      checkIn,
      checkOut,
      adults: Number(adults),
      children: Number(children),
      rooms: Number(rooms),
      // ตัวกรองจาก query param (ของที่พักเรา)
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      stars: searchParams.get("stars") ? Number(searchParams.get("stars")) : undefined,
      propertyType: searchParams.get("propertyType") ?? undefined,
      amenity: searchParams.get("amenity") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
    };

    setSearchParams(payload);
    void searchHotels(payload);
    void searchStays(payload);
  }, [
    destination,
    country,
    checkIn,
    checkOut,
    adults,
    children,
    rooms,
    searchParams,
    setSearchParams,
    searchHotels,
    searchStays,
  ]);

  const hotelList = useMemo(() => {
    type CardItem = BookingResult & {
      source: "bookingcom" | "wandergo";
      stars: number;
      rating: number;
      reviews: number;
      tag: string;
      originalPrice: number;
      features: string[];
      distance: string;
    };
    const mappedResults: CardItem[] = results.map((hotel) => ({
      id: String(hotel.id ?? crypto.randomUUID()),
      source: "bookingcom" as const,
      name: hotel.name ?? "Hotel",
      location: hotel.location ?? hotel.country ?? "Destination",
      country: hotel.country ?? "Thailand",
      stars: Number(hotel.stars ?? 4),
      rating: Number(hotel.rating ?? 8.8),
      reviews: Number(hotel.reviews ?? 120),
      tag: hotel.tag ?? "Popular",
      price: Number(hotel.price ?? 0),
      originalPrice: Number(
        hotel.originalPrice ?? (hotel.price ? hotel.price * 1.2 : 0),
      ),
      image:
        hotel.image ??
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      imageAlt: hotel.imageAlt ?? `${hotel.name ?? "Hotel"} exterior`,
      features: Array.isArray(hotel.features)
        ? hotel.features
        : ["Free Wi‑Fi", "Breakfast"],
      distance: hotel.distance ?? "Near the city center",
    }));
    const mappedStays: CardItem[] = stays.map((stay) => ({
      ...stay,
      source: "wandergo" as const,
      stars: stay.stars ?? 4,
      rating: stay.rating ?? 0,
      reviews: stay.reviews ?? 0,
      tag: stay.tag ?? "WanderGo",
      originalPrice: stay.originalPrice ?? 0,
      features: stay.features ?? [],
      distance: stay.distance ?? "Thailand",
      image:
        stay.image ??
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    }));
    const merged = [...mappedStays, ...mappedResults];
    const prices = merged.map((item) => item.price).filter((price) => price > 0);
    const median =
      prices.length > 0
        ? [...prices].sort((a, b) => a - b)[Math.floor(prices.length / 2)] ?? 0
        : 0;
    const sorted = [...merged];
    if (sort === "price") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === "rating") {
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else {
      sorted.sort((a, b) => scoreResult(b, median) - scoreResult(a, median));
    }
    return sorted;
  }, [results, stays, sort]);

  return (
    <main className="mx-auto w-full max-w-7xl px-margin py-4 md:py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-container">
            <span className="material-symbols-outlined text-[22px] text-on-primary-container">
              hotel
            </span>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              Hotel Search
            </p>
            <h1 className="font-headline-lg text-headline-lg font-extrabold tracking-tight text-on-surface">
              {destination}, {country}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-surface-container-lowest p-1 shadow-sm">
          {SORT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSort(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                sort === tab.id
                  ? "bg-surface-container-low font-bold text-primary shadow-sm"
                  : "text-tertiary hover:text-on-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-surface-container-lowest p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <span className="rounded-full bg-sky-50 px-3 py-1.5 font-semibold text-sky-700">
            {destination}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5">
            {checkIn} → {checkOut}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5">
            {rooms} room
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5">
            {adults} adults
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5">
            {children} children
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <FiltersSidebar />

        <section className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-surface-container-low p-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Search results
              </p>
              <h2 className="mt-1 font-headline-sm text-headline-sm font-bold text-on-surface">
                {hotelList.length} stays found in {destination}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="material-symbols-outlined text-[18px]">
                tune
              </span>
              Refine
            </div>
          </div>

          <div className="space-y-4">
            {loading && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                Searching hotels for {destination}...
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            {!loading && !error && hotelList.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No hotel results were returned for this search.
              </div>
            )}

            {!loading &&
              hotelList.map((hotel) => (
                <article
                  key={hotel.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex flex-col gap-4 p-3 md:flex-row">
                    <div className="relative h-52 w-full overflow-hidden rounded-2xl md:w-72">
                      <img
                        alt={hotel.imageAlt}
                        src={hotel.image}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute left-3 top-3 flex items-center gap-1.5">
                        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary shadow-sm">
                          {hotel.tag}
                        </span>
                        {hotel.source === "wandergo" ? (
                          <span className="rounded-full bg-secondary-container px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-on-secondary shadow-sm">
                            WanderGo
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-1.5 text-amber-500">
                            {Array.from({ length: hotel.stars }).map(
                              (_, index) => (
                                <span
                                  key={`${hotel.id}-star-${index}`}
                                  className="material-symbols-outlined text-[16px]"
                                >
                                  star
                                </span>
                              ),
                            )}
                          </div>
                          <h3 className="truncate font-headline-sm text-headline-sm font-bold text-on-surface">
                            {hotel.name}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            {hotel.location}
                          </p>
                          <p className="mt-2 text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
                            {hotel.distance}
                          </p>
                        </div>

                        <div className="rounded-xl bg-emerald-50 px-2.5 py-2 text-right">
                          <div className="flex items-center justify-end gap-1 text-sm font-bold text-emerald-700">
                            <span className="material-symbols-outlined text-[16px]">
                              grade
                            </span>
                            {hotel.rating}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {hotel.reviews} reviews
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {hotel.features.map((feature: string) => (
                          <span
                            key={`${hotel.id}-${feature}`}
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
                        <div>
                          <p className="text-xs text-slate-500">From</p>
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="font-headline-md text-headline-md font-extrabold text-primary">
                              ฿{hotel.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-slate-400 line-through">
                              ฿{hotel.originalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={
                            hotel.source === "wandergo"
                              ? `/bookingdetails/${hotel.id}?source=wandergo`
                              : `/bookingdetails/${hotel.id}`
                          }
                          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary shadow-sm transition-transform active:scale-[0.98]"
                        >
                          View deal
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>

      {/* ตัวกรองผลลัพธ์ (ใช้กับที่พักของ WanderGo) */}
      <div className="mt-6">
        <StayFilters />
      </div>
    </main>
  );
}

export default function BookingDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-7xl px-margin py-8 text-center text-slate-500">
          Loading search results...
        </main>
      }
    >
      <BookingDetailsContent />
    </Suspense>
  );
}
