"use client";

import Link from "next/link";

export default function HostUniquePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-margin py-4 md:py-8">
      <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
        ที่พักที่มีเอกลักษณ์เฉพาะตัว
      </h1>
      <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
        บูทีค เรือ บ้านต้นไม้ ฟาร์มสเตย์ หรือปราสาท
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Link
          href="/host/new?type=UNIQUE"
          className="flex flex-col items-start gap-2 rounded-2xl bg-surface-container-lowest p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-primary">
            <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
          </span>
          <span className="font-label-lg text-label-lg font-bold text-on-surface">
            ที่พักเอกลักษณ์
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            ที่พักไม่เหมือนใคร ดีไซน์เฉพาะตัว
          </span>
        </Link>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link
          href="/host"
          className="rounded-full border border-outline-variant px-8 py-2.5 font-label-md text-label-md font-bold text-primary"
        >
          ย้อนกลับ
        </Link>
        <Link
          href="/host/new?type=UNIQUE"
          className="rounded-full bg-primary px-10 py-2.5 font-label-md text-label-md font-bold text-on-primary shadow-md transition-all active:scale-95"
        >
          ถัดไป
        </Link>
      </div>
    </main>
  );
}
