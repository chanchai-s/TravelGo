"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PROPERTY_GROUPS, type PropertyGroupId } from "@/data/hostTypes";

export default function HostPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<PropertyGroupId | null>(null);

  const target = PROPERTY_GROUPS.find((group) => group.id === selected);

  return (
    <main className="mx-auto w-full max-w-3xl px-margin py-4 md:py-8">
      <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
        ที่พักของท่านเป็นแบบไหน?
      </h1>
      <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
        เลือกกลุ่มที่ตรงที่สุด แล้วกดถัดไป
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {PROPERTY_GROUPS.map((group) => {
          const active = group.id === selected;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setSelected(group.id)}
              aria-pressed={active}
              className={`flex items-start gap-3 rounded-2xl border-2 bg-surface-container-lowest p-4 text-left shadow-sm transition-all active:scale-[0.99] ${
                active ? "border-primary" : "border-transparent"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  active ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">{group.icon}</span>
              </span>
              <span>
                <span className="block font-label-lg text-label-lg font-bold text-on-surface">
                  {group.name}
                </span>
                <span className="mt-0.5 block font-body-sm text-body-sm text-on-surface-variant">
                  {group.desc}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link
          href="/homepage"
          className="rounded-full border border-outline-variant px-8 py-2.5 font-label-md text-label-md font-bold text-primary"
        >
          ย้อนกลับ
        </Link>
        <button
          type="button"
          disabled={selected === null}
          onClick={() => {
            if (target) {
              router.push(target.href);
            }
          }}
          className="rounded-full bg-primary px-10 py-2.5 font-label-md text-label-md font-bold text-on-primary shadow-md transition-all active:scale-95 disabled:opacity-40"
        >
          ถัดไป
        </button>
      </div>
    </main>
  );
}
