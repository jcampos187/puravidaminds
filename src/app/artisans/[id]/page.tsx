import { notFound } from "next/navigation";
import { db } from "@/db";
import { users, artisanProfiles, products, productImages, categories } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import Image from "next/image";
import CarretaWheel from "@/components/CarretaWheel";
import ProductCard from "@/components/ProductCard";
import { getTranslations } from "@/i18n/getTranslations";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtisanProfilePage({ params }: PageProps) {
  const { t } = await getTranslations();
  const { id } = await params;

  const [artisan] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
      profile: {
        businessName: artisanProfiles.businessName,
        bio: artisanProfiles.bio,
        location: artisanProfiles.location,
        phone: artisanProfiles.phone,
        whatsapp: artisanProfiles.whatsapp,
        website: artisanProfiles.website,
        instagram: artisanProfiles.instagram,
        facebook: artisanProfiles.facebook,
        coverImageUrl: artisanProfiles.coverImageUrl,
        isVerified: artisanProfiles.isVerified,
      },
    })
    .from(users)
    .leftJoin(artisanProfiles, eq(users.id, artisanProfiles.userId))
    .where(eq(users.id, id))
    .limit(1);

  if (!artisan) notFound();

  const artisanProducts = await db
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
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(users, eq(products.artisanId, users.id))
    .leftJoin(artisanProfiles, eq(users.id, artisanProfiles.userId))
    .where(eq(products.artisanId, id))
    .groupBy(products.id, users.name, artisanProfiles.location, categories.name, categories.slug)
    .orderBy(desc(products.createdAt));

  const displayName =
    artisan.profile?.businessName || artisan.name || "Artisan";

  return (
    <>
      {/* ─── Cover ──────────────────────────────────────── */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-r from-carreta-red/20 via-carreta-gold/20 to-carreta-blue/20 sm:h-80">
        {artisan.profile?.coverImageUrl ? (
          <Image
            src={artisan.profile.coverImageUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center opacity-10">
            <CarretaWheel size={200} animated />
          </div>
        )}

        {/* Decorative border */}
        <div className="absolute bottom-0 left-0 right-0 carreta-divider" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* ─── Profile Header ────────────────────────────── */}
        <div className="relative -mt-16 mb-10 flex flex-col items-start gap-6 sm:flex-row sm:items-end">
          {/* Avatar */}
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-xl dark:border-[#1A1A2E]">
            {artisan.avatarUrl ? (
              <Image
                src={artisan.avatarUrl}
                alt={displayName}
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-carreta-red/10 to-carreta-gold/10 text-4xl">
                🎨
              </div>
            )}
          </div>

          <div className="flex-1 pb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
                {displayName}
              </h1>
              {artisan.profile?.isVerified && (
                <span className="rounded-full bg-carreta-blue/10 px-3 py-1 text-xs font-medium text-carreta-blue">
                  {t("artisan.verified")}
                </span>
              )}
            </div>
            {artisan.profile?.location && (
              <p className="mt-1 text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                📍 {artisan.profile.location}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* ─── Products ──────────────────────────────── */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
              {t("artisan.artesanias")}
              <span className="ml-2 text-sm font-normal text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                ({artisanProducts.length})
              </span>
            </h2>

            {artisanProducts.length === 0 ? (
              <div className="mt-6 flex flex-col items-center rounded-xl border-2 border-dashed border-carreta-red/20 bg-white/50 px-6 py-16 dark:bg-[#22223A]/50">
                <CarretaWheel size={48} variant="outline" className="opacity-30" />
                <p className="mt-4 text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                  {t("artisan.noProducts")}
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                {artisanProducts.map((product) => (
                  <ProductCard key={product.id} product={product} byLabel={t("products.by")} categoryLabel={product.categorySlug ? t(`cat.${product.categorySlug}`) : undefined} />
                ))}
              </div>
            )}
          </div>

          {/* ─── Contact Info Sidebar ──────────────────── */}
          <div>
            <div className="sticky top-24 rounded-xl border-2 border-carreta-gold/20 bg-gradient-to-br from-carreta-gold/5 to-carreta-orange/5 p-6">
              <div className="flex items-center gap-2">
                <CarretaWheel size={24} variant="outline" />
                <h3 className="font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
                  {t("artisan.contact")}
                </h3>
              </div>

              {artisan.profile?.bio && (
                <div className="mt-4">
                  <p className="text-sm leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
                    {artisan.profile.bio}
                  </p>
                </div>
              )}

              <div className="mt-6 carreta-divider" />

              <div className="mt-6 space-y-4">
                {artisan.email && (
                  <a
                    href={`mailto:${artisan.email}`}
                    className="flex items-center gap-3 text-sm text-[#1A1A2E]/70 transition-colors hover:text-carreta-red dark:text-carreta-eggshell/70 dark:hover:text-carreta-gold"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-carreta-blue/10 text-carreta-blue">
                      ✉
                    </span>
                    {artisan.email}
                  </a>
                )}

                {artisan.profile?.phone && (
                  <div className="flex items-center gap-3 text-sm text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-carreta-orange/10 text-carreta-orange">
                      📞
                    </span>
                    {artisan.profile.phone}
                  </div>
                )}                  {artisan.profile?.whatsapp && (
                  <a
                    href={`https://wa.me/${artisan.profile.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-green-600 transition-colors hover:text-green-500"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                      💬
                    </span>
                    {t("artisan.whatsapp")}
                  </a>
                )}

                {artisan.profile?.website && (
                  <a
                    href={artisan.profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-carreta-blue transition-colors hover:text-carreta-red"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-carreta-blue/10">
                      🌐
                    </span>
                    {artisan.profile.website.replace(/^https?:\/\//, "")}
                  </a>
                )}

                {artisan.profile?.instagram && (
                  <a
                    href={`https://instagram.com/${artisan.profile.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-carreta-fuchsia transition-colors hover:text-carreta-fuchsia-light"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-carreta-fuchsia/10">
                      📸
                    </span>
                    {artisan.profile.instagram.startsWith("@")
                      ? artisan.profile.instagram
                      : `@${artisan.profile.instagram}`}
                  </a>
                )}                  {artisan.profile?.facebook && (
                  <a
                    href={artisan.profile.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-carreta-blue transition-colors hover:text-carreta-red"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-carreta-blue/10">
                      👍
                    </span>
                    {t("artisan.facebook")}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
