import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import CarretaWheel, { CarretaWheelPattern } from "@/components/CarretaWheel";
import { db } from "@/db";
import { products, categories, productImages, users, artisanProfiles } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import { getTranslations } from "@/i18n/getTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getTranslations();

  if (locale === "es") {
    return {
      title: "Pura Vida Artesanías — Artesanías Costarricenses Auténticas",
      description:
        "Descubre artesanías costarricenses auténticas. Conecta directamente con artesanos de Sarchí y toda Costa Rica. Pura Vida.",
    };
  }

  return {
    title: "Pura Vida Artesanías — Authentic Costa Rican Handcrafts",
    description:
      "Discover authentic Costa Rican handcrafted products. Connect directly with skilled artisans from Sarchí and across Costa Rica. Pura Vida.",
  };
}

async function getFeaturedProducts() {
  try {
    const featured = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        price: products.price,
        currency: products.currency,
        slug: products.slug,
        artisanId: products.artisanId,
        categoryId: products.categoryId,
        status: products.status,
        tags: products.tags,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        artisanName: users.name,
        artisanLocation: artisanProfiles.location,
        categoryName: categories.name,
        categorySlug: categories.slug,
        images: sql<
      { url: string; altText: string | null }[]
    >`COALESCE(json_agg(json_build_object('url', ${productImages.url}, 'altText', ${productImages.altText}) ORDER BY ${productImages.displayOrder}) FILTER (WHERE ${productImages.id} IS NOT NULL), '[]'::json)`,
      })
      .from(products)
      .leftJoin(users, eq(products.artisanId, users.id))
      .leftJoin(artisanProfiles, eq(users.id, artisanProfiles.userId))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .where(eq(products.status, "active"))
      .groupBy(
        products.id,
        products.artisanId,
        products.categoryId,
        products.status,
        products.tags,
        products.createdAt,
        products.updatedAt,
        products.description,
        products.title,
        products.slug,
        products.currency,
        products.price,
        users.name,
        artisanProfiles.location,
        categories.name,
        categories.slug
      )
      .orderBy(desc(products.createdAt))
      .limit(6);

    return featured;
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const cats = await db
      .select()
      .from(categories)
      .orderBy(categories.displayOrder);
    return cats;
  } catch {
    return [];
  }
}

function getDefaultCategories(t: (key: string) => string) {
  return [
    { id: "1", name: t("cat.wood-carvings"), slug: "wood-carvings", description: t("cat-desc.wood-carvings"), imageUrl: null, displayOrder: 1, createdAt: new Date() },
    { id: "2", name: t("cat.jewelry"), slug: "jewelry", description: t("cat-desc.jewelry"), imageUrl: null, displayOrder: 2, createdAt: new Date() },
    { id: "3", name: t("cat.textiles"), slug: "textiles", description: t("cat-desc.textiles"), imageUrl: null, displayOrder: 3, createdAt: new Date() },
    { id: "4", name: t("cat.ceramics"), slug: "ceramics", description: t("cat-desc.ceramics"), imageUrl: null, displayOrder: 4, createdAt: new Date() },
    { id: "5", name: t("cat.paintings"), slug: "paintings", description: t("cat-desc.paintings"), imageUrl: null, displayOrder: 5, createdAt: new Date() },
    { id: "6", name: t("cat.coffee-cacao"), slug: "coffee-cacao", description: t("cat-desc.coffee-cacao"), imageUrl: null, displayOrder: 6, createdAt: new Date() },
  ];
}

