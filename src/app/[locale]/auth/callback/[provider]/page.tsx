"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/auth.stores";
import { isSafePath } from "@/components/auth/nextTarget";
import type { SocialProvider } from "@/app/Api/mainApi";

const PROVIDERS: SocialProvider[] = ["GOOGLE", "FACEBOOK", "APPLE", "LINE"];

function toProvider(value: string): SocialProvider | null {
  const upper = value.toUpperCase();
  return PROVIDERS.includes(upper as SocialProvider) ? (upper as SocialProvider) : null;
}

function readNext(): string {
  try {
    const saved = sessionStorage.getItem("social_next");
    return isSafePath(saved) ? saved : "/homepage";
  } catch {
    return "/homepage";
  }
}

/**
 * ปลายทางที่ผู้ให้บริการ redirect กลับมา (LINE / Apple)
 * รับ ?code=&state= แล้วส่งให้ backend แลก token — ไม่เก็บ token ฝั่ง client เอง
 */
export default function SocialCallbackPage({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider: providerParam } = use(params);
  const router = useRouter();
  const socialLogin = useAuthStore((state) => state.socialLogin);
  const [message, setMessage] = useState("กำลังยืนยันตัวตน...");
  const [failed, setFailed] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    // React StrictMode เรียก effect ซ้ำใน dev — กันการแลก code สองครั้ง
    if (started.current) {
      return;
    }
    started.current = true;

    const provider = toProvider(providerParam);
    if (provider === null) {
      setFailed(true);
      setMessage("ไม่รู้จักผู้ให้บริการนี้");
      return;
    }

    const query = new URLSearchParams(window.location.search);
    const errorParam = query.get("error");
    if (errorParam !== null) {
      setFailed(true);
      setMessage(query.get("error_description") ?? "ผู้ให้บริการปฏิเสธการเข้าสู่ระบบ");
      return;
    }

    const code = query.get("code");
    if (code === null || code === "") {
      setFailed(true);
      setMessage("ไม่พบรหัสยืนยันจากผู้ให้บริการ");
      return;
    }

    // ตรวจ state ที่เราเก็บไว้ตอนกดปุ่ม กันการปลอม callback
    const state = query.get("state");
    try {
      const saved = sessionStorage.getItem("social_state");
      if (saved !== null && saved !== state) {
        setFailed(true);
        setMessage("สถานะการเข้าสู่ระบบไม่ตรงกัน กรุณาลองใหม่อีกครั้ง");
        return;
      }
    } catch {
      // เข้า sessionStorage ไม่ได้ — ไปต่อได้ แต่จะข้ามการตรวจ state
    }

    void (async () => {
      const user = await socialLogin({
        provider,
        code,
        state: state ?? undefined,
        redirectUri: `${window.location.origin}${window.location.pathname}`,
      });

      if (user === null) {
        setFailed(true);
        setMessage(useAuthStore.getState().error || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      try {
        sessionStorage.removeItem("social_state");
        sessionStorage.removeItem("social_next");
      } catch {
        // ไม่เป็นไร ถ้าลบไม่ได้ก็แค่ค้างไว้
      }

      router.replace(readNext());
    })();
  }, [providerParam, socialLogin, router]);

  return (
    <main className="mx-auto w-full max-w-md px-margin py-10">
      <div className="rounded-3xl bg-surface-container-lowest p-6 text-center shadow-sm">
        {failed ? (
          <span className="material-symbols-outlined text-[40px] text-error">
            error
          </span>
        ) : (
          <span className="material-symbols-outlined animate-spin text-[40px] text-primary">
            progress_activity
          </span>
        )}

        <p className="mt-3 font-body-md text-body-md text-on-surface">{message}</p>

        {failed ? (
          <Link
            href="/login"
            className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-surface-container-high font-label-md text-label-md font-bold text-on-surface"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        ) : null}
      </div>
    </main>
  );
}
