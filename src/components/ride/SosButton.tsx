"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ride/BottomSheet";

export function SosButton({
  onSend,
}: {
  onSend: (note: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    setSending(true);
    try {
      await onSend(note);
      setSent(true);
      setNote("");
      setTimeout(() => {
        setSent(false);
        setOpen(false);
      }, 1800);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-error/40 bg-error-container font-label-lg text-label-lg font-bold text-on-error-container"
      >
        <span className="material-symbols-outlined text-[20px]">emergency</span>
        ขอความช่วยเหลือเร่งด่วน (SOS)
      </button>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="แจ้งเหตุฉุกเฉิน"
        subtitle="ทีม Concierge จะเห็นพิกัดและติดต่อกลับทันที"
        footer={
          <button
            type="button"
            onClick={() => void submit()}
            disabled={sending || sent}
            className="h-12 w-full rounded-xl bg-error font-label-lg text-label-lg font-bold text-on-error disabled:opacity-60"
          >
            {sent ? "ส่งแจ้งเหตุแล้ว" : sending ? "กำลังส่ง..." : "ยืนยันแจ้งเหตุ"}
          </button>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-error-container p-3">
            <p className="font-body-sm text-body-sm text-on-error-container">
              ถ้าเป็นเหตุคุกคามชีวิต กรุณาโทร 191 หรือ 1669 ก่อน แล้วค่อยแจ้งในแอป
            </p>
          </div>
          <label className="flex flex-col gap-1">
            <span className="font-label-md text-label-md font-semibold text-on-surface">
              รายละเอียดเพิ่มเติม (ไม่บังคับ)
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="เช่น รถไม่ตรงป้าย / คนขับไม่ปลอดภัย"
              className="rounded-xl bg-surface-container-low px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none"
            />
          </label>
        </div>
      </BottomSheet>
    </>
  );
}

export default SosButton;
