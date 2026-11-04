import { AuthForm } from "@/components/auth/AuthForm";
import { BRAND } from "@/data/userprofiles";

/**
 * หน้าจอ auth ที่ใช้ร่วมกันระหว่าง /login และ /register
 * เนื้อหาฟอร์มอยู่ใน AuthForm — ที่นี่มีแค่ brand header
 */
export function AuthScreen({
  mode = "login",
}: {
  mode?: "login" | "register";
}) {
  return (
    <main className="mx-auto w-full max-w-md px-margin py-4 md:py-8">
      {/* Brand */}
      <div className="flex flex-col items-center pb-space-lg pt-space-md text-center">
        <div className="relative mb-space-sm flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container shadow-lg shadow-primary-container/20">
            <span className="material-symbols-outlined text-[28px] text-on-primary-container">
              explore
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-container shadow-sm">
            <span className="material-symbols-outlined text-[14px] text-on-secondary">
              bolt
            </span>
          </div>
        </div>
        <div className="mb-space-xs inline-flex items-center gap-space-xs rounded-full bg-surface-container-high px-2.5 py-1 font-label-sm text-label-sm text-on-surface-variant">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary-container" />
          {BRAND.passLabel}
        </div>
        <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
          WanderGo
        </h1>
        <p className="mt-1 max-w-[280px] font-body-md text-body-md text-on-surface-variant">
          บัญชีเดียวใช้ได้ทุกบริการ — เรียกโดยสาร ส่งพัสดุ และเป็นคนขับ
        </p>
      </div>

      <AuthForm initialMode={mode} />
    </main>
  );
}
