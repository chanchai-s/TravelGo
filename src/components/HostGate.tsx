"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiHostMe } from "@/app/Api/mainApi";

type GateState = "loading" | "ready" | "pending" | "rejected";

/**
 * กันไม่ให้คนที่สมัครแล้วยังรอตรวจ (หรือถูกตีกลับ) เข้ามากรอกซ้ำ
 * - ไม่มีโปรไฟล์ / ยืนยันแล้ว → เข้าได้ (กรอกไว้ก่อนได้ ส่งคิวตอนยืนยัน)
 * - PENDING / REJECTED → พาไปหน้าสถานะ
 */
export function HostGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GateState>("loading");

  useEffect(() => {
    const token = window.localStorage.getItem("travel_token");
    if (!token) {
      // ยังไม่ล็อกอิน = ยังไม่มีโปรไฟล์ เข้ากรอกได้ (ตอนส่งค่อยล็อกอิน)
      setState("ready");
      return;
    }

    apiHostMe()
      .then((res) => {
        const data = ((res.data ?? {}) as { data?: { status?: string } | null }).data;
        if (data === null || data === undefined) {
          setState("ready");
        } else if (data.status === "VERIFIED") {
          setState("ready");
        } else if (data.status === "REJECTED") {
          setState("rejected");
        } else {
          setState("pending");
        }
      })
      .catch(() => setState("ready"));
  }, []);

  if (state === "loading") {
    return <p className="font-body-md text-body-md text-tertiary">กำลังตรวจสถานะ...</p>;
  }

  if (state === "pending" || state === "rejected") {
    return (
      <div className="mt-4 rounded-2xl bg-surface-container-lowest p-8 text-center shadow-sm">
        <span className="material-symbols-outlined text-[44px] text-primary">
          {state === "pending" ? "hourglass_top" : "assignment_late"}
        </span>
        <p className="mt-2 font-headline-sm text-headline-sm font-bold text-on-surface">
          {state === "pending" ? "อยู่ระหว่างการตรวจสอบ" : "ข้อมูลถูกตีกลับ"}
        </p>
        <p className="mt-1 font-body-md text-body-md text-tertiary">
          {state === "pending"
            ? "แอดมินกำลังตรวจเอกสารยืนยันตัวตน ยืนยันแล้วจึงจะส่งประกาศเข้าคิวได้"
            : "กรุณาแก้ข้อมูลและส่งเอกสารใหม่อีกครั้ง"}
        </p>
        <Link
          href="/host/status"
          className="mt-3 inline-flex h-11 items-center rounded-xl bg-secondary-container px-5 font-label-md text-label-md font-bold text-on-secondary"
        >
          ดูสถานะ / แก้ข้อมูล
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}