"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/auth.stores";

const inputClass =
  "h-12 w-full rounded-xl bg-surface-container-low px-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#0066ff]";

function nextTarget(): string {
  if (typeof window === "undefined") {
    return "/homepage";
  }
  const next = new URLSearchParams(window.location.search).get("next");
  return next !== null && next.startsWith("/") && !next.startsWith("//") ? next : "/homepage";
}

export function AuthForm({
  initialMode = "login",
}: {
  initialMode?: "login" | "register";
}) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const busy = useAuthStore((state) => state.busy);
  const error = useAuthStore((state) => state.error);

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");

    if (mode === "register") {
      if (name.trim() === "") {
        setLocalError("กรุณากรอกชื่อ");
        return;
      }
      if (password.length < 8) {
        setLocalError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
        return;
      }
      if (password !== confirm) {
        setLocalError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
        return;
      }
      const user = await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
      });
      if (user) {
        router.push(nextTarget());
      }
      return;
    }

    const user = await login(email.trim(), password);
    if (user) {
      router.push(nextTarget());
    }
  };

  return (
    <div className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm">
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-surface-container p-1">
        {[
          { key: "login", label: "เข้าสู่ระบบ" },
          { key: "register", label: "สมัครสมาชิก" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setMode(item.key as "login" | "register");
              setLocalError("");
            }}
            className={`h-10 rounded-lg font-label-md text-label-md transition-all ${
              mode === item.key
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        {mode === "register" ? (
          <label className="flex flex-col gap-1">
            <span className="font-label-md text-label-md font-semibold text-on-surface">ชื่อ-นามสกุล</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="เช่น สมชาย ใจดี"
              className={inputClass}
              autoComplete="name"
            />
          </label>
        ) : null}

        <label className="flex flex-col gap-1">
          <span className="font-label-md text-label-md font-semibold text-on-surface">อีเมล</span>
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

        {mode === "register" ? (
          <label className="flex flex-col gap-1">
            <span className="font-label-md text-label-md font-semibold text-on-surface">เบอร์โทร (ไม่บังคับ)</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="08x-xxx-xxxx"
              className={inputClass}
              autoComplete="tel"
            />
          </label>
        ) : null}

        <label className="flex flex-col gap-1">
          <span className="font-label-md text-label-md font-semibold text-on-surface">รหัสผ่าน</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="อย่างน้อย 8 ตัวอักษร"
              className={`${inputClass} pr-11`}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
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

        {mode === "register" ? (
          <label className="flex flex-col gap-1">
            <span className="font-label-md text-label-md font-semibold text-on-surface">ยืนยันรหัสผ่าน</span>
            <input
              type="password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              placeholder="พิมพ์รหัสผ่านอีกครั้ง"
              className={inputClass}
              autoComplete="new-password"
              required
            />
          </label>
        ) : null}

        {localError !== "" || error !== "" ? (
          <p className="rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">
            {localError || error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-secondary-container font-headline-sm text-headline-sm font-bold text-on-secondary shadow-md shadow-secondary-container/20 disabled:opacity-60"
        >
          {busy ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              กำลังดำเนินการ...
            </>
          ) : (
            <>
              {mode === "login" ? "เข้าสู่ระบบ" : "สร้างบัญชี"}
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-4 flex flex-col gap-2 border-t border-outline-variant/50 pt-4">
        <Link
          href="/driver/register"
          className="flex items-center justify-between rounded-xl bg-surface-container-low px-3 py-2.5"
        >
          <span className="flex items-center gap-2 font-label-md text-label-md font-semibold text-on-surface">
            <span className="material-symbols-outlined text-[20px] text-primary">directions_car</span>
            สมัครเป็นคนขับ
          </span>
          <span className="material-symbols-outlined text-[18px] text-tertiary">chevron_right</span>
        </Link>
        <Link
          href="/host/register"
          className="flex items-center justify-between rounded-xl bg-surface-container-low px-3 py-2.5"
        >
          <span className="flex items-center gap-2 font-label-md text-label-md font-semibold text-on-surface">
            <span className="material-symbols-outlined text-[20px] text-primary">home_work</span>
            สมัครเป็นเจ้าของที่พัก
          </span>
          <span className="material-symbols-outlined text-[18px] text-tertiary">chevron_right</span>
        </Link>
      </div>
    </div>
  );
}

export default AuthForm;
