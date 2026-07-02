import { cookies } from "next/headers";
import { translations } from "./translations";
import type { Locale } from "./translations";

export async function getTranslations() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("puravida-locale")?.value as Locale) || "en";

  function t(key: string, ...args: string[]): string {
    const entry = translations[key];
    if (!entry) return key;
    const value = entry[locale] ?? entry.en;
    if (typeof value === "function") return (value as (...a: string[]) => string)(...args);
    return value as string;
  }

  return { t, locale };
}