export default async function Home() {
  const { t } = await getTranslations();
  const { userId } = await auth();
  const sellHref = userId ? "/dashboard/products/new" : "/register";
  const [featuredProducts, allCategories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  const categoryList = allCategories.length > 0 ? allCategories : getDefaultCategories(t);

  return (
    <>
      {/* ─── Hero Section ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-carreta-cream via-white to-carreta-cream dark:from-[#1A1A2E] dark:via-[#22223A] dark:to-[#1A1A2E]">
        <CarretaWheelPattern className="absolute inset-0" />

        {/* Decorative wheel elements */}
        <div className="absolute -right-20 -top-20 opacity-[0.06] dark:opacity-[0.03]">
          <CarretaWheel size={400} animated />
        </div>
        <div className="absolute -bottom-16 -left-16 opacity-[0.04] dark:opacity-[0.02]">
          <CarretaWheel size={300} animated />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-4xl text-center">
            {/* Heritage badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-carreta-gold/30 bg-carreta-gold/10 px-5 py-2">
              <CarretaWheel size={20} variant="outline" />
              <span className="text-sm font-medium text-carreta-orange">
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="carreta-gradient-text">{t("hero.title.pura")}</span>
              <br />
              <span className="text-carreta-blue dark:text-carreta-turquoise">
                {t("hero.title.artesanias")}
              </span>
              <br />
              <span className="text-[#1A1A2E] dark:text-carreta-eggshell">
                {t("hero.title.hecho")}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70 sm:text-xl">
              {t("hero.subtitle")}
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/products"
                className="carreta-btn inline-flex h-14 w-full items-center justify-center gap-2 rounded-full px-10 text-base font-semibold shadow-xl shadow-carreta-red/25 sm:w-auto"
              >
                <CarretaWheel size={20} variant="outline" />
                {t("hero.cta.explore")}
              </Link>
              <Link
                href={sellHref}
                className="inline-flex h-14 w-full items-center justify-center rounded-full border-2 border-carreta-blue/30 px-10 text-base font-semibold text-carreta-blue transition-all hover:border-carreta-blue hover:bg-carreta-blue/5 sm:w-auto"
              >
                {t("hero.cta.sell")}
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative carreta divider */}
        <div className="carreta-divider" />
      </section>

      {/* ─── Categories Section ────────────────────────────── */}
      <section className="bg-white px-6 py-20 dark:bg-[#22223A]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell sm:text-4xl">
              {t("categories.title")}
            </h2>
            <p className="mt-4 text-lg text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
              {t("categories.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryList.map((cat, idx) => {
              const colors = [
                "from-carreta-red/20 to-carreta-orange/20 border-carreta-red/30",
                "from-carreta-blue/20 to-carreta-turquoise/20 border-carreta-blue/30",
                "from-carreta-gold/20 to-carreta-orange/20 border-carreta-gold/30",
                "from-carreta-fuchsia/20 to-carreta-red/20 border-carreta-fuchsia/30",
                "from-carreta-turquoise/20 to-carreta-blue/20 border-carreta-turquoise/30",
                "from-carreta-orange/20 to-carreta-gold/20 border-carreta-orange/30",
              ];
              const icons: Record<string, string> = {
                "wood-carvings": "🪵",
                "jewelry": "💍",
                "textiles": "🧶",
                "ceramics": "🏺",
                "paintings": "🎨",
                "coffee-cacao": "☕",
                "home-decor": "🖼️",
                "leatherwork": "👝",
              };

              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`group rounded-xl border-2 bg-gradient-to-br p-6 transition-all hover:shadow-lg hover:-translate-y-1 ${colors[idx % colors.length]}`}
                >
                  <span className="text-3xl">{icons[cat.slug] || "✨"}</span>
                  <h3 className="mt-4 text-lg font-semibold text-[#1A1A2E] transition-colors group-hover:text-carreta-orange dark:text-carreta-eggshell">
                    {t(`cat.${cat.slug}`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
                    {t(`cat-desc.${cat.slug}`)}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-carreta-red opacity-0 transition-all group-hover:opacity-100">
                    {t("categories.browse")} {t(`cat.${cat.slug}`)} →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell sm:text-4xl">
                  {t("featured.title")}
                </h2>
                <p className="mt-4 text-lg text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                  {t("featured.subtitle")}
                </p>
              </div>
              <Link
                href="/products"
                className="hidden shrink-0 text-sm font-semibold text-carreta-red transition-colors hover:text-carreta-orange sm:block"
              >
                {t("featured.viewAll")}
              </Link>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} byLabel={t("products.by")} categoryLabel={product.categorySlug ? t(`cat.${product.categorySlug}`) : undefined} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/products"
                className="carreta-btn inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium"
              >
                {t("featured.viewAll")}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Story Section ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1A1A2E] px-6 py-20 text-carreta-eggshell">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='25' fill='none' stroke='%23FFD700' stroke-width='2' fill-opacity='0'/%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <CarretaWheel size={64} animated variant="outline" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("story.title")}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-carreta-eggshell/80">
              {t("story.paragraph1")}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-carreta-eggshell/70">
              {t("story.paragraph2")}
            </p>
            <div className="mt-8 carreta-divider opacity-50" />
            <p className="mt-6 text-lg font-semibold text-carreta-gold">
              {t("story.tagline")}
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ───────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-carreta-red/5 via-carreta-gold/5 to-carreta-blue/5 px-6 py-20">
        <div className="absolute -right-16 -top-16 opacity-[0.04]">
          <CarretaWheel size={250} animated />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell sm:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mt-4 text-lg text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
            {t("cta.subtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">              <Link
                href={sellHref}
                className="carreta-btn inline-flex h-14 w-full items-center justify-center gap-2 rounded-full px-10 text-base font-semibold shadow-xl shadow-carreta-red/25 sm:w-auto"
              >
                <CarretaWheel size={20} variant="outline" />
                {t("cta.join")}
              </Link>
            <Link
              href="/products"
              className="inline-flex h-14 w-full items-center justify-center rounded-full border-2 border-[#1A1A2E]/20 px-10 text-base font-semibold text-[#1A1A2E] transition-all hover:border-carreta-red/50 hover:text-carreta-red dark:border-carreta-eggshell/20 dark:text-carreta-eggshell dark:hover:border-carreta-gold/50 dark:hover:text-carreta-gold sm:w-auto"
            >
              {t("cta.browse")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
