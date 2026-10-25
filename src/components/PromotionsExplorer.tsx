"use client";

import { useEffect, useRef, useState } from "react";
import {
  CATEGORY_CHIPS,
  HERO_DEAL,
  PROMO_HEADER,
  PROMO_SEARCH,
  VALID_PROMO_CODES,
  VOUCHERS,
  type Voucher,
  type VoucherFilter,
} from "@/data/promotions";

function VoucherCard({
  voucher,
  collected,
  onCollect,
  onCopy,
}: {
  voucher: Voucher;
  collected: boolean;
  onCollect: () => void;
  onCopy: () => void;
}) {
  const accent = voucher.highlight ? "text-secondary-container" : "text-primary";
  const accentBg = voucher.highlight ? "bg-secondary-container/10" : "bg-primary/10";

  return (
    <div className="relative flex flex-row items-stretch overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
      <div className={`flex w-28 flex-col items-center justify-center p-3 text-center ${accentBg}`}>
        <span className={`font-headline-lg text-headline-lg font-extrabold leading-none tracking-tight ${accent}`}>
          {voucher.discountMain}
        </span>
        <span className={`mt-1 font-label-sm text-label-sm font-bold uppercase tracking-wider ${accent}`}>
          {voucher.discountSub}
        </span>
        <div className={`mt-2 flex items-center gap-1 ${accent}`}>
          <span className="material-symbols-outlined text-[14px]">{voucher.icon}</span>
          <span className="text-[10px] font-bold uppercase">{voucher.tag}</span>
        </div>
      </div>

      <div className="relative z-10 flex w-0 flex-col items-center justify-between">
        <div className="-ml-2 -mt-2 h-4 w-4 rounded-full bg-surface shadow-inner" />
        <div className="my-1 h-full border-l-2 border-dashed border-outline-variant/60" />
        <div className="-mb-2 -ml-2 h-4 w-4 rounded-full bg-surface shadow-inner" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5 pl-4">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-[11px] font-bold tracking-widest text-on-surface">
                {voucher.code}
              </span>
              {voucher.hotDeal === true ? (
                <span className="rounded-full bg-secondary-container px-1.5 py-0.5 font-label-sm text-[10px] font-extrabold text-on-secondary">
                  HOT DEAL
                </span>
              ) : null}
            </div>
            <button
              type="button"
              aria-label={`Copy code ${voucher.code}`}
              onClick={onCopy}
              className="text-tertiary transition-colors hover:text-primary"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
            </button>
          </div>
          <h3 className="mt-1.5 font-headline-sm text-[15px] font-bold leading-snug text-on-surface">
            {voucher.title}
          </h3>
          <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
            {voucher.condition}
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 font-body-sm text-[11px] text-on-surface-variant">
            <span className="material-symbols-outlined text-[13px]">event</span>
            <span>{voucher.expiry}</span>
          </div>
          <button
            type="button"
            onClick={onCollect}
            className={`flex items-center gap-1 rounded-xl px-3.5 py-1.5 font-label-sm text-label-sm font-bold shadow-sm transition-all active:scale-95 ${
              collected
                ? "bg-surface-container-high text-primary"
                : "bg-primary-container text-on-primary-container"
            }`}
          >
            {collected ? (
              <>
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                <span>Collected ✓</span>
              </>
            ) : (
              <span>Collect Voucher</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PromotionsExplorer() {
  const [promoInput, setPromoInput] = useState("");
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [claimed, setClaimed] = useState(false);
  const [filter, setFilter] = useState<VoucherFilter>("all");
  const [collected, setCollected] = useState<ReadonlySet<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current !== null) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const applyPromo = () => {
    const val = promoInput.trim().toUpperCase();
    if (val === "") {
      setFeedback({ ok: false, text: "Please enter a valid voucher code." });
      return;
    }
    if (VALID_PROMO_CODES.includes(val)) {
      setFeedback({ ok: true, text: `Promo code "${val}" applied successfully! ฿500 saved.` });
      showToast(`Code "${val}" applied!`);
      setPromoInput("");
    } else {
      setFeedback({ ok: false, text: `Code "${val}" is expired or invalid.` });
    }
  };

  const copyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard !== undefined) {
      navigator.clipboard.writeText(code).catch(() => undefined);
    }
    showToast(`Copied code: ${code}`);
  };

  const collect = (id: string) => {
    if (collected.has(id)) {
      showToast("Already in your collected list");
      return;
    }
    setCollected(new Set(collected).add(id));
    showToast("Voucher added to your wallet!");
  };

  const claim = () => {
    if (claimed) {
      return;
    }
    setClaimed(true);
    showToast("฿1,500 Cash Voucher credited!");
  };

  const visible =
    filter === "all" ? VOUCHERS : VOUCHERS.filter((voucher) => voucher.category === filter);

  return (
    <>
      {/* Title */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-label-sm text-label-sm font-extrabold uppercase tracking-wider text-primary">
            {PROMO_HEADER.eyebrow}
          </p>
          <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
            {PROMO_HEADER.title}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-secondary-fixed px-2.5 py-1 text-on-secondary-fixed shadow-sm">
          <span className="material-symbols-outlined text-[16px] text-secondary-container">
            local_fire_department
          </span>
          <span className="font-label-sm text-label-sm font-bold">{PROMO_HEADER.activeCount}</span>
        </div>
      </div>

      {/* Promo Code Search */}
      <div className="relative flex items-center rounded-xl bg-surface-container-lowest p-1.5 shadow-sm">
        <div className="flex items-center pl-2.5 pr-1 text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
        </div>
        <input
          type="text"
          value={promoInput}
          onChange={(event) => setPromoInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              applyPromo();
            }
          }}
          placeholder={PROMO_SEARCH.placeholder}
          className="w-full bg-transparent px-2 font-body-md text-body-md uppercase tracking-wide text-on-surface placeholder:text-outline focus:outline-none"
        />
        <button
          type="button"
          onClick={applyPromo}
          className="whitespace-nowrap rounded-lg bg-primary-container px-4 py-2 font-label-md text-label-md font-bold text-on-primary-container shadow-sm transition-all hover:opacity-95 active:scale-95"
        >
          Apply
        </button>
      </div>
      {feedback !== null ? (
        <p
          className={`mt-1.5 px-1 font-label-sm text-label-sm font-semibold ${
            feedback.ok ? "text-primary" : "text-error"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}

      {/* Hero Banner */}
      <div className="my-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-container via-primary to-on-primary-fixed-variant p-5 text-on-primary shadow-md">
          <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-white/10 blur-xl" />
          <div className="pointer-events-none absolute -right-4 -top-10 h-32 w-32 rounded-full bg-secondary-container/20 blur-lg" />
          <div className="relative z-10 flex flex-col justify-between">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1 rounded-full bg-secondary-container px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-on-secondary shadow-sm">
                <span className="material-symbols-outlined text-[13px]">flash_on</span>
                {HERO_DEAL.tag}
              </span>
              <span className="flex items-center gap-1 font-label-sm text-label-sm font-bold text-primary-fixed">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                {HERO_DEAL.countdown}
              </span>
            </div>
            <h2 className="mt-1 font-headline-sm text-headline-sm font-extrabold leading-snug text-on-primary">
              {HERO_DEAL.title}
            </h2>
            <p className="mb-4 mt-1 font-body-sm text-body-sm leading-relaxed text-primary-fixed">
              Up to <span className="font-body-md text-body-md font-bold text-secondary-fixed">50% OFF</span>{" "}
              + ฿1,500 extra instant cash voucher for cross-border trips!
            </p>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center -space-x-2">
                {["hotel", "flight", "directions_car"].map((icon) => (
                  <div
                    key={icon}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-lowest/20 text-[12px] font-bold text-on-primary backdrop-blur-sm"
                  >
                    <span className="material-symbols-outlined text-[15px]">{icon}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={claim}
                disabled={claimed}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 font-label-md text-label-md font-bold shadow-md transition-all active:scale-95 ${
                  claimed
                    ? "bg-surface-container-lowest/30 text-on-primary"
                    : "bg-secondary-container text-on-secondary hover:bg-secondary"
                }`}
              >
                {claimed ? (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>{HERO_DEAL.claimedLabel}</span>
                  </>
                ) : (
                  <>
                    <span>{HERO_DEAL.claimLabel}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Chips */}
      <div className="my-2">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto text-nowrap pb-1">
          {CATEGORY_CHIPS.map((chip) => {
            const active = chip.id === filter;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilter(chip.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-label-md text-label-md shadow-sm transition-colors ${
                  active
                    ? "bg-primary-container font-bold text-on-primary"
                    : "bg-surface-container-lowest font-semibold text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{chip.icon}</span>
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vouchers */}
      <div className="my-3 flex flex-col gap-3.5">
        {visible.map((voucher) => (
          <VoucherCard
            key={voucher.id}
            voucher={voucher}
            collected={collected.has(voucher.id)}
            onCollect={() => collect(voucher.id)}
            onCopy={() => copyCode(voucher.code)}
          />
        ))}
      </div>

      {/* Toast */}
      <div
        className={`fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-inverse-surface px-4 py-2 font-label-md text-label-md text-inverse-on-surface shadow-xl transition-all duration-300 md:bottom-8 ${
          toast !== null ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <span className="material-symbols-outlined text-[18px] text-secondary-container">
          check_circle
        </span>
        <span>{toast ?? ""}</span>
      </div>
    </>
  );
}
