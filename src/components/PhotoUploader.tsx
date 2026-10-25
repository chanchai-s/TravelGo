"use client";

import { useState } from "react";
import { apiUploadImage } from "@/app/Api/mainApi";

/**
 * อัปโหลดรูปจริง — ยังใส่ URL เองได้ถ้าต้องการ
 * ขีดจำกัด: ชนิดไฟล์ image/* ขนาดไม่เกิน 5 MB (ฝั่ง server ตรวจซ้ำอีกชั้น)
 */
export function PhotoUploader({
  onUploaded,
}: {
  onUploaded: (fileUrl: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pick = async (file: File | undefined) => {
    if (file === undefined) {
      return;
    }
    setUploading(true);
    setError("");
    try {
      const res = await apiUploadImage(file);
      const data = (res.data ?? {}) as { data?: { fileUrl?: string } };
      if (data.data?.fileUrl) {
        onUploaded(data.data.fileUrl);
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "อัปโหลดไม่สำเร็จ (รองรับ jpg/png/webp ไม่เกิน 5 MB)");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-surface-container-high bg-surface-container-low px-4 py-5 text-center transition-colors hover:border-primary">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(event) => pick(event.target.files?.[0])}
        />
        <span className="material-symbols-outlined text-[26px] text-primary">cloud_upload</span>
        <span className="font-label-md text-label-md font-bold text-primary">
          {uploading ? "กำลังอัปโหลด..." : "เลือกรูปจากเครื่อง"}
        </span>
        <span className="font-body-sm text-body-sm text-tertiary">
          รองรับ jpg / png / webp · ไม่เกิน 5 MB ต่อรูป
        </span>
      </label>
      {error !== "" ? (
        <p className="mt-1 font-body-sm text-body-sm text-error">{error}</p>
      ) : null}
    </div>
  );
}