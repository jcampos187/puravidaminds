import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { users, artisanProfiles, products } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import CarretaWheel from "@/components/CarretaWheel";
import ArtisanCard from "@/components/ArtisanCard";
import { getTranslations } from "@/i18n/getTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getTranslations();

  if (locale === "es") {
    return {
      title: "Nuestros Artesanos | Pura Vida Artesanías",
      description:
        "Conoce a los talentosos artesanos costarricenses que crean nuestras artesanías. Cada pieza cuenta una historia de tradición y cultura.",
    };
  }

  return {
    title: "Meet Our Artisans | Pura Vida Artesanías",
    description:
      "Meet the talented Costa Rican artisans who create our handcrafts. Every piece tells a story of tradition and culture.",
  };
}

export default async function ArtisansPage() {
  const { t } = await getTranslations();

  const artisans = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
      profile: {
        businessName: artisanProfiles.businessName,
        bio: artisanProfiles.bio,
        location: artisanProfiles.location,
        coverImageUrl: artisanProfiles.coverImageUrl,
      },
      productCount: sql<number>`COUNT(${products.id})::int`,
      latestProduct: sql<string>`MAX(${products.createdAt})`,
    })
    .from(users)
    .innerJoin(artisanProfiles, eq(users.id, artisanProfiles.userId))
    .leftJoin(products, eq(users.id, products.artisanId))
    .where(sql`${users.name} IS NOT NULL`)
    .groupBy(users.id, users.name, users.email, users.avatarUrl, artisanProfiles.id, artisanProfiles.businessName, artisanProfiles.bio, artisanProfiles.location, artisanProfiles.coverImageUrl, artisanProfiles.isVerified)
    .orderBy(desc(artisanProfiles.isVerified), desc(sql`MAX(${products.createdAt})`));

  return (
    <>
      {/* ─── Hero ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-carreta-cream via-white to-carreta-cream dark:from-[#1A1A2E] dark:via-[#22223A] dark:to-[#1A1A2E]">
        <div className="absolute -right-20 -top-20 opacity-[0.06] dark:opacity-[0.03]">
          <CarretaWheel size={350} animated />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <CarretaWheel size={56} variant="outline" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="carreta-gradient-text">{t("artisans.title")}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
              {t("artisans.subtitle")}
            </p>
          </div>
        </div>
        <div className="carreta-divider" />
      </section>

      {/* ─── Artisans Grid ──────────────────────────── */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {artisans.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-carreta-gold/30 px-6 py-20 text-center">
              <CarretaWheel size={64} variant="outline" className="opacity-30" />
              <h2 className="mt-6 text-xl font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
                {t("artisans.empty")}
              </h2>
              <p className="mt-2 text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                {t("artisans.emptySub")}
              </p>
              <Link
                href="/register"
                className="carreta-btn mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium"
              >
                {t("nav.joinAsArtisan")}
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {artisans.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} itemsLabel={t("artisanCard.artesania", String(artisan.productCount))} fallbackName={t("artisanCard.fallbackName")} />
              ))}
            </div>
          )}

          {artisans.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-sm text-[#1A1A2E]/50 dark:text-carreta-eggshell/50">
                {t("artisans.count", String(artisans.length))}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
