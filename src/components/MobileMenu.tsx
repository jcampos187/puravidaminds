"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: close on navigation
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, setIsOpen]);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-carreta-red/20 transition-all hover:border-carreta-red"
        aria-label={isOpen ? t("mobileMenu.close") : t("mobileMenu.open")}
      >
        <div className="flex flex-col items-center justify-center gap-1.5">
          <span
            className={`block h-0.5 w-5 rounded-full bg-[#1A1A2E] transition-all duration-300 dark:bg-carreta-eggshell ${
              isOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 rounded-full bg-[#1A1A2E] transition-all duration-300 dark:bg-carreta-eggshell ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 rounded-full bg-[#1A1A2E] transition-all duration-300 dark:bg-carreta-eggshell ${
              isOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t-2 border-carreta-red/20 bg-carreta-cream shadow-2xl transition-transform duration-300 dark:bg-[#1A1A2E] ${
          isOpen ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
      >
        <div className="px-6 pb-8 pt-6">
          {/* Handle */}
          <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-carreta-red/30" />

          {/* Navigation links */}
          <nav className="space-y-1">
            <Link
              href="/products"
              className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium text-[#1A1A2E] transition-colors hover:bg-carreta-red/5 dark:text-carreta-eggshell dark:hover:bg-carreta-red/10"
              onClick={() => setIsOpen(false)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-carreta-blue/10 text-carreta-blue">
                🛍️
              </span>
              {t("nav.browse")}
            </Link>
            <Link
              href="/artisans"
              className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium text-[#1A1A2E] transition-colors hover:bg-carreta-red/5 dark:text-carreta-eggshell dark:hover:bg-carreta-red/10"
              onClick={() => setIsOpen(false)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-carreta-gold/10 text-carreta-orange">
                🎨
              </span>
              {t("nav.artisans")}
            </Link>
          </nav>

          {/* Divider */}
          <div className="my-4 border-t border-carreta-red/10" />

          {/* Auth section */}
          {isSignedIn ? (
            <div className="space-y-3">
              {userName && (
                <p className="px-4 text-xs text-[#1A1A2E]/50 dark:text-carreta-eggshell/50">
                  {t("dashboard.welcome", userName)}
                </p>
              )}
              <Link
                href="/dashboard"
                className="carreta-btn flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                onClick={() => setIsOpen(false)}
              >
                {t("nav.dashboard")}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/sign-in"
                className="flex w-full items-center justify-center rounded-full border-2 border-carreta-red/30 px-6 py-3 text-sm font-medium text-carreta-red transition-all hover:border-carreta-red hover:bg-carreta-red/5"
                onClick={() => setIsOpen(false)}
              >
                {t("nav.signIn")}
              </Link>
              <Link
                href="/sign-up"
                className="carreta-btn flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                onClick={() => setIsOpen(false)}
              >
                {t("nav.signUp")}
              </Link>
            </div>
          )}

          {/* Divider */}
          <div className="my-4 border-t border-carreta-red/10" />

          {/* Theme & Language toggles */}
          <div className="flex items-center justify-center gap-3">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
