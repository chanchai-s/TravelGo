"use client";

import { STATUS_LABEL, STATUS_STEPS } from "@/lib/rideFormat";

const STEP_LABEL: Record<string, { label: string; icon: string }> = {
  SEARCHING: { label: "หาคนขับ", icon: "search" },
  ACCEPTED: { label: "รับงาน", icon: "check_circle" },
  ARRIVED: { label: "ถึงจุดรับ", icon: "where_to_vote" },
  IN_PROGRESS: { label: "เดินทาง", icon: "navigation" },
  COMPLETED: { label: "จบงาน", icon: "flag" },
};

export function StatusStepper({ status }: { status: string }) {
  if (status === "CANCELLED" || status === "EXPIRED") {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-error-container px-4 py-3">
        <span className="material-symbols-outlined text-[20px] text-on-error-container">cancel</span>
        <p className="font-label-md text-label-md font-semibold text-on-error-container">
          {STATUS_LABEL[status] ?? status}
        </p>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.indexOf(status as (typeof STATUS_STEPS)[number]);

  return (
    <div className="rounded-2xl bg-surface-container-lowest p-3 shadow-sm">
      <div className="flex items-start justify-between gap-1">
        {STATUS_STEPS.map((step, index) => {
          const done = currentIndex >= index;
          const active = currentIndex === index;
          const meta = STEP_LABEL[step];
          return (
            <div key={step} className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <div className="flex w-full items-center">
                <span className={`h-0.5 flex-1 ${index === 0 ? "opacity-0" : done ? "bg-primary" : "bg-outline-variant"}`} />
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    done
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-on-surface-variant"
                  } ${active ? "ring-4 ring-primary/15" : ""}`}
                >
                  <span className="material-symbols-outlined text-[16px]">{meta?.icon ?? "circle"}</span>
                </span>
                <span
                  className={`h-0.5 flex-1 ${
                    index === STATUS_STEPS.length - 1 ? "opacity-0" : done && currentIndex > index ? "bg-primary" : "bg-outline-variant"
                  }`}
                />
              </div>
              <span
                className={`text-center font-label-sm text-[10px] leading-tight ${
                  active ? "font-bold text-primary" : done ? "text-on-surface" : "text-tertiary"
                }`}
              >
                {meta?.label ?? step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatusStepper;
