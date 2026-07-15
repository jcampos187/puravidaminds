import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { products, categories, productImages, users, artisanProfiles } from "@/db/schema";
import { eq, desc, asc, and, sql, ilike, or } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import CarretaWheel from "@/components/CarretaWheel";
import SortDropdown from "@/components/SortDropdown";
import { getTranslations } from "@/i18n/getTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getTranslations();

  if (locale === "es") {
    return {
      title: "Explorar Artesanías | Pura Vida Artesanías",
      description:
        "Explora nuestra colección de artesanías costarricenses auténticas. Filtra por categoría y encuentra la pieza perfecta hecha a mano por artesanos locales.",
    };
  }

  return {
    title: "Browse Artesanías | Pura Vida Artesanías",
    description:
      "Browse our collection of authentic Costa Rican handcrafts. Filter by category and find the perfect handmade piece crafted by local artisans.",
  };
}

interface PageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
  }>;
}

async function getProducts(searchParams: Awaited<PageProps["searchParams"]>) {
  const { category, q, sort } = searchParams;

  const conditions = [eq(products.status, "active")];

  if (category) {
    const catSlug = category;
    const cat = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, catSlug))
      .limit(1);
    if (cat.length > 0) {
      conditions.push(eq(products.categoryId, cat[0].id));
    }
  }

  if (q) {
    conditions.push(
      or(
        ilike(products.title, `%${q}%`),
        ilike(products.description, `%${q}%`)
      )!
    );
  }

  // Determine sort order
  let orderBy;
  switch (sort) {
    case "price_asc":
      orderBy = asc(products.price);
      break;
    case "price_desc":
      orderBy = desc(products.price);
      break;
    default:
      orderBy = desc(products.createdAt);
  }

  const result = await db
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
    .where(and(...conditions))
    .groupBy(products.id, products.artisanId, products.categoryId, products.status, products.tags, products.createdAt, products.updatedAt, users.name, artisanProfiles.location, categories.name, categories.slug)
    .orderBy(orderBy);

  return result;
}

/** Build a URL preserving existing search params, overriding specific keys */
function buildFilterUrl(
  currentParams: Awaited<PageProps["searchParams"]>,
  overrides: Record<string, string | undefined>
): string {
  const params = new URLSearchParams();
  if (currentParams.category) params.set("category", currentParams.category);
  if (currentParams.q) params.set("q", currentParams.q);
  if (currentParams.sort) params.set("sort", currentParams.sort);
  // Apply overrides (overwrites or deletes)
  for (const [key, value] of Object.entries(overrides)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  const qs = params.toString();
  return `/products${qs ? `?${qs}` : ""}`;
}

async function getAllCategories() {
  return db.select().from(categories).orderBy(categories.displayOrder);
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { t } = await getTranslations();
  const params = await searchParams;
  const [allProducts, allCategories] = await Promise.all([
    getProducts(params),
    getAllCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <CarretaWheel size={40} variant="outline" />
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
            {t("products.title")}
          </h1>
        </div>
        <p className="mt-3 text-lg text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
          {t("products.subtitle")}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-10 flex flex-col gap-4">
        {/* Search */}
        <form className="relative w-full" method="GET" action="/products">
          {/* Preserve category and sort when searching */}
          {params.category && <input type="hidden" name="category" value={params.category} />}
          {params.sort && <input type="hidden" name="sort" value={params.sort} />}
          <input
            type="text"
            name="q"
            defaultValue={params.q || ""}
            placeholder={t("products.search")}
            className="w-full rounded-full border-2 border-carreta-blue/20 bg-white px-5 py-3.5 pl-12 text-[16px] sm:text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-blue dark:bg-[#22223A] dark:text-carreta-eggshell dark:placeholder-carreta-eggshell/40"
          />
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1A1A2E]/40 dark:text-carreta-eggshell/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </form>

        {/* Filters row: category pills + sort dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildFilterUrl(params, { category: undefined })}
              className={`rounded-full border-2 px-4 py-2 text-xs font-medium transition-all ${
                !params.category
                  ? "border-carreta-red bg-carreta-red/10 text-carreta-red"
                  : "border-[#1A1A2E]/20 text-[#1A1A2E]/60 hover:border-carreta-red/50 hover:text-carreta-red dark:border-carreta-eggshell/20 dark:text-carreta-eggshell/60"
              }`}
            >
              {t("products.all")}
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={buildFilterUrl(params, { category: cat.slug })}
                className={`rounded-full border-2 px-4 py-2 text-xs font-medium transition-all ${
                  params.category === cat.slug
                    ? "border-carreta-red bg-carreta-red/10 text-carreta-red"
                    : "border-[#1A1A2E]/20 text-[#1A1A2E]/60 hover:border-carreta-red/50 hover:text-carreta-red dark:border-carreta-eggshell/20 dark:text-carreta-eggshell/60"
                }`}
>
                {t(`cat.${cat.slug}`)}
              </Link>
            ))}
          </div>

          {/* Sort dropdown (client component) */}
          <SortDropdown
            value={params.sort || "newest"}
            label={t("products.sort.label")}
            currentParams={{ category: params.category, q: params.q }}
            options={[
              { value: "newest", label: t("products.sort.newest") },
              { value: "price_asc", label: t("products.sort.priceLow") },
              { value: "price_desc", label: t("products.sort.priceHigh") },
            ]}
          />
        </div>
      </div>

      {/* Results */}
      {allProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-carreta-blue/20 bg-white/50 px-6 py-20 dark:bg-[#22223A]/50">
          <CarretaWheel size={64} variant="outline" className="opacity-30" />
          <h3 className="mt-6 text-lg font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
            {t("products.empty")}
          </h3>
          <p className="mt-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
            {params.q
              ? t("products.noResults", params.q)
              : t("products.emptySub")}
          </p>
          <Link
            href="/products"
            className="mt-6 text-sm font-medium text-carreta-red hover:text-carreta-orange"
          >
            {t("products.reset")} →
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} byLabel={t("products.by")} categoryLabel={product.categorySlug ? t(`cat.${product.categorySlug}`) : undefined} />
          ))}
        </div>
      )}
    </div>
  );
}
