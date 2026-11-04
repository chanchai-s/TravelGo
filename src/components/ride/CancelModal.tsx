"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ride/BottomSheet";

const RIDER_REASONS = [
  "รอคนขับนานเกินไป",
  "เปลี่ยนแผนการเดินทาง",
  "เลือกจุดรับผิด",
  "ต้องการเปลี่ยนชั้นราคา",
  "อื่น ๆ",
];

const DRIVER_REASONS = [
  "ผู้โดยสารไม่มาตามนัด",
  "ติดต่อผู้โดยสารไม่ได้",
  "สถานที่ไม่ปลอดภัย",
  "รถเสีย / เหตุสุดวิสัย",
  "อื่น ๆ",
];

export function CancelModal({
  open,
  onClose,
  onConfirm,
  role = "RIDER",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  role?: "RIDER" | "DRIVER";
}) {
  const reasons = role === "DRIVER" ? DRIVER_REASONS : RIDER_REASONS;
  const [selected, setSelected] = useState(reasons[0] ?? "อื่น ๆ");
  const [other, setOther] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await onConfirm(selected === "อื่น ๆ" ? other.trim() || "อื่น ๆ" : selected);
    } finally {
      setBusy(false);
    }
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="ยกเลิกงาน"
      subtitle={role === "DRIVER" ? "แจ้งเหตุผลให้ผู้โดยสารทราบ" : "เลือกเหตุผลเพื่อให้เราพัฒนาบริการ"}
      footer={
        <button
          type="button"
          onClick={() => void submit()}
          disabled={busy}
          className="h-12 w-full rounded-xl bg-error font-label-lg text-label-lg font-bold text-on-error disabled:opacity-60"
        >
          {busy ? "กำลังยกเลิก..." : "ยืนยันยกเลิก"}
        </button>
      }
    >
      <div className="flex flex-col gap-1.5">
        {reasons.map((reason) => (
          <button
            key={reason}
            type="button"
            onClick={() => setSelected(reason)}
            className={`flex items-center justify-between rounded-xl px-3 py-3 text-left font-body-md text-body-md ${
              selected === reason ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-surface-container-low text-on-surface"
            }`}
          >
            <span>{reason}</span>
            {selected === reason ? (
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            ) : null}
          </button>
        ))}
        {selected === "อื่น ๆ" ? (
          <textarea
            value={other}
            onChange={(event) => setOther(event.target.value)}
            rows={2}
            placeholder="ระบุเหตุผล..."
            className="mt-1 rounded-xl bg-surface-container-low px-3 py-2 font-body-md text-body-md focus:outline-none"
          />
        ) : null}
        <p className="mt-1 font-body-sm text-body-sm text-tertiary">
          {role === "DRIVER"
            ? "ยกเลิกได้ก่อนถึงจุดรับเท่านั้น และอาจมีผลต่อคะแนนคนขับ"
            : "งานที่จ่ายล่วงหน้าจะได้รับการคืนเงินอัตโนมัติ"}
        </p>
      </div>
    </BottomSheet>
  );
}

export default CancelModal;
