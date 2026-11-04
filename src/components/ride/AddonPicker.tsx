"use client";

import { formatMoney } from "@/lib/rideFormat";

export type AddonCatalogItem = {
  type: string;
  name: string;
  amount: number;
  description: string;
  services: string[];
};

export function AddonPicker({
  catalog,
  value,
  onChange,
}: {
  catalog: AddonCatalogItem[];
  value: Record<string, number>;
  onChange: (next: Record<string, number>) => void;
}) {
  const toggle = (type: string) => {
    const next = { ...value };
    if (next[type]) {
      delete next[type];
    } else {
      next[type] = 1;
    }
    onChange(next);
  };

  if (catalog.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {catalog.map((addon) => {
        const active = Boolean(value[addon.type]);
        return (
          <button
            key={addon.type}
            type="button"
            title={addon.description}
            onClick={() => toggle(addon.type)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-2 font-label-md text-label-md transition-all ${
              active
                ? "border-primary bg-primary text-on-primary"
                : "border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {active ? "check_circle" : "add_circle"}
            </span>
            <span>{addon.name}</span>
            <span className={active ? "text-on-primary/80" : "text-tertiary"}>{formatMoney(addon.amount)}</span>
          </button>
        );
      })}
    </div>
  );
}

export default AddonPicker;
