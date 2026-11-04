"use client";

import type { RideJob } from "@/app/Api/mainApi";

export function DriverCard({
  job,
  rating,
  onChat,
}: {
  job: RideJob;
  rating?: number;
  onChat?: () => void;
}) {
  if (!job.driver) {
    // งานที่จบ/ยกเลิกแล้วไม่ควรขึ้นสถานะกำลังหาคนขับ
    return null;
  }

  const vehicle = job.vehicle;
  const initial = job.driver.name?.charAt(0) ?? "D";

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest p-3 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-headline-sm text-headline-sm font-bold text-on-primary">
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate font-label-lg text-label-lg font-bold text-on-surface">{job.driver.name}</p>
          {rating !== undefined ? (
            <span className="flex items-center gap-0.5 font-label-sm text-label-sm text-warning">
              <span className="material-symbols-outlined text-[14px]">star</span>
              {rating.toFixed(2)}
            </span>
          ) : null}
        </div>
        <p className="truncate font-body-sm text-body-sm text-tertiary">
          {[vehicle?.brand, vehicle?.model].filter(Boolean).join(" ") || "รถพร้อมบริการ"}
          {vehicle?.plateNo ? ` • ${vehicle.plateNo}` : ""}
          {vehicle?.color ? ` • ${vehicle.color}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 gap-1.5">
        {job.driver.phone ? (
          <a
            href={`tel:${job.driver.phone}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed text-primary"
            aria-label="โทรหาคนขับ"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
          </a>
        ) : null}
        {onChat ? (
          <button
            type="button"
            onClick={onChat}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant"
            aria-label="แชทกับคนขับ"
          >
            <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DriverCard;
