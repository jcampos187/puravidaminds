"use client";

import { useTheme } from "./ThemeProvider";
import { useTranslations } from "@/i18n/useTranslations";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export default function ThemeToggle({ className = "", showLabel = false, label }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslations();

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition-all hover:bg-carreta-gold/10 dark:hover:bg-carreta-gold/10 ${className}`}
      aria-label={theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
      suppressHydrationWarning
    >
      {theme === "dark" ? (
        /* Sun icon for dark mode */
        <svg className="h-4 w-4 text-carreta-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" strokeLinecap="round" />
          <line x1="12" y1="21" x2="12" y2="23" strokeLinecap="round" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeLinecap="round" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round" />
          <line x1="1" y1="12" x2="3" y2="12" strokeLinecap="round" />
          <line x1="21" y1="12" x2="23" y2="12" strokeLinecap="round" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeLinecap="round" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeLinecap="round" />
        </svg>
      ) : (
        /* Moon icon for light mode */
        <svg className="h-4 w-4 text-carreta-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {showLabel && label && (
        <span className="text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
          {label}
        </span>
      )}
    </button>
  );
}
