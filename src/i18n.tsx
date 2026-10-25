"use client";

import { createContext, useContext, useState } from "react";
import enMessages from "@/messages/en.json";
import thMessages from "@/messages/th.json";

type Locale = "en" | "th";

const messages: Record<Locale, any> = {
  en: enMessages,
  th: thMessages,
};

export const locales: Locale[] = ["en", "th"];

const I18nContext = createContext<{
  locale: Locale;
  t: (key: string) => string;
  setLocale: (lang: Locale) => void;
}>({
  locale: "th",
  t: (key: string) => key,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("th");

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = messages[locale];
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    return typeof value === "string" ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}