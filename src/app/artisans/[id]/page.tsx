import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { users, artisanProfiles, products, productImages, categories } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import Image from "next/image";
import CarretaWheel from "@/components/CarretaWheel";
import ProductCard from "@/components/ProductCard";
import TrackedLink from "@/components/TrackedLink";
import { getTranslations } from "@/i18n/getTranslations";

/** Simple UUID v4 regex — matches 8-4-4-4-12 hex format */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await getTranslations();
  const { id } = await params;

  if (!UUID_RE.test(id)) return { title: "Artisan Not Found" };

  const [artisan] = await db
    .select({
      name: users.name,
      businessName: artisanProfiles.businessName,
      location: artisanProfiles.location,
    })
    .from(users)
    .leftJoin(artisanProfiles, eq(users.id, artisanProfiles.userId))
    .where(eq(users.id, id))
    .limit(1);

  if (!artisan) return { title: "Artisan Not Found" };

  const displayName = artisan.businessName || artisan.name || "Artisan";
  const locationEn = artisan.location ? ` from ${artisan.location}` : "";
  const locationEs = artisan.location ? ` de ${artisan.location}` : "";

  if (locale === "es") {
    return {
      title: `${displayName} | Artesano de Pura Vida Artesanías`,
      description:
        `Conoce a ${displayName}, artesano${locationEs} de Costa Rica. Descubre sus productos hechos a mano y su historia.`,
    };
  }

  return {
    title: `${displayName} | Artisan at Pura Vida Artesanías`,
    description:
      `Meet ${displayName}, an artisan${locationEn} in Costa Rica. Discover their handcrafted products and story.`,
  };
}

export default async function ArtisanProfilePage({ params }: PageProps) {
  const { t } = await getTranslations();
  const { id } = await params;

  // Reject non-UUID values immediately so we never hit the DB with garbage
  if (!UUID_RE.test(id)) notFound();

  const [artisan] = await db
    .select({
      id: users.id,
      name: users.name,
      avatarUrl: users.avatarUrl,
      email: users.email,
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
    .where(sql`${products.artisanId} = ${id} AND ${products.status} = 'active'`)
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

          <div className="flex-1 pb-6">
            <div className="rounded-xl bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm dark:bg-[#1A1A2E]/80">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
                  {displayName}
                </h1>
                {artisan.profile?.isVerified && (
                  <span className="shrink-0 rounded-full bg-carreta-blue/10 px-3 py-1 text-xs font-medium text-carreta-blue">
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
                {artisan.profile?.phone && (
                  <div className="flex items-center gap-3 text-sm text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-carreta-orange/10 text-carreta-orange">
                      📞
                    </span>
                    {artisan.profile.phone}
                  </div>
                )}

                {artisan.email && (
                  <TrackedLink
                    href={`mailto:${artisan.email}`}
                    eventType="email_click"
                    artisanId={artisan.id}
                    className="flex items-center gap-3 text-sm text-carreta-blue transition-colors hover:text-carreta-red"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-carreta-blue/10">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    {t("artisan.email")}
                  </TrackedLink>
                )}

                {artisan.profile?.whatsapp && (
                  <TrackedLink
                    href={`https://wa.me/${artisan.profile.whatsapp.replace(/[^0-9]/g, "")}`}
                    eventType="whatsapp_click"
                    artisanId={artisan.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-green-600 transition-colors hover:text-green-500"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </span>
                    {t("artisan.whatsapp")}
                  </TrackedLink>
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
                  <TrackedLink
                    href={`https://instagram.com/${artisan.profile.instagram.replace("@", "")}`}
                    eventType="instagram_click"
                    artisanId={artisan.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-carreta-fuchsia transition-colors hover:text-carreta-fuchsia-light"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-carreta-fuchsia/10">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </span>
                    {artisan.profile.instagram.startsWith("@")
                      ? artisan.profile.instagram
                      : `@${artisan.profile.instagram}`}
                  </TrackedLink>
                )}                  {artisan.profile?.facebook && (
                  <TrackedLink
                    href={artisan.profile.facebook.startsWith("http") ? artisan.profile.facebook : `https://facebook.com/${artisan.profile.facebook}`}
                    eventType="facebook_click"
                    artisanId={artisan.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-carreta-blue transition-colors hover:text-carreta-red"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-carreta-blue/10">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </span>
                    {t("artisan.facebook")}
                  </TrackedLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
