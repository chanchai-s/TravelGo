import Link from "next/link";
import { HOTEL_SUBTYPES } from "@/data/hostTypes";

export default function HostHotelPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-margin py-4 md:py-8">
      <Link
        href="/host"
        className="inline-flex items-center gap-1 font-label-md text-label-md font-bold text-primary"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        ลงประกาศที่พัก
      </Link>
      <h1 className="mt-2 font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
        โรงแรมเป็นที่พักแบบไหน?
      </h1>
      <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
        เลือกประเภทย่อยเพื่อเข้าฟอร์ม 8 ขั้นตอน
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {HOTEL_SUBTYPES.map((option) => (
          <Link
            key={option.id}
            href={`/host/new?type=${option.id}`}
            className="flex flex-col items-start gap-2 rounded-2xl bg-surface-container-lowest p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-primary">
              <span className="material-symbols-outlined text-[24px]">{option.icon}</span>
            </span>
            <span className="font-label-lg text-label-lg font-bold text-on-surface">
              {option.name}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {option.desc}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
