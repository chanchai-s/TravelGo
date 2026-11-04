"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/auth.stores";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { nextTarget } from "@/components/auth/nextTarget";

const inputClass =
  "h-12 w-full rounded-xl bg-surface-container-low px-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#0066ff]";

/**
 * ฟอร์มล็อกอินแบบ social-first
 * ผู้ใช้ใหม่ไม่ต้องกรอกข้อมูลหรือตั้งรหัสผ่าน — ดึงจากผู้ให้บริการแทน
 * เก็บอีเมล/รหัสผ่านไว้แบบพับได้สำหรับบัญชีเดิม (แอดมิน/คนขับ/เจ้าของที่พัก)
 */
export function AuthForm({ mode = "login" }: { mode?: "login" | "register" }) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const busy = useAuthStore((state) => state.busy);
  const error = useAuthStore((state) => state.error);

  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const goNext = () => router.push(nextTarget());

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");

    if (email.trim() === "" || password === "") {
      setLocalError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    const user = await login(email.trim(), password);
    if (user) {
      goNext();
    }
  };

  return (
    <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm">
      <p className="mb-4 text-center font-body-sm text-body-sm text-on-surface-variant">
        {mode === "register"
          ? "สมัครสมาชิกด้วยบัญชีที่คุณมีอยู่ ไม่ต้องกรอกข้อมูลหรือตั้งรหัสผ่าน"
          : "เข้าสู่ระบบด้วยบัญชีที่คุณมีอยู่ เพื่อใช้งานต่อได้ทันที"}
      </p>

      <SocialButtons onSuccess={goNext} />

      {/* บัญชีเดิมที่ใช้รหัสผ่าน — พับไว้ไม่ให้รบกวนผู้ใช้ใหม่ */}
      <div className="mt-4 border-t border-outline-variant/50 pt-3">
        <button
          type="button"
          onClick={() => {
            setEmailOpen((value) => !value);
            setLocalError("");
          }}
          aria-expanded={emailOpen}
          className="flex w-full items-center justify-between rounded-xl px-2 py-2.5 transition-colors hover:bg-surface-container-low"
        >
          <span className="font-label-md text-label-md font-semibold text-on-surface-variant">
            เข้าสู่ระบบด้วยอีเมล
          </span>
          <span className="material-symbols-outlined text-[20px] text-tertiary">
            {emailOpen ? "expand_less" : "expand_more"}
          </span>
        </button>

        {emailOpen ? (
          <form onSubmit={submit} className="mt-2 flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">
                อีเมล
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={inputClass}
                autoComplete="email"
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">
                รหัสผ่าน
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  className={`${inputClass} pr-11`}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-0 flex h-12 items-center text-on-surface-variant"
                  aria-label="แสดง/ซ่อนรหัสผ่าน"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </label>

            {localError !== "" || error !== "" ? (
              <p className="rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">
                {localError || error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-surface-container-high font-label-md text-label-md font-bold text-on-surface disabled:opacity-60"
            >
              {busy ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  กำลังดำเนินการ...
                </>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-outline-variant/50 pt-4">
        <Link
          href="/driver/register"
          className="flex items-center justify-between rounded-xl bg-surface-container-low px-3 py-2.5"
        >
          <span className="flex items-center gap-2 font-label-md text-label-md font-semibold text-on-surface">
            <span className="material-symbols-outlined text-[20px] text-primary">
              directions_car
            </span>
            สมัครเป็นคนขับ
          </span>
          <span className="material-symbols-outlined text-[18px] text-tertiary">
            chevron_right
          </span>
        </Link>
        <Link
          href="/host/register"
          className="flex items-center justify-between rounded-xl bg-surface-container-low px-3 py-2.5"
        >
          <span className="flex items-center gap-2 font-label-md text-label-md font-semibold text-on-surface">
            <span className="material-symbols-outlined text-[20px] text-primary">
              home_work
            </span>
            สมัครเป็นเจ้าของที่พัก
          </span>
          <span className="material-symbols-outlined text-[18px] text-tertiary">
            chevron_right
          </span>
        </Link>
      </div>
    </div>
  );
}

export default AuthForm;
