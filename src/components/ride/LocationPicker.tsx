"use client";

import { useMemo, useState } from "react";
import type { RidePoint, SavedAddress } from "@/app/Api/mainApi";
import { RIDE_LOCATIONS } from "@/data/rideLocations";
import { BottomSheet } from "@/components/ride/BottomSheet";

export function LocationPicker({
  label,
  value,
  onChange,
  saved,
  tone = "pickup",
}: {
  label: string;
  value: RidePoint | null;
  onChange: (point: RidePoint) => void;
  saved: SavedAddress[];
  tone?: "pickup" | "dropoff";
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [locating, setLocating] = useState(false);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (keyword === "") {
      return RIDE_LOCATIONS;
    }
    return RIDE_LOCATIONS.filter(
      (item) =>
        item.label.toLowerCase().includes(keyword) || item.address.toLowerCase().includes(keyword),
    );
  }, [search]);

  const useCurrentLocation = () => {
    if (typeof navigator === "undefined" || navigator.geolocation === undefined) {
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
          address: "ตำแหน่งปัจจุบันของฉัน",
        });
        setLocating(false);
        setOpen(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const dotClass = tone === "pickup" ? "bg-primary" : "bg-secondary-container";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl bg-surface-container-low px-3 py-2.5 text-left"
      >
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass}`} />
        <span className="min-w-0 flex-1">
          <span className="block font-label-sm text-label-sm text-tertiary">{label}</span>
          <span
            className={`block truncate font-body-md text-body-md ${
              value ? "text-on-surface" : "text-outline"
            }`}
          >
            {value?.address ?? "เลือกจุดรับ-ส่ง"}
          </span>
        </span>
        <span className="material-symbols-outlined text-[20px] text-outline">chevron_right</span>
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title={label} subtitle="ค้นหาสถานที่หรือเลือกจากที่บันทึกไว้">
        <div className="flex flex-col gap-3 pb-2">
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ค้นหาสถานที่..."
              className="h-11 flex-1 rounded-xl bg-surface-container-low px-3 font-body-md text-body-md focus:outline-none"
            />
            <button
              type="button"
              onClick={useCurrentLocation}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-primary"
              aria-label="ใช้ตำแหน่งปัจจุบัน"
            >
              <span className={`material-symbols-outlined text-[20px] ${locating ? "animate-spin" : ""}`}>
                {locating ? "progress_activity" : "my_location"}
              </span>
            </button>
          </div>

          {saved.length > 0 ? (
            <div>
              <p className="mb-1 font-label-sm text-label-sm font-bold uppercase tracking-wide text-tertiary">
                ที่บันทึกไว้
              </p>
              <div className="flex flex-col gap-1">
                {saved.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => {
                      onChange({ lat: address.lat, lng: address.lng, address: address.address });
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2.5 text-left"
                  >
                    <span className="material-symbols-outlined text-[20px] text-primary">
                      {address.label === "บ้าน" ? "home" : "work"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-label-md text-label-md font-semibold text-on-surface">
                        {address.label}
                      </span>
                      <span className="block truncate font-body-sm text-body-sm text-tertiary">
                        {address.address}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <p className="mb-1 font-label-sm text-label-sm font-bold uppercase tracking-wide text-tertiary">
              สถานที่ยอดนิยม
            </p>
            <div className="flex flex-col gap-1">
              {filtered.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    onChange({ lat: item.lat, lng: item.lng, address: item.address });
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-[20px] text-outline">place</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-label-md text-label-md font-semibold text-on-surface">
                      {item.label}
                    </span>
                    <span className="block truncate font-body-sm text-body-sm text-tertiary">
                      {item.address}
                    </span>
                  </span>
                </button>
              ))}
              {filtered.length === 0 ? (
                <p className="px-3 py-4 font-body-sm text-body-sm text-tertiary">ไม่พบสถานที่ที่ค้นหา</p>
              ) : null}
            </div>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

export default LocationPicker;
