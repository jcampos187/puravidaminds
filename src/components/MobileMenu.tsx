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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

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
        <div className="fixed inset-0 z-50 flex flex-col bg-[#F8F6F2] dark:bg-[#0D0D1A]">
          {/* Close button */}
          <div className="flex items-center justify-between border-b border-carreta-red/10 px-6 py-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1A1A2E]/30 dark:text-carreta-eggshell/30">
              {t("nav.home")}
            </span>
            <button
              onClick={close}
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-carreta-red/10 text-carreta-red transition-colors hover:bg-carreta-red/20"
              aria-label={t("mobileMenu.close")}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex-1 space-y-3 px-5">
            <Link
              href="/products"
              onClick={close}
              className="flex items-center gap-5 rounded-2xl border-2 border-carreta-blue/15 bg-white px-5 py-5 shadow-md transition-all hover:border-carreta-blue/40 hover:shadow-lg dark:border-carreta-blue/20 dark:bg-[#16162A] dark:hover:border-carreta-blue/40"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-carreta-blue/15 text-2xl dark:bg-carreta-blue/20">
                🛍️
              </span>
              <div className="min-w-0">
                <p className="text-lg font-bold text-[#1A1A2E] dark:text-carreta-eggshell">
                  {t("nav.browse")}
                </p>
                <p className="mt-0.5 text-sm font-medium text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                  {t("mobileMenu.browseSub")}
                </p>
              </div>
            </Link>
            <Link
              href="/artisans"
              onClick={close}
              className="flex items-center gap-5 rounded-2xl border-2 border-carreta-orange/15 bg-white px-5 py-5 shadow-md transition-all hover:border-carreta-orange/40 hover:shadow-lg dark:border-carreta-orange/20 dark:bg-[#16162A] dark:hover:border-carreta-orange/40"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-carreta-orange/15 text-2xl dark:bg-carreta-orange/20">
                🎨
              </span>
              <div className="min-w-0">
                <p className="text-lg font-bold text-[#1A1A2E] dark:text-carreta-eggshell">
                  {t("nav.artisans")}
                </p>
                <p className="mt-0.5 text-sm font-medium text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                  {t("mobileMenu.artisansSub")}
                </p>
              </div>
            </Link>
          </nav>

          {/* Auth section */}
          <div className="border-t border-carreta-red/10 px-5 py-6">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                onClick={close}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-carreta-red to-carreta-red/90 px-6 py-4 text-base font-bold text-white shadow-lg shadow-carreta-red/30 transition-all hover:shadow-xl hover:shadow-carreta-red/40"
              >
                {t("nav.dashboard")}
              </Link>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/sign-in"
                  onClick={close}
                  className="flex w-full items-center justify-center rounded-2xl border-2 border-carreta-red/30 bg-white px-6 py-4 text-base font-bold text-carreta-red shadow-sm transition-all hover:border-carreta-red hover:bg-carreta-red/5 hover:shadow-md dark:bg-[#16162A]"
                >
                  {t("nav.signIn")}
                </Link>
                <Link
                  href="/register"
                  onClick={close}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-carreta-red to-carreta-red/90 px-6 py-4 text-base font-bold text-white shadow-lg shadow-carreta-red/30 transition-all hover:shadow-xl hover:shadow-carreta-red/40"
                >
                  {t("nav.signUp")}
                </Link>
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-center gap-4 border-t border-carreta-red/10 bg-white/50 px-6 py-5 dark:bg-[#16162A]/50">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      )}
    </div>
  );
}
