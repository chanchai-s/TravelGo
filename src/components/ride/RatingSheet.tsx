"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ride/BottomSheet";

export function RatingSheet({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (stars: number, text: string) => Promise<void>;
}) {
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await onSubmit(stars, text.trim());
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="ให้คะแนนการเดินทาง"
      subtitle="คะแนนของคุณช่วยให้บริการดีขึ้น"
      footer={
        <button
          type="button"
          onClick={() => void submit()}
          disabled={busy}
          className="h-12 w-full rounded-xl bg-primary font-label-lg text-label-lg font-bold text-on-primary disabled:opacity-60"
        >
          {busy ? "กำลังส่ง..." : "ส่งคะแนน"}
        </button>
      }
    >
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStars(value)}
              aria-label={`${value} ดาว`}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low"
            >
              <span
                className={`material-symbols-outlined text-[28px] ${
                  value <= stars ? "text-warning" : "text-outline-variant"
                }`}
                style={{ fontVariationSettings: value <= stars ? "'FILL' 1" : "'FILL' 0" }}
              >
                star
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
          {["ตรงเวลา", "สุภาพ", "รถสะอาด", "ขับปลอดภัย", "ช่วยเหลือดี"].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setText(text.includes(tag) ? text.replace(tag, "").trim() : `${text} ${tag}`.trim())}
              className={`rounded-full px-3 py-1.5 font-label-sm text-label-sm ${
                text.includes(tag) ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          placeholder="เล่าเพิ่มเติมเกี่ยวกับการเดินทาง..."
          className="w-full rounded-xl bg-surface-container-low px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none"
        />
      </div>
    </BottomSheet>
  );
}

export default RatingSheet;
