import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { users, artisanProfiles, products } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { getTranslations } from "@/i18n/getTranslations";
import CarretaWheel from "@/components/CarretaWheel";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = await getTranslations();
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const [localUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!localUser || localUser.role !== "admin") redirect("/dashboard");

  // Count pending reviews
  const [pendingArtisanCount] = await db
    .select({ count: count() })
    .from(artisanProfiles)
    .where(eq(artisanProfiles.isVerified, false));

  const [pendingProductCount] = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.status, "pending"));

  const pendingTotal = (pendingArtisanCount?.count || 0) + (pendingProductCount?.count || 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4">
          <CarretaWheel size={36} variant="outline" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
              {t("admin.title")}
            </h1>
            <p className="mt-1 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
              {t("admin.subtitle")}
              {pendingTotal > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-carreta-red/10 px-2.5 py-0.5 text-xs font-medium text-carreta-red">
                  {pendingTotal} pending
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mb-8 flex gap-4 border-b border-carreta-red/10 pb-4">
        <Link
          href="/dashboard/admin"
          className="text-sm font-medium text-[#1A1A2E]/60 transition-colors hover:text-carreta-red dark:text-carreta-eggshell/60 dark:hover:text-carreta-gold"
        >
          {t("admin.nav.pending")}
        </Link>
        <Link
          href="/dashboard/admin/artisans"
          className="text-sm font-medium text-[#1A1A2E]/60 transition-colors hover:text-carreta-red dark:text-carreta-eggshell/60 dark:hover:text-carreta-gold"
        >
          {t("admin.nav.artisans")}
          {pendingArtisanCount?.count > 0 && (
            <span className="ml-1.5 inline-flex items-center rounded-full bg-carreta-red/10 px-2 py-0.5 text-xs text-carreta-red">
              {pendingArtisanCount.count}
            </span>
          )}
        </Link>
        <Link
          href="/dashboard/admin/products"
          className="text-sm font-medium text-[#1A1A2E]/60 transition-colors hover:text-carreta-red dark:text-carreta-eggshell/60 dark:hover:text-carreta-gold"
        >
          {t("admin.nav.products")}
          {pendingProductCount?.count > 0 && (
            <span className="ml-1.5 inline-flex items-center rounded-full bg-carreta-red/10 px-2 py-0.5 text-xs text-carreta-red">
              {pendingProductCount.count}
            </span>
          )}
        </Link>
        <Link
          href="/dashboard"
          className="ml-auto text-sm font-medium text-[#1A1A2E]/60 transition-colors hover:text-carreta-red dark:text-carreta-eggshell/60 dark:hover:text-carreta-gold"
        >
          ← {t("dashboard.title")}
        </Link>
      </nav>

      {children}
    </div>
  );
}
