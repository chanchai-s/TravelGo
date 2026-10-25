"use client";

import { useSearchParams, useRouter } from "next/navigation";

const PROPERTY_TYPES = [
  { key: "", label: "ทุกประเภท" },
  { key: "HOTEL", label: "โรงแรม" },
  { key: "RESORT", label: "รีสอร์ต" },
  { key: "GUEST_HOUSE", label: "เกสต์เฮาส์" },
  { key: "HOSTEL", label: "โฮสเทล" },
  { key: "APARTMENT", label: "อพาร์ตเมนต์" },
  { key: "VILLA", label: "วิลล่า" },
  { key: "CONDO", label: "คอนโด" },
];

const AMENITIES = [
  { key: "", label: "ทั้งหมด" },
  { key: "WiFi", label: "WiFi" },
  { key: "สระ", label: "สระว่ายน้ำ" },
  { key: "ที่จอด", label: "ที่จอดรถ" },
  { key: "อาหารเช้า", label: "อาหารเช้า" },
];

const STAR_OPTIONS = [
  { key: "", label: "ทุกดาว" },
  { key: "5", label: "5 ดาว" },
  { key: "4", label: "4 ดาว" },
  { key: "3", label: "3 ดาว" },
];

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 rounded-full px-3 font-label-sm text-label-sm font-semibold ${
        active
          ? "bg-primary text-on-primary shadow-sm"
          : "bg-surface-container-low text-on-surface-variant"
      }`}
    >
      {label}
    </button>
  );
}

/** ตัวกรองผลลัพธ์ — เขียนลง query param ให้รีเฟรชแล้วค้นใหม่อัตโนมัติ */
export function StayFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    router.push(`/bookingdetails?${params.toString()}`);
  };

  const current = (key: string) => searchParams.get(key) ?? "";
  const minPrice = current("minPrice");
  const maxPrice = current("maxPrice");

  return (
    <aside className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">ตัวกรอง</h2>
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams();
            const destination = searchParams.get("destination");
            if (destination) {
              params.set("destination", destination);
            }
            router.push(`/bookingdetails?${params.toString()}`);
          }}
          className="font-label-sm text-label-sm font-bold text-primary"
        >
          ล้างทั้งหมด
        </button>
      </div>

      {/* ช่วงราคา */}
      <div>
        <p className="mb-2 font-label-md text-label-md font-semibold text-on-surface">
          ราคาต่อคืน (฿)
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(event) => setFilter("minPrice", event.target.value)}
            placeholder="ต่ำสุด"
            className="h-10 w-full rounded-xl bg-surface-container-low px-3 font-body-sm text-body-sm"
          />
          <span className="text-tertiary">–</span>
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(event) => setFilter("maxPrice", event.target.value)}
            placeholder="สูงสุด"
            className="h-10 w-full rounded-xl bg-surface-container-low px-3 font-body-sm text-body-sm"
          />
        </div>
      </div>

      {/* ดาว */}
      <div>
        <p className="mb-2 font-label-md text-label-md font-semibold text-on-surface">ระดับดาว</p>
        <div className="flex flex-wrap gap-1.5">
          {STAR_OPTIONS.map((item) => (
            <Chip
              key={item.key}
              label={item.label}
              active={current("stars") === item.key}
              onClick={() => setFilter("stars", item.key)}
            />
          ))}
        </div>
      </div>

      {/* ประเภทที่พัก */}
      <div>
        <p className="mb-2 font-label-md text-label-md font-semibold text-on-surface">ประเภทที่พัก</p>
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_TYPES.map((item) => (
            <Chip
              key={item.key}
              label={item.label}
              active={current("propertyType") === item.key}
              onClick={() => setFilter("propertyType", item.key)}
            />
          ))}
        </div>
      </div>

      {/* สิ่งอำนวยความสะดวก */}
      <div>
        <p className="mb-2 font-label-md text-label-md font-semibold text-on-surface">สิ่งอำนวยความสะดวก</p>
        <div className="flex flex-wrap gap-1.5">
          {AMENITIES.map((item) => (
            <Chip
              key={item.key}
              label={item.label}
              active={current("amenity") === item.key}
              onClick={() => setFilter("amenity", item.key)}
            />
          ))}
        </div>
      </div>

      <p className="font-body-sm text-body-sm text-tertiary">
        หมายเหตุ: ตัวกรองใช้กับที่พักของ WanderGo ส่วนผลจาก booking.com ยังใช้เงื่อนไขเดิม
      </p>
    </aside>
  );
}