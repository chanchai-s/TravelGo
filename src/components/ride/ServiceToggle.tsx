"use client";

import type { RideServiceType } from "@/app/Api/mainApi";
import { SERVICE_ICON, SERVICE_LABEL } from "@/lib/rideFormat";

const SERVICES: RideServiceType[] = ["RIDE", "PARCEL", "LOGISTICS"];

export function ServiceToggle({
  value,
  onChange,
}: {
  value: RideServiceType;
  onChange: (service: RideServiceType) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-2xl bg-surface-container p-1.5">
      {SERVICES.map((service) => {
        const active = service === value;
        return (
          <button
            key={service}
            type="button"
            onClick={() => onChange(service)}
            className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 transition-all ${
              active
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">{SERVICE_ICON[service]}</span>
            <span className="font-label-sm text-label-sm">{SERVICE_LABEL[service]}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ServiceToggle;
