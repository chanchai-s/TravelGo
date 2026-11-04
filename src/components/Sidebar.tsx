"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/data/homepage";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuthStore } from "@/app/stores/auth.stores";

function NavIcon({ icon, className }: { icon: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className ?? ""}`}>
      {icon}
    </span>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const ready = useAuthStore((state) => state.ready);

  useEffect(() => {
    if (!ready) {
      void useAuthStore.getState().init();
    }
  }, [ready]);

  // ซ่อนปุ่ม Login เมื่อเข้าสู่ระบบแล้ว — โปรไฟล์อยู่ในเมนู Profile
  const items = token === null ? NAV_ITEMS : NAV_ITEMS.filter((item) => item.id !== "login");
  const activeItem = items
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <>
      {/* Desktop top bar (web) */}
      <header className="fixed inset-x-0 top-0 z-40 hidden bg-surface-container-lowest shadow-[0_2px_8px_rgba(15,23,42,0.06)] md:block">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-margin">
          <Link href="/homepage" className="flex items-center gap-3">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
              WanderGo
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {items.map((item) => {
              const active = item.href !== "#" && activeItem?.id === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 font-label-md text-label-md transition-colors ${
                    active
                      ? "bg-primary-fixed font-semibold text-on-primary-fixed-variant"
                      : "text-tertiary hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                >
                  <span className="relative flex items-center justify-center">
                    <NavIcon icon={item.icon} className="text-[22px]" />
                    {item.dot === true ? (
                      <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-secondary-container" />
                    ) : null}
                  </span>
                  <span>{item.label}</span>
                  {item.badge !== undefined ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary-container px-1.5 font-label-sm text-[10px] font-bold leading-5 text-on-secondary">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Mobile bottom nav (from design) */}
      <nav className="fixed inset-x-0 bottom-0 z-50 bg-surface-container-lowest/90 pb-safe shadow-[0_-2px_12px_rgba(15,23,42,0.06)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-space-xs">
          {items.map((item) => {
            const active = item.href !== "#" && activeItem?.id === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full flex-1 flex-col items-center justify-center gap-0.5 transition-all ${
                  active
                    ? "font-semibold text-primary-container"
                    : "text-tertiary"
                }`}
              >
                <span className="relative flex items-center justify-center">
                  <NavIcon icon={item.icon} className="text-[24px]" />
                  {item.dot === true ? (
                    <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-secondary-container" />
                  ) : null}
                  {item.badge !== undefined ? (
                    <span className="absolute -right-2 -top-1 flex h-4 items-center justify-center rounded-full bg-secondary-container px-1 font-label-sm text-[10px] font-bold leading-4 text-on-secondary">
                      {item.badge}
                    </span>
                  ) : null}
                </span>
                <span className="font-label-sm text-label-sm">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
