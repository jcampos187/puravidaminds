"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LanguageProvider";

export default function LanguageToggle() {
  const { locale, toggleLocale } = useLocale();
  const router = useRouter();

  const handleToggle = () => {
    toggleLocale();
    // Refresh server components so they re-read the cookie
    router.refresh();
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-1.5 rounded-full border border-carreta-gold/30 px-3 py-1.5 text-xs font-medium text-carreta-gold transition-all hover:border-carreta-gold hover:bg-carreta-gold/10"
      aria-label={locale === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
      title={locale === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
    >
      <span className="text-base leading-none">
        {locale === "en" ? "🇨🇷" : "🇺🇸"}
      </span>
      <span>{locale === "en" ? "ES" : "EN"}</span>
    </button>
  );
}
