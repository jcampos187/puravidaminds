import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import CarretaWheel from "./CarretaWheel";
import LanguageToggle from "./LanguageToggle";
import { getTranslations } from "@/i18n/getTranslations";

export default async function Header() {
  const { userId } = await auth();
  const user = await currentUser();
  const { t } = await getTranslations();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-carreta-red/20 bg-carreta-cream/95 backdrop-blur-md dark:bg-[#1A1A2E]/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <CarretaWheel size={36} variant="outline" />
          <span className="text-lg font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
            <span className="carreta-gradient-text">Pura Vida</span>{" "}
            <span className="text-carreta-blue">Artesanías</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/products"
            className="text-sm font-medium text-[#1A1A2E]/70 transition-colors hover:text-carreta-red dark:text-carreta-eggshell/70 dark:hover:text-carreta-gold"
          >
            {t("nav.browse")}
          </Link>
          <Link
            href="/artisans"
            className="text-sm font-medium text-[#1A1A2E]/70 transition-colors hover:text-carreta-red dark:text-carreta-eggshell/70 dark:hover:text-carreta-gold"
          >
            {t("nav.artisans")}
          </Link>

          <LanguageToggle />
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-4">
          {userId ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="carreta-btn inline-flex items-center rounded-full px-5 py-2 text-sm font-medium"
              >
                {t("nav.dashboard")}
              </Link>
              <span className="hidden text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60 lg:block">
                {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="rounded-full border-2 border-carreta-red/30 px-5 py-2 text-sm font-medium text-carreta-red transition-all hover:border-carreta-red hover:bg-carreta-red/5"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                href="/sign-up"
                className="carreta-btn inline-flex items-center rounded-full px-5 py-2 text-sm font-medium"
              >
                {t("nav.signUp")}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Language toggle for mobile */}
      <div className="flex items-center justify-center border-t border-carreta-red/10 px-6 py-2 md:hidden">
        <LanguageToggle />
      </div>

      {/* Decorative carreta border */}
      <div className="carreta-divider" />
    </header>
  );
}
