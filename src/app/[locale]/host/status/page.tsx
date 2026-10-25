"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiHostMe } from "@/app/Api/mainApi";

type HostInfo = {
  status: string;
  displayName: string | null;
  accountType: string;
  rejectedReason: string | null;
  verifiedAt: string | null;
  documents: { id: string; docType: string; fileUrl: string; status: string }[];
};

const LABEL: Record<string, { text: string; tone: string }> = {
  PENDING: { text: "รอตรวจสอบ", tone: "bg-surface-container-high text-on-surface-variant" },
  VERIFIED: { text: "ยืนยันแล้ว", tone: "bg-primary-container text-on-primary-container" },
  REJECTED: { text: "ตีกลับ", tone: "bg-error-container text-on-error-container" },
  SUSPENDED: { text: "ถูกระงับ", tone: "bg-error-container text-on-error-container" },
};

export default function HostStatusPage() {
  const [host, setHost] = useState<HostInfo | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiHostMe()
      .then((res) => {
        const data = ((res.data ?? {}) as { data?: HostInfo | null }).data;
        setHost(data ?? null);
      })
      .catch(() => setError("โหลดสถานะไม่สำเร็จ (ต้องล็อกอินก่อน)"));
  }, []);

  if (error !== "") {
    return (
      <main className="mx-auto w-full max-w-2xl px-margin py-8">
        <p className="font-body-md text-body-md text-error">{error}</p>
        <Link href="/login" className="mt-2 inline-block font-label-md text-label-md font-bold text-primary">
          ไปหน้า login
        </Link>
      </main>
    );
  }

  if (host === null) {
    return (
      <main className="mx-auto w-full max-w-2xl px-margin py-8">
        <p className="font-body-md text-body-md text-tertiary">กำลังโหลด...</p>
      </main>
    );
  }

  const badge = LABEL[host.status] ?? { text: host.status, tone: "bg-surface-container-low" };

  return (
    <main className="mx-auto w-full max-w-2xl px-margin py-4 md:py-8">
      <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
        สถานะการสมัครเจ้าของที่พัก
      </h1>

      <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md font-semibold text-on-surface">
            {host.displayName ?? "-"}
          </span>
          <span className={`rounded-full px-3 py-1 font-label-sm text-label-sm font-bold ${badge.tone}`}>
            {badge.text}
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-tertiary">
          ประเภทผู้สมัคร: {host.accountType}
        </p>
        {host.verifiedAt ? (
          <p className="font-body-sm text-body-sm text-tertiary">
            ยืนยันเมื่อ: {host.verifiedAt.slice(0, 10)}
          </p>
        ) : null}
      </div>

      {host.rejectedReason ? (
        <div className="mt-3 rounded-2xl bg-error-container p-4">
          <p className="font-label-md text-label-md font-bold text-on-error-container">
            เหตุผลที่ถูกตีกลับ
          </p>
          <p className="font-body-sm text-body-sm text-on-error-container">{host.rejectedReason}</p>
        </div>
      ) : null}

      <div className="mt-3 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
        <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
          เอกสารที่ส่ง ({host.documents.length})
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          {host.documents.map((doc) => (
            <li key={doc.id} className="font-body-sm text-body-sm text-on-surface-variant">
              {doc.docType} · {doc.status} · {doc.fileUrl}
            </li>
          ))}
        </ul>
      </div>

      {host.status === "VERIFIED" ? (
        <Link
          href="/host"
          className="mt-4 flex h-12 items-center justify-center rounded-xl bg-secondary-container font-headline-sm text-headline-sm font-bold text-on-secondary shadow-md"
        >
          ไปลงประกาศที่พัก
        </Link>
      ) : null}
      {host.status === "REJECTED" ? (
        <Link
          href="/host/register"
          className="mt-4 flex h-12 items-center justify-center rounded-xl bg-secondary-container font-headline-sm text-headline-sm font-bold text-on-secondary shadow-md"
        >
          แก้ข้อมูลแล้วส่งใหม่
        </Link>
      ) : null}
    </main>
  );
}