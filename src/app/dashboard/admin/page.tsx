import Link from "next/link";
import { db } from "@/db";
import { artisanProfiles, products } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { getTranslations } from "@/i18n/getTranslations";
import CarretaWheel from "@/components/CarretaWheel";

export default async function AdminPage() {
  const { t } = await getTranslations();

  const [pendingArtisanCount] = await db
    .select({ count: count() })
    .from(artisanProfiles)
    .where(eq(artisanProfiles.isVerified, false));

  const [pendingProductCount] = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.status, "pending"));

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Pending Artisans */}
      <Link
        href="/dashboard/admin/artisans"
        className="carreta-card group rounded-xl border-2 border-carreta-gold/20 bg-white p-8 transition-all hover:border-carreta-gold/50 dark:bg-[#22223A]"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-carreta-gold/10 text-3xl">
            🧑‍🎨
          </span>
          <div>
            <p className="text-3xl font-bold tracking-tight text-carreta-orange">
              {pendingArtisanCount?.count || 0}
            </p>
            <p className="mt-1 text-sm font-medium text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
              {t("admin.pendingArtisans")}
            </p>
          </div>
        </div>
        <div className="mt-4 text-right text-sm font-medium text-carreta-red opacity-0 transition-opacity group-hover:opacity-100">
          {t("admin.review")} →
        </div>
      </Link>

      {/* Pending Products */}
      <Link
        href="/dashboard/admin/products"
        className="carreta-card group rounded-xl border-2 border-carreta-blue/20 bg-white p-8 transition-all hover:border-carreta-blue/50 dark:bg-[#22223A]"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-carreta-blue/10 text-3xl">
            📦
          </span>
          <div>
            <p className="text-3xl font-bold tracking-tight text-carreta-blue">
              {pendingProductCount?.count || 0}
            </p>
            <p className="mt-1 text-sm font-medium text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
              {t("admin.pendingProducts")}
            </p>
          </div>
        </div>
        <div className="mt-4 text-right text-sm font-medium text-carreta-red opacity-0 transition-opacity group-hover:opacity-100">
          {t("admin.review")} →
        </div>
      </Link>

      {/* Totals */}
      <div className="rounded-xl border-2 border-carreta-red/10 bg-white p-6 dark:bg-[#22223A] sm:col-span-2">
        <div className="flex items-center gap-3">
          <CarretaWheel size={28} variant="outline" />
          <span className="text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
            {(pendingArtisanCount?.count || 0) + (pendingProductCount?.count || 0) === 0
              ? "✨ All caught up! No pending reviews."
              : `📋 ${(pendingArtisanCount?.count || 0) + (pendingProductCount?.count || 0)} item(s) awaiting review.`}
          </span>
        </div>
      </div>
    </div>
  );
}
