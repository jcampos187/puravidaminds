import { auth, currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { users, products } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import CarretaWheel from "@/components/CarretaWheel";
import { getTranslations } from "@/i18n/getTranslations";

export default async function DashboardPage() {
  const { t } = await getTranslations();
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  // Get local user
  const [localUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!localUser) {
    // User not found — redirect to profile setup to create one
    redirect("/dashboard/profile?setup=true");
  }

  // Get product count
  const [productCount] = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.artisanId, localUser.id));

  const isAdmin = localUser.role === "admin";

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4">
          <CarretaWheel size={40} variant="outline" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
              {t("dashboard.welcome", clerkUser.firstName || "friend")}
            </h1>
            <p className="mt-1 text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
              {t("dashboard.subtitle.artisan")}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border-2 border-carreta-red/20 bg-white p-6 dark:bg-[#22223A]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎨</span>
            <p className="text-3xl font-bold tracking-tight text-carreta-red">
              {productCount?.count || 0}
            </p>
          </div>
          <p className="mt-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
            {t("dashboard.stats.products")}
          </p>
        </div>

        <div className="rounded-xl border-2 border-carreta-gold/20 bg-white p-6 dark:bg-[#22223A]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👁️</span>
            <p className="text-3xl font-bold tracking-tight text-carreta-orange">
              —
            </p>
          </div>
          <p className="mt-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
            {t("dashboard.stats.views")}
          </p>
        </div>

        <div className="rounded-xl border-2 border-carreta-blue/20 bg-white p-6 dark:bg-[#22223A]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✉️</span>
            <p className="text-3xl font-bold tracking-tight text-carreta-blue">
              —
            </p>
          </div>
          <p className="mt-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
            {t("dashboard.stats.inquiries")}
          </p>
        </div>

        <div className="rounded-xl border-2 border-carreta-turquoise/20 bg-white p-6 dark:bg-[#22223A]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <p className="text-3xl font-bold tracking-tight text-carreta-turquoise">
              —
            </p>
          </div>
          <p className="mt-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
            {t("dashboard.stats.reviews")}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="mb-6 text-xl font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
          {t("dashboard.quickActions")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/products/new"
            className="carreta-card group flex items-center gap-4 rounded-xl bg-white p-6 dark:bg-[#22223A]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-carreta-red/10 text-2xl text-carreta-red">
              +
            </span>
            <div>
              <h3 className="font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
                {t("dashboard.addProduct")}
              </h3>
              <p className="text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                {t("productForm.sub")}
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/products"
            className="carreta-card group flex items-center gap-4 rounded-xl bg-white p-6 dark:bg-[#22223A]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-carreta-blue/10 text-2xl text-carreta-blue">
              📋
            </span>
            <div>
              <h3 className="font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
                {t("dashboard.viewProducts")}
              </h3>
              <p className="text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                {t("dashboard.viewProducts")}
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/profile"
            className="carreta-card group flex items-center gap-4 rounded-xl bg-white p-6 dark:bg-[#22223A]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-carreta-gold/10 text-2xl text-carreta-orange">
              ⚙️
            </span>
            <div>
              <h3 className="font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
                {t("dashboard.editProfile")}
              </h3>
              <p className="text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                {t("dashboard.profile.sub")}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Admin Quick Link */}
      {isAdmin && (
        <div className="mb-10">
          <h2 className="mb-6 text-xl font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
            Administration
          </h2>
          <Link
            href="/dashboard/admin"
            className="carreta-card group flex items-center gap-4 rounded-xl bg-white p-6 dark:bg-[#22223A]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-carreta-red/10 text-2xl text-carreta-red">
              🛡️
            </span>
            <div>
              <h3 className="font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
                {t("admin.goToDashboard")}
              </h3>
              <p className="text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                {t("admin.subtitle")}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Bottom actions */}
      <div className="mt-10 flex items-center justify-between border-t border-carreta-red/10 pt-6">
        <Link
          href="/"
          className="text-sm text-[#1A1A2E]/60 hover:text-carreta-red dark:text-carreta-eggshell/60 dark:hover:text-carreta-gold"
        >
          ← {t("nav.browse")}
        </Link>
        <SignOutButton>
          <button className="rounded-full border-2 border-carreta-red/30 px-5 py-2 text-sm font-medium text-carreta-red transition-all hover:border-carreta-red hover:bg-carreta-red/5">
            {t("nav.signOut")}
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
