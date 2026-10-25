"use client";

import { useRouter } from "next/navigation";
import { formatTHB, type AllianceId } from "@/data/flightResults";

export type SidebarSelection = {
  nonstop: boolean;
  baggage: boolean;
  hideBudget: boolean;
  alliances: AllianceId[];
  airlines: string[];
};

function toggleList<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function FilterSidebar({
  selected,
  alliances,
  airlines,
  keep,
}: {
  selected: SidebarSelection;
  alliances: { id: AllianceId; label: string; min: number }[];
  airlines: { code: string; name: string; count: number; min: number }[];
  keep: string;
}) {
  const router = useRouter();

  const push = (next: SidebarSelection) => {
    const params = new URLSearchParams(keep);
    if (next.nonstop) {
      params.set("nonstop", "1");
    } else {
      params.delete("nonstop");
    }
    if (next.baggage) {
      params.set("baggage", "1");
    } else {
      params.delete("baggage");
    }
    if (next.hideBudget) {
      params.set("hideBudget", "1");
    } else {
      params.delete("hideBudget");
    }
    if (next.alliances.length > 0) {
      params.set("alliance", next.alliances.join(","));
    } else {
      params.delete("alliance");
    }
    if (next.airlines.length > 0) {
      params.set("airlines", next.airlines.join(","));
    } else {
      params.delete("airlines");
    }
    router.push(`/flight?${params.toString()}`);
  };

  const checkRow = (
    checked: boolean,
    onChange: () => void,
    label: React.ReactNode,
    price?: string,
  ) => (
    <label className="flex cursor-pointer items-center gap-2 py-1.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-primary"
      />
      <span className="min-w-0 flex-1 font-body-md text-body-md text-on-surface">{label}</span>
      {price !== undefined ? (
        <span className="font-label-md text-label-md font-bold text-on-surface">{price}</span>
      ) : null}
    </label>
  );

  return (
    <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
        Recommended
      </h3>
      <div className="mt-1">
        {checkRow(selected.nonstop, () => push({ ...selected, nonstop: !selected.nonstop }), "Nonstop")}
        {checkRow(
          selected.baggage,
          () => push({ ...selected, baggage: !selected.baggage }),
          "Checked baggage included",
        )}
        {checkRow(
          selected.hideBudget,
          () => push({ ...selected, hideBudget: !selected.hideBudget }),
          "Hide budget airlines",
        )}
      </div>

      <h3 className="mt-4 font-headline-sm text-headline-sm font-bold text-on-surface">
        Alliance
      </h3>
      <div className="mt-1">
        {alliances.map((item) => (
          <div key={item.id}>
            {checkRow(
              selected.alliances.includes(item.id),
              () => push({ ...selected, alliances: toggleList(selected.alliances, item.id) }),
              item.label,
              formatTHB(item.min),
            )}
          </div>
        ))}
      </div>

      <h3 className="mt-4 font-headline-sm text-headline-sm font-bold text-on-surface">
        Airlines
      </h3>
      <div className="mt-1">
        {airlines.map((item) => (
          <div key={item.code}>
            {checkRow(
              selected.airlines.includes(item.code),
              () => push({ ...selected, airlines: toggleList(selected.airlines, item.code) }),
              `${item.name} (${item.count})`,
              formatTHB(item.min),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
