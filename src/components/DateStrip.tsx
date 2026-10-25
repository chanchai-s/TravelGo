"use client";

import { useRouter } from "next/navigation";
import {
  dateRangeOptions,
  formatTHB,
} from "@/data/flightResults";

export function DateStrip({
  depart,
  ret,
  keep,
}: {
  depart?: string;
  ret?: string;
  keep: string;
}) {
  const router = useRouter();
  const options = dateRangeOptions(depart ?? "", ret ?? "");

  const pick = (nextDepart: string, nextRet: string) => {
    const params = new URLSearchParams(keep);
    params.set("depart", nextDepart);
    params.set("ret", nextRet);
    router.push(`/flight?${params.toString()}`);
  };

  return (
    <div className="rounded-2xl bg-surface-container-lowest shadow-sm">
      <div className="scrollbar-none flex items-stretch gap-2 overflow-x-auto p-2">
        {options.map((option) => {
          const active = option.depart === (depart ?? "") && option.ret === (ret ?? "");
          return (
            <button
              key={`${option.depart}-${option.ret}`}
              type="button"
              onClick={() => pick(option.depart, option.ret)}
              className={`flex min-w-[110px] flex-1 flex-col items-center rounded-xl px-3 py-2 transition-all ${
                active
                  ? "bg-surface-container-lowest font-bold text-on-surface shadow-md"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span className="whitespace-nowrap font-label-md text-label-md">
                {option.label}
              </span>
              <span
                className={`font-label-md text-label-md font-bold ${active ? "text-primary" : "text-tertiary"}`}
              >
                {formatTHB(option.price)}
              </span>
              {active ? <span className="mt-1 h-0.5 w-full rounded bg-primary" /> : null}
            </button>
          );
        })}
        <button
          type="button"
          className="flex min-w-[90px] flex-col items-center justify-center rounded-xl px-3 py-2 text-tertiary transition-all hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          <span className="font-label-md text-label-md">Price table</span>
        </button>
      </div>
    </div>
  );
}
