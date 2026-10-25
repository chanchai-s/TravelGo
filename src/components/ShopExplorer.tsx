"use client";

import { useEffect, useRef, useState } from "react";
import {
  DELIVERY,
  HERO_PRODUCT,
  SHOP_CATEGORIES,
  SHOP_SEARCH,
  type DeliveryMode,
} from "@/data/shopping";

export function ShopExplorer() {
  const [mode, setMode] = useState<DeliveryMode>("hotel");
  const [category, setCategory] = useState("all");
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const addHero = () => {
    if (added) {
      return;
    }
    setAdded(true);
    timer.current = setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      {/* Delivery Context */}
      <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex min-w-0 items-center gap-space-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-fixed">
              <span className="material-symbols-outlined text-[20px] text-primary">hotel</span>
            </div>
            <div className="min-w-0">
              <div className="flex cursor-pointer items-center gap-1">
                <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">
                  {DELIVERY.label}
                </span>
                <span className="material-symbols-outlined text-[16px] text-primary">
                  expand_more
                </span>
              </div>
              <p className="truncate font-headline-sm text-headline-sm font-bold text-on-surface">
                {DELIVERY.place}
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary-fixed px-2.5 py-1 font-label-sm text-on-secondary-fixed-variant">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary-container" />
            {DELIVERY.fastTag}
          </span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="material-symbols-outlined text-[18px] text-secondary-container">
            bolt
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {DELIVERY.noticePrefix}{" "}
            <span className="font-bold text-on-surface">{DELIVERY.noticeMins}</span>{" "}
            {DELIVERY.noticeMid}{" "}
            <span className="font-bold text-on-surface">{DELIVERY.noticeTime}</span>
          </p>
        </div>
        <div className="mt-1 grid grid-cols-3 gap-1 rounded-lg bg-surface-container-low p-1 text-center">
          {DELIVERY.modes.map((item) => {
            const active = item.id === mode;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`truncate rounded-md px-1 py-1.5 font-label-sm transition-all ${
                  active
                    ? "bg-surface-container-lowest font-bold text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-3.5 flex items-center text-tertiary">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </div>
        <input
          type="search"
          placeholder={SHOP_SEARCH.placeholder}
          className="h-12 w-full rounded-xl bg-surface-container-lowest pl-11 pr-12 font-body-md text-body-md text-on-surface shadow-[0_2px_8px_rgba(15,23,42,0.04)] placeholder:text-outline focus:outline-none focus:ring-0"
        />
        <button
          type="button"
          aria-label="Filters"
          className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="no-scrollbar -mx-margin flex items-center gap-2 overflow-x-auto px-margin py-1">
        {SHOP_CATEGORIES.map((chip) => {
          const active = chip.id === category;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setCategory(chip.id)}
              className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 font-label-md ${
                active
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "bg-surface-container-lowest text-on-surface shadow-[0_1px_4px_rgba(15,23,42,0.04)]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{chip.icon}</span>
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Hero Product */}
      <div className="flex flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
        <div className="relative aspect-square w-full overflow-hidden bg-surface-container">
          <img
            alt={HERO_PRODUCT.imageAlt}
            src={HERO_PRODUCT.image}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="flex items-center gap-1 rounded-full bg-on-surface/80 px-2.5 py-1 font-label-sm text-surface backdrop-blur-md">
              <span className="material-symbols-outlined text-[14px] text-secondary-container">
                verified
              </span>
              {HERO_PRODUCT.curatedTag}
            </span>
          </div>
          <div className="absolute right-3 top-3">
            <button
              type="button"
              aria-label="Save to favorites"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest/90 text-on-surface-variant shadow-sm backdrop-blur-sm transition-colors hover:text-secondary-container"
            >
              <span className="material-symbols-outlined text-[18px]">favorite</span>
            </button>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="rounded-full bg-secondary-container px-2.5 py-1 font-label-sm text-on-secondary shadow-md">
              {HERO_PRODUCT.discountTag}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-space-sm p-space-md">
          <div className="flex items-center justify-between">
            <span className="font-label-sm font-bold uppercase tracking-wide text-primary">
              {HERO_PRODUCT.eyebrow}
            </span>
            <div className="flex items-center gap-1 font-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-amber-500">star</span>
              <span className="font-bold text-on-surface">{HERO_PRODUCT.rating}</span>
              <span>{HERO_PRODUCT.reviews}</span>
            </div>
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md font-bold leading-tight text-on-surface">
              {HERO_PRODUCT.name}
            </h2>
            <p className="mt-1 line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">
              {HERO_PRODUCT.desc}
            </p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-md text-headline-md font-extrabold text-secondary-container">
                {HERO_PRODUCT.price}
              </span>
              <span className="font-body-sm text-body-sm text-outline line-through">
                {HERO_PRODUCT.oldPrice}
              </span>
            </div>
            <button
              type="button"
              onClick={addHero}
              className={`flex h-11 items-center gap-2 rounded-xl px-5 font-label-lg shadow-md transition-all active:scale-95 ${
                added
                  ? "bg-primary text-on-primary"
                  : "bg-secondary-container text-on-secondary hover:bg-secondary"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {added ? "check" : "shopping_cart"}
              </span>
              {added ? HERO_PRODUCT.addedLabel : HERO_PRODUCT.addLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
