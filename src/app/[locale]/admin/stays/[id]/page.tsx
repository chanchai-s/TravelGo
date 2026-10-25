"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiAdminApproveStay, apiAdminRejectStay, apiAdminStay } from "@/app/Api/mainApi";

export default function AdminStayPreview() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [stay, setStay] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    apiAdminStay(id)
      .then((res) => {
        const data = ((res.data ?? {}) as { data?: Record<string, unknown> }).data;
        setStay(data ?? null);
      })
      .catch(() => setError("โหลดประกาศไม่สำเร็จ"));
  }, [id]);

  const run = async (action: () => Promise<unknown>, okText: string) => {
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(okText);
      setTimeout(() => router.push("/admin"), 1200);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "ทำรายการไม่สำเร็จ");
    }
  };

  const photos = (stay?.photos as { url: string }[]) ?? [];
  const rooms = (stay?.roomTypes as { name: string; basePrice: number; maxGuests: number }[]) ?? [];
  const amenities = stay?.amenities as Record<string, string[]> | null;
  const policy = stay?.policy as Record<string, unknown> | null;
  const host = stay?.host as { displayName?: string; status?: string; user?: { email?: string } } | null;
  const documents = (stay?.documents as { id: string; docType: string; fileUrl: string }[]) ?? [];

  return (
    <main className="mx-auto w-full max-w-4xl px-margin py-4 md:py-8">
      <Link href="/admin" className="inline-flex items-center gap-1 font-label-md text-label-md font-bold text-primary">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        กลับคิวตรวจ
      </Link>

      {error !== "" ? <p className="mt-3 font-body-md text-body-md text-error">{error}</p> : null}
      {notice !== "" ? <p className="mt-3 font-body-md text-body-md text-secondary">{notice}</p> : null}

      {stay === null ? (
        <p className="mt-4 font-body-md text-body-md text-tertiary">กำลังโหลด...</p>
      ) : (
        <>
          <h1 className="mt-3 font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
            {String(stay.name)}
          </h1>
          <p className="font-body-md text-body-md text-tertiary">
            {String(stay.location ?? "-")} · {String(stay.propertyType)} · สถานะ{" "}
            {String(stay.status)}
          </p>
          {stay.rejectedReason ? (
            <p className="mt-1 font-body-sm text-body-sm text-error">
              เหตุผลที่ตีกลับก่อนหน้า: {String(stay.rejectedReason)}
            </p>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm md:grid-cols-4">
            <div>
              <p className="font-label-sm text-label-sm text-tertiary">ราคา/คืน</p>
              <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {Number(stay.pricePerNight ?? 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-tertiary">ขั้นที่บันทึก</p>
              <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {String(stay.currentStep)}
              </p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-tertiary">รูป</p>
              <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {photos.length}
              </p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-tertiary">ห้อง</p>
              <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {rooms.length}
              </p>
            </div>
          </div>

          <section className="mt-4">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">เจ้าของ</h2>
            <p className="font-body-sm text-body-sm text-tertiary">
              {host?.displayName ?? "-"} · {host?.user?.email ?? "-"} · สถานะ{" "}
              {host?.status ?? "-"}
            </p>
            {documents.length > 0 ? (
              <ul className="mt-1 flex flex-col gap-1">
                {documents.map((doc) => (
                  <li key={doc.id} className="font-body-sm text-body-sm text-on-surface-variant">
                    {doc.docType}: {doc.fileUrl}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <section className="mt-4">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">รูปภาพ</h2>
            <div className="mt-2 grid grid-cols-3 gap-2 md:grid-cols-5">
              {photos.map((photo) => (
                <img
                  key={photo.url}
                  src={photo.url}
                  alt=""
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </section>

          <section className="mt-4">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">ห้องพัก</h2>
            <ul className="mt-2 flex flex-col gap-1">
              {rooms.map((room, index) => (
                <li key={index} className="font-body-sm text-body-sm text-on-surface-variant">
                  {room.name} · {room.basePrice.toLocaleString()} บาท · พักได้ {room.maxGuests} คน
                </li>
              ))}
            </ul>
          </section>

          {amenities ? (
            <section className="mt-4">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                สิ่งอำนวยความสะดวก
              </h2>
              <p className="font-body-sm text-body-sm text-tertiary">
                {(amenities["generalAmenities"] ?? []).join(" · ")}
              </p>
            </section>
          ) : null}

          {policy ? (
            <section className="mt-4">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">นโยบาย</h2>
              <p className="font-body-sm text-body-sm text-tertiary">
                เช็คอิน {String(policy["checkIn"] ?? "-")} · เช็คเอาท์{" "}
                {String(policy["checkOut"] ?? "-")} · มัดจำ{" "}
                {String(policy["deposit"] ?? 0)}
              </p>
            </section>
          ) : null}

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => run(() => apiAdminApproveStay(id), "อนุมัติแล้ว")}
              className="h-12 flex-1 rounded-xl bg-primary font-headline-sm text-headline-sm font-bold text-on-primary shadow-sm"
            >
              อนุมัติ
            </button>
            <button
              type="button"
              onClick={() => {
                const reason = window.prompt("เหตุผลที่ตีกลับ");
                if ((reason ?? "").trim() !== "") {
                  run(() => apiAdminRejectStay(id, reason ?? ""), "ตีกลับแล้ว");
                }
              }}
              className="h-12 flex-1 rounded-xl bg-error-container font-headline-sm text-headline-sm font-bold text-on-error-container"
            >
              ตีกลับ
            </button>
          </div>
        </>
      )}
    </main>
  );
}