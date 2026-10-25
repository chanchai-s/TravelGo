"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HOME_SUBTYPES, type HomeSubtypeId } from "@/data/hostTypes";

export default function HostHomesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<HomeSubtypeId | null>(null);

  const go = () => {
    if (selected) {
      router.push(`/host/new?type=${selected}`);
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-margin py-4 md:py-8">
      <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
        บ้านพักแบบไหนที่ตรงกับที่พักของท่านที่สุด
      </h1>
      <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
        ที่พักประเภทบ้านพักโดยทั่วไปมีมากที่สุด
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {HOME_SUBTYPES.map((option) => {
          const active = option.id === selected;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              aria-pressed={active}
              className={`flex flex-col items-start gap-2 rounded-2xl border-2 bg-surface-container-lowest p-4 text-left shadow-sm transition-all active:scale-[0.98] ${
                active ? "border-primary" : "border-transparent"
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  active ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">{option.icon}</span>
              </span>
              <span className="font-label-lg text-label-lg font-bold text-on-surface">
                {option.name}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {option.desc}
              </span>
            </button>
          );
        })}
      </div>

      <button type="button" className="mt-3 font-body-md text-body-md text-on-surface-variant underline">
        บ้านพักแบบอื่นๆ
      </button>

      <div className="mt-6 flex items-center justify-between">
        <Link
          href="/host"
          className="rounded-full border border-outline-variant px-8 py-2.5 font-label-md text-label-md font-bold text-primary"
        >
          ย้อนกลับ
        </Link>
        <button
          type="button"
          disabled={selected === null}
          onClick={go}
          className="rounded-full bg-primary px-10 py-2.5 font-label-md text-label-md font-bold text-on-primary shadow-md transition-all active:scale-95 disabled:opacity-40"
        >
          ถัดไป
        </button>
      </div>
    </main>
  );
}
