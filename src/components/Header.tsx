import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import CarretaWheel from "./CarretaWheel";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
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
          <span className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
              <span className="carreta-gradient-text">Pura Vida</span>{" "}
              <span>Minds</span>
            </span>
            <span className="text-[11px] font-medium leading-tight tracking-wider text-carreta-blue dark:text-carreta-turquoise">
              ARTESANÍAS
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
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
          <Link
            href="/#contact"
            className="text-sm font-medium text-[#1A1A2E]/70 transition-colors hover:text-carreta-red dark:text-carreta-eggshell/70 dark:hover:text-carreta-gold"
          >
            {t("nav.contact")}
          </Link>

          <LanguageToggle />
          <ThemeToggle />
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-4 md:flex">
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
                href="/register"
                className="carreta-btn inline-flex items-center rounded-full px-5 py-2 text-sm font-medium"
              >
                {t("nav.signUp")}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <MobileMenu
          isSignedIn={!!userId}
          userName={user?.firstName || user?.emailAddresses[0]?.emailAddress}
        />
      </div>

      {/* Decorative carreta border */}
      <div className="carreta-divider" />
    </header>
  );
}
