"use client";

import { useLocale } from "./LanguageProvider";
import { translations, type Locale } from "./translations";

export function useTranslations() {
  const { locale } = useLocale();

  function t(key: string, ...args: string[]): string {
    const entry = translations[key];
    if (!entry) return key;
    const value = entry[locale as Locale] ?? entry.en;
    if (typeof value === "function") return (value as (...a: string[]) => string)(...args);
    return value as string;
  }

  return { t, locale };
}
