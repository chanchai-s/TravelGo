"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useI18n } from "@/i18n";
import { locales } from "@/i18n";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState<"en" | "th">("th");
  const { t } = useI18n();

  useEffect(() => {
    const currentLocale = (pathname.split("/")[1] || "th") as string;
    if (locales.includes(currentLocale as any)) {
      setLocale(currentLocale as any);
    }
  }, [pathname]);

  const changeLanguage = (newLocale: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    const pathnameWithoutLocale = window.location.pathname.split("/").slice(2).join("/");
    const newPath = `/${newLocale}/${pathnameWithoutLocale}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      {locales.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => changeLanguage(lang)}
          className={`flex items-center gap-2 rounded-xl px-3 py-1.5 font-label-sm text-label-sm font-bold transition-all ${
            locale === lang
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-surface-container-low text-on-surface-variant"
          }`}
        >
          {lang === "en" ? "English" : "ไทย"}
        </button>
      ))}
    </div>
  );
}