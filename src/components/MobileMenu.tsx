"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { useTranslations } from "@/i18n/useTranslations";

interface MobileMenuProps {
  isSignedIn: boolean;
  userName?: string | null;
}

/** Lock body + html scroll and return a restore function. */
function lockScroll() {
  const { body, documentElement: html } = document;
  const prevBodyOverflow = body.style.overflow;
  const prevHtmlOverflow = html.style.overflow;
  body.style.overflow = "hidden";
  html.style.overflow = "hidden";
  return () => {
    body.style.overflow = prevBodyOverflow;
    html.style.overflow = prevHtmlOverflow;
  };
}

export default function MobileMenu({ isSignedIn, userName }: MobileMenuProps) {
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Close menu on route change — skip hydration mismatch on first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsOpen(false);
  }, [pathname]);

  // Lock/unlock scroll when menu toggles
  useEffect(() => {
    if (!isOpen) return;
    const restore = lockScroll();
    return () => restore();
  }, [isOpen]);

  // Guard: restore scroll on unmount no matter what
  useEffect(() => {
    return () => {
      const { body, documentElement: html } = document;
      body.style.overflow = "";
      html.style.overflow = "";
    };
  }, []);

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setIsOpen((prev) => !prev);
    },
    [],
  );

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <div className="md:hidden">
      {/* Hamburger button — larger tap target */}
      <button
        onClick={toggle}
        type="button"
        className="relative flex h-12 w-12 items-center justify-center rounded-xl border-2 border-carreta-red/20 transition-all active:scale-95 hover:border-carreta-red touch-manipulation"
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

      {/* Overlay + Panel — rendered only when open */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={close}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto overscroll-contain rounded-t-3xl border-t-2 border-carreta-red/20 bg-carreta-cream shadow-2xl dark:bg-[#1A1A2E] animate-slide-up"
          >
            <div className="px-6 pb-8 pt-6">
              {/* Drag handle — tap to close */}
              <button
                onClick={close}
                type="button"
                className="mx-auto mb-6 flex h-7 w-14 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
                aria-label="Close menu"
              >
                <span className="h-1.5 w-10 rounded-full bg-carreta-red/30" />
              </button>

              {/* Navigation links */}
              <nav className="space-y-1">
                <Link
                  href="/products"
                  className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium text-[#1A1A2E] transition-colors hover:bg-carreta-red/5 dark:text-carreta-eggshell dark:hover:bg-carreta-red/10"
                  onClick={close}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-carreta-blue/10 text-carreta-blue">
                    🛍️
                  </span>
                  {t("nav.browse")}
                </Link>
                <Link
                  href="/artisans"
                  className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium text-[#1A1A2E] transition-colors hover:bg-carreta-red/5 dark:text-carreta-eggshell dark:hover:bg-carreta-red/10"
                  onClick={close}
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
                    onClick={close}
                  >
                    {t("nav.dashboard")}
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/sign-in"
                    className="flex w-full items-center justify-center rounded-full border-2 border-carreta-red/30 px-6 py-3 text-sm font-medium text-carreta-red transition-all hover:border-carreta-red hover:bg-carreta-red/5"
                    onClick={close}
                  >
                    {t("nav.signIn")}
                  </Link>
                  <Link
                    href="/register"
                    className="carreta-btn flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                    onClick={close}
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
        </>
      )}
    </div>
  );
}
