"use client";

export type ParcelDraft = {
  weightKg: string;
  sizeTier: "S" | "M" | "L" | "XL";
  isFragile: boolean;
  receiverName: string;
  receiverPhone: string;
  note: string;
  codAmount: string;
};

export const EMPTY_PARCEL: ParcelDraft = {
  weightKg: "3",
  sizeTier: "M",
  isFragile: false,
  receiverName: "",
  receiverPhone: "",
  note: "",
  codAmount: "0",
};

const inputClass =
  "h-11 w-full rounded-xl bg-surface-container-low px-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#0066ff]";

export function ParcelForm({
  value,
  onChange,
}: {
  value: ParcelDraft;
  onChange: (patch: Partial<ParcelDraft>) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px] text-primary">package_2</span>
        <p className="font-label-lg text-label-lg font-bold text-on-surface">รายละเอียดพัสดุ</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant">น้ำหนัก (กก.)</span>
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={value.weightKg}
            onChange={(event) => onChange({ weightKg: event.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant">ขนาด</span>
          <select
            value={value.sizeTier}
            onChange={(event) => onChange({ sizeTier: event.target.value as ParcelDraft["sizeTier"] })}
            className={inputClass}
          >
            <option value="S">S — กล่องเล็ก</option>
            <option value="M">M — กล่องกลาง</option>
            <option value="L">L — กล่องใหญ่</option>
            <option value="XL">XL — ของชิ้นใหญ่</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant">ชื่อผู้รับ</span>
          <input
            value={value.receiverName}
            onChange={(event) => onChange({ receiverName: event.target.value })}
            placeholder="คุณสมชาย"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant">เบอร์ผู้รับ</span>
          <input
            value={value.receiverPhone}
            onChange={(event) => onChange({ receiverPhone: event.target.value })}
            placeholder="08x-xxx-xxxx"
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="font-label-sm text-label-sm text-on-surface-variant">หมายเหตุถึงคนขับ</span>
        <input
          value={value.note}
          onChange={(event) => onChange({ note: event.target.value })}
          placeholder="เช่น ฝากไว้ที่ป้อมยาม"
          className={inputClass}
        />
      </label>

      <div className="flex items-center justify-between rounded-xl bg-surface-container-low px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">inventory_2</span>
          <span className="font-body-sm text-body-sm text-on-surface">ของแตกหักง่าย</span>
        </div>
        <button
          type="button"
          onClick={() => onChange({ isFragile: !value.isFragile })}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            value.isFragile ? "bg-primary" : "bg-outline-variant"
          }`}
          aria-pressed={value.isFragile}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
              value.isFragile ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>

      <label className="flex flex-col gap-1">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          เก็บเงินปลายทาง (COD) — บาท
        </span>
        <input
          type="number"
          min={0}
          value={value.codAmount}
          onChange={(event) => onChange({ codAmount: event.target.value })}
          className={inputClass}
        />
      </label>
    </div>
  );
}

export default ParcelForm;
