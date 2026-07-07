"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { useTranslations } from "@/i18n/useTranslations";

interface MobileMenuProps {
  isSignedIn: boolean;
  userName?: string | null;
}

export default function MobileMenu({ isSignedIn, userName }: MobileMenuProps) {
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  // Lock/unlock body scroll — no html manipulation, just body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Guaranteed scroll restore on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={toggle}
        type="button"
        className="relative flex h-12 w-12 items-center justify-center rounded-xl border-2 border-carreta-red/20 transition-all active:scale-95 hover:border-carreta-red"
        aria-label={isOpen ? t("mobileMenu.close") : t("mobileMenu.open")}
        aria-expanded={isOpen}
      >
        <div className="flex flex-col items-center justify-center gap-[5px]">
          <span
            className={`block h-[3px] w-6 rounded-full bg-[#1A1A2E] transition-all duration-200 dark:bg-carreta-eggshell ${
              isOpen ? "translate-y-[8px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[3px] w-6 rounded-full bg-[#1A1A2E] transition-all duration-200 dark:bg-carreta-eggshell ${
              isOpen ? "scale-x-0 opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[3px] w-6 rounded-full bg-[#1A1A2E] transition-all duration-200 dark:bg-carreta-eggshell ${
              isOpen ? "-translate-y-[8px] -rotate-45" : ""
            }`}
          />
        </div>
      </button>

      {/* Full-screen overlay menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-carreta-cream dark:bg-[#1A1A2E]">
          {/* Close button */}
          <div className="flex items-center justify-between px-6 pt-4">
            <span className="text-sm font-medium text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
              {t("nav.home")}
            </span>
            <button
              onClick={close}
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-carreta-red/10 text-carreta-red"
              aria-label={t("mobileMenu.close")}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 space-y-2 px-6">
            <Link
              href="/products"
              onClick={close}
              className="flex items-center gap-4 rounded-xl px-4 py-4 text-lg font-medium text-[#1A1A2E] transition-colors hover:bg-carreta-red/5 dark:text-carreta-eggshell dark:hover:bg-carreta-red/10"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-carreta-blue/10 text-carreta-blue">
                🛍️
              </span>
              {t("nav.browse")}
            </Link>
            <Link
              href="/artisans"
              onClick={close}
              className="flex items-center gap-4 rounded-xl px-4 py-4 text-lg font-medium text-[#1A1A2E] transition-colors hover:bg-carreta-red/5 dark:text-carreta-eggshell dark:hover:bg-carreta-red/10"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-carreta-gold/10 text-carreta-orange">
                🎨
              </span>
              {t("nav.artisans")}
            </Link>
          </nav>

          {/* Auth section */}
          <div className="border-t border-carreta-red/10 px-6 py-6">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                onClick={close}
                className="carreta-btn flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold"
              >
                {t("nav.dashboard")}
              </Link>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/sign-in"
                  onClick={close}
                  className="flex w-full items-center justify-center rounded-full border-2 border-carreta-red/30 px-6 py-3.5 text-base font-medium text-carreta-red transition-all hover:border-carreta-red hover:bg-carreta-red/5"
                >
                  {t("nav.signIn")}
                </Link>
                <Link
                  href="/register"
                  onClick={close}
                  className="carreta-btn flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold"
                >
                  {t("nav.signUp")}
                </Link>
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-center gap-4 border-t border-carreta-red/10 px-6 py-6">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      )}
    </div>
  );
}
