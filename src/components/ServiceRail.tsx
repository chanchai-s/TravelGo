"use client";

import { useState } from "react";

type ServiceItem = {
  id: string;
  label: string;
  icon: string;
};

const baseServices: ServiceItem[] = [
  { id: "hotel", label: "Hotel", icon: "hotel" },
  { id: "flight", label: "Flight", icon: "flight" },
  { id: "train", label: "Train", icon: "train" },
  { id: "car", label: "Car", icon: "directions_car" },
  { id: "tour", label: "Tour", icon: "explore" },
  { id: "food", label: "Food", icon: "restaurant" },
];

const extraServices: ServiceItem[] = [
  { id: "villa", label: "Villa", icon: "villa" },
  { id: "cruise", label: "Cruise", icon: "sailing" },
  { id: "visa", label: "Visa", icon: "badge" },
  { id: "more", label: "More", icon: "apps" },
];

export function ServiceRail() {
  const [expanded, setExpanded] = useState(false);
  const [activeService, setActiveService] = useState("hotel");

  const services = expanded
    ? [...baseServices, ...extraServices]
    : baseServices;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
          Travel Services
        </p>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          {expanded ? "Collapse" : "More"}
          <span className="material-symbols-outlined text-[14px]">
            {expanded ? "expand_less" : "expand_more"}
          </span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {services.map((service) => {
          const active = activeService === service.id;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => setActiveService(service.id)}
              className={[
                "group min-w-[92px] rounded-2xl border px-2.5 py-3 transition-all duration-200",
                active
                  ? "border-blue-600 bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.22)]"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
              ].join(" ")}
            >
              <div className="flex flex-col items-center gap-2">
                <span
                  className={[
                    "material-symbols-outlined text-[24px]",
                    active ? "text-white" : "text-blue-600",
                  ].join(" ")}
                >
                  {service.icon}
                </span>
                <span className="text-[12px] font-semibold leading-none">
                  {service.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
