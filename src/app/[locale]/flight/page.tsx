import Link from "next/link";
import { STAYS } from "@/data/homepage";
import {
  ALLIANCES,
  RESULT_FLIGHTS,
  filterFlights,
  formatTHB,
  sortFlights,
  type AllianceId,
  type ResultFlight,
  type SortId,
} from "@/data/flightResults";
import { DateStrip } from "@/components/DateStrip";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ResultSearchBar } from "@/components/ResultSearchBar";

type FlightQuery = {
  from?: string;
  to?: string;
  depart?: string;
  ret?: string;
  pax?: string;
  class?: string;
  bundle?: string;
  trip?: string;
  nonstop?: string;
  baggage?: string;
  hideBudget?: string;
  alliance?: string;
  airlines?: string;
  sort?: string;
};

function formatShort(value?: string): string {
  if (!value) {
    return "";
  }
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function codeClass(tone: ResultFlight["codeTone"]): string {
  switch (tone) {
    case "blue":
      return "bg-primary-fixed text-primary";
    case "grey":
      return "bg-surface-container-high text-primary";
    case "coral":
      return "bg-secondary-fixed text-secondary";
  }
}

function ResultCard({ flight }: { flight: ResultFlight }) {
  return (
    <div className="flex flex-col gap-space-sm overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg font-label-md text-label-md font-bold ${codeClass(flight.codeTone)}`}
          >
            {flight.code}
          </div>
          <div>
            <h3 className="font-label-md text-label-md font-bold text-on-surface">
              {flight.airline}
            </h3>
            <span className="font-body-sm text-body-sm text-tertiary">{flight.flightNo}</span>
          </div>
        </div>
        {flight.tag !== undefined ? (
          <div className="flex items-center gap-1 rounded-full bg-primary-fixed px-2.5 py-1 font-label-sm text-label-sm font-bold text-primary">
            {flight.tag}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between py-space-xs">
        <div className="flex flex-col">
          <span className="font-headline-md text-headline-md font-extrabold text-on-surface">
            {flight.departTime}
          </span>
          <span className="font-label-md text-label-md font-bold text-on-surface">
            {flight.departCode}
          </span>
          <span className="font-body-sm text-body-sm text-tertiary">{flight.departAirport}</span>
        </div>
        <div className="flex flex-1 flex-col items-center px-4">
          <span className="font-body-sm text-body-sm font-medium text-tertiary">
            {flight.duration}
          </span>
          <div className="relative my-1 flex w-full items-center">
            <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div className="relative h-0.5 flex-1 bg-surface-variant">
              <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[14px] text-primary">
                flight
              </span>
            </div>
            <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
          </div>
          <span className="font-label-sm text-label-sm font-semibold text-primary">
            {flight.stopsLabel}
          </span>
          {flight.transit !== undefined ? (
            <span className="font-body-sm text-body-sm text-tertiary">{flight.transit}</span>
          ) : null}
        </div>
        <div className="flex flex-col text-right">
          <span className="font-headline-md text-headline-md font-extrabold text-on-surface">
            {flight.arriveTime}
          </span>
          <span className="font-label-md text-label-md font-bold text-on-surface">
            {flight.arriveCode}
          </span>
          <span className="font-body-sm text-body-sm text-tertiary">{flight.arriveAirport}</span>
        </div>
      </div>

      {flight.baggage !== undefined ? (
        <p className="font-label-sm text-label-sm font-semibold text-primary">
          {flight.baggage}
        </p>
      ) : null}

      <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-2.5 pt-2">
        {flight.perks.map((perk) => (
          <div
            key={perk.label}
            className="flex items-center gap-1 font-body-sm text-body-sm text-tertiary"
          >
            <span className={`material-symbols-outlined text-[16px] ${perk.iconClass}`}>
              {perk.icon}
            </span>
            <span>{perk.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="font-body-sm text-body-sm text-tertiary">Total / passenger</span>
          <div className="flex items-baseline gap-1">
            <span className="font-headline-md text-headline-md font-extrabold text-on-surface">
              {formatTHB(flight.priceTHB)}
            </span>
            {flight.oldPriceTHB !== undefined ? (
              <span className="font-body-sm text-body-sm text-outline line-through">
                {formatTHB(flight.oldPriceTHB)}
              </span>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          className={`flex h-12 items-center gap-1.5 rounded-xl px-6 font-label-lg text-label-lg font-bold shadow-md transition-all hover:opacity-90 active:scale-95 ${
            flight.ctaTone === "coral"
              ? "bg-secondary-container text-on-secondary"
              : "bg-primary text-on-primary"
          }`}
        >
          Select
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

function pickParams(query: FlightQuery, keys: (keyof FlightQuery)[]): string {
  const params = new URLSearchParams();
  keys.forEach((key) => {
    const value = query[key];
    if (value !== undefined && value !== "") {
      params.set(key, value);
    }
  });
  return params.toString();
}

const SEARCH_KEYS: (keyof FlightQuery)[] = [
  "from",
  "to",
  "depart",
  "ret",
  "pax",
  "class",
  "bundle",
  "trip",
];

const FILTER_KEYS: (keyof FlightQuery)[] = [
  "nonstop",
  "baggage",
  "hideBudget",
  "alliance",
  "airlines",
  "sort",
];

const SORT_TABS: { id: SortId; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "nonstop", label: "Nonstop first" },
  { id: "cheapest", label: "Cheapest" },
];

export default async function FlightPage({
  searchParams,
}: {
  searchParams: Promise<FlightQuery>;
}) {
  const query = await searchParams;
  const bundle = query.bundle === "1";
  const bundleStay = bundle ? STAYS[0] : undefined;

  const selected = {
    nonstop: query.nonstop === "1",
    baggage: query.baggage === "1",
    hideBudget: query.hideBudget === "1",
    alliances: (query.alliance ?? "").split(",").filter(Boolean) as AllianceId[],
    airlines: (query.airlines ?? "").split(",").filter(Boolean),
  };
  const sort: SortId =
    query.sort === "cheapest" || query.sort === "nonstop" ? query.sort : "recommended";

  const results = sortFlights(filterFlights(RESULT_FLIGHTS, selected), sort);

  const searchKeep = pickParams(query, FILTER_KEYS);
  const filterKeep = pickParams(query, SEARCH_KEYS);
  const fullKeep = pickParams(query, [...SEARCH_KEYS, ...FILTER_KEYS]);
  const summary = `${query.pax ?? "2"} Travelers • ${query.class ?? "Economy"}`;

  const allianceData = ALLIANCES.map((item) => ({
    ...item,
    min: Math.min(
      ...RESULT_FLIGHTS.filter((flight) => flight.alliance === item.id).map(
        (flight) => flight.priceTHB,
      ),
    ),
  })).filter((item) => Number.isFinite(item.min));

  const airlineMap = new Map<string, { name: string; count: number; min: number }>();
  RESULT_FLIGHTS.forEach((flight) => {
    const current = airlineMap.get(flight.code);
    if (current === undefined) {
      airlineMap.set(flight.code, { name: flight.airline, count: 1, min: flight.priceTHB });
    } else {
      current.count += 1;
      current.min = Math.min(current.min, flight.priceTHB);
    }
  });
  const airlineData = [...airlineMap.entries()].map(([code, info]) => ({ code, ...info }));

  return (
    <main className="mx-auto w-full max-w-5xl px-margin py-4 md:py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container">
            <span className="material-symbols-outlined text-[20px] text-on-primary-container">
              explore
            </span>
          </div>
          <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">
            Flights
          </span>
        </div>
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-11 w-11 items-center justify-center text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <span className="material-symbols-outlined text-[18px] text-on-primary">person</span>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="mt-4">
        <ResultSearchBar
          from={query.from}
          to={query.to}
          depart={query.depart}
          ret={query.ret}
          summary={summary}
          trip={query.trip ?? "round-trip"}
          keep={searchKeep}
        />
      </div>

      {bundle && bundleStay !== undefined ? (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-md">
          <img
            alt={bundleStay.imageAlt}
            src={bundleStay.image}
            className="h-16 w-16 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
              Flight + Hotel bundle
            </p>
            <p className="truncate font-label-lg text-label-lg font-bold text-on-surface">
              {bundleStay.name} • {bundleStay.price}/night
            </p>
            <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
              {bundleStay.location}
            </p>
          </div>
        </div>
      ) : null}

      {/* Date strip */}
      <div className="mt-4">
        <DateStrip depart={query.depart} ret={query.ret} keep={fullKeep} />
      </div>

      {/* Results */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <FilterSidebar
              selected={selected}
              alliances={allianceData}
              airlines={airlineData}
              keep={filterKeep}
            />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {query.from ?? "Bangkok"} → {query.to ?? "Chiang Mai"}
            </h2>
            <span className="font-label-md text-label-md text-tertiary">
              {results.length} flights
            </span>
          </div>

          <div className="mb-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-container-lowest p-1 shadow-sm">
            {SORT_TABS.map((tab) => {
              const active = sort === tab.id;
              const params = new URLSearchParams(filterKeep);
              params.set("sort", tab.id);
              return (
                <Link
                  key={tab.id}
                  href={`/flight?${params.toString()}`}
                  className={`rounded-lg px-2 py-2 text-center font-label-md text-label-md transition-all ${
                    active
                      ? "bg-surface-container-low font-bold text-primary shadow-sm"
                      : "text-tertiary hover:text-on-surface"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl bg-surface-container-lowest p-8 text-center shadow-sm">
              <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                No flights match your filters
              </p>
              <Link
                href={`/flight?${filterKeep}`}
                className="mt-2 inline-block font-label-md text-label-md font-bold text-primary"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {results.map((flight) => (
                <ResultCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
