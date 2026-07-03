"use client";

import { useLocale } from "./LanguageProvider";
import { translations, type Locale, type TranslationKey, type TranslationValue } from "./translations";

export function useTranslations() {
  const { locale } = useLocale();

  function t(key: TranslationKey | (string & {}), ...args: string[]): string {
    const entry = (translations as Record<string, Record<string, TranslationValue>>)[key];
    if (!entry) return key as string;
    const value = entry[locale as Locale] ?? entry.en;
    if (typeof value === "function") return (value as (...a: string[]) => string)(...args);
    return value as string;
  }

  return { t, locale };
}
