"use client";

import { useEffect, useState } from "react";
import { FLASH_SALE } from "@/data/homepage";

function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function FlashSaleBanner() {
  const [remaining, setRemaining] = useState(FLASH_SALE.initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-container p-4 text-on-primary shadow-md">
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white/10 blur-xl" />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-2.5 py-0.5 font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-secondary">
            <span className="material-symbols-outlined text-[14px]">bolt</span> Flash Sale
          </div>
          <h3 className="pt-1 font-headline-sm text-headline-sm font-bold">{FLASH_SALE.title}</h3>
          <p className="font-body-sm text-body-sm text-on-primary/80">
            {FLASH_SALE.couponLabel}{" "}
            <span className="font-bold underline decoration-secondary-fixed">
              {FLASH_SALE.couponCode}
            </span>
          </p>
        </div>
        <div className="min-w-[76px] rounded-xl bg-surface-container-lowest/15 p-2 text-center backdrop-blur-md">
          <span className="block font-label-sm text-label-sm uppercase text-on-primary/70">
            Ends in
          </span>
          <span className="font-label-lg text-label-lg font-bold tracking-tight text-on-primary">
            {formatCountdown(remaining)}
          </span>
        </div>
      </div>
    </div>
  );
}
