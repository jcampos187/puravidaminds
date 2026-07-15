import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { products, productImages, users, artisanProfiles, categories } from "@/db/schema";
import { eq, and, ne, sql, desc } from "drizzle-orm";
import ProductImageGallery from "@/components/ProductImageGallery";
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

  if (!UUID_RE.test(id)) return { title: "Product Not Found" };

  const [product] = await db
    .select({
      title: products.title,
      description: products.description,
      artisanBusinessName: artisanProfiles.businessName,
      artisanName: users.name,
    })
    .from(products)
    .leftJoin(users, eq(products.artisanId, users.id))
    .leftJoin(artisanProfiles, eq(users.id, artisanProfiles.userId))
    .where(eq(products.id, id))
    .limit(1);

  if (!product) return { title: "Product Not Found" };

  const artisanName = product.artisanBusinessName || product.artisanName || "Artisan";
  const desc = product.description?.substring(0, 160) || "";

  if (locale === "es") {
    return {
      title: `${product.title} | Pura Vida Artesanías`,
      description: `Artesanía de ${artisanName}. ${desc}`,
      openGraph: {
        title: `${product.title} | Pura Vida Artesanías`,
        description: `Artesanía de ${artisanName}. Descubre este producto hecho a mano en Costa Rica.`,
      },
    };
  }

  return {
    title: `${product.title} | Pura Vida Artesanías`,
    description: `Handcrafted by ${artisanName}. ${desc}`,      openGraph: {
      title: `${product.title} | Pura Vida Artesanías`,
      description: `Handcrafted by ${artisanName}. Discover this authentic Costa Rican product.`,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { t } = await getTranslations();
  const { id } = await params;

  // Reject non-UUID values immediately so we never hit the DB with garbage
  if (!UUID_RE.test(id)) notFound();

  const [product] = await db
    .select({
      id: products.id,
      title: products.title,
      description: products.description,
      price: products.price,
      currency: products.currency,
      status: products.status,
      tags: products.tags,
      createdAt: products.createdAt,
      artisanId: products.artisanId,
      categoryId: products.categoryId,
      artisanName: users.name,
      artisanAvatar: users.avatarUrl,
      artisanLocation: artisanProfiles.location,
      artisanPhone: artisanProfiles.phone,
      artisanEmail: users.email,
      artisanWhatsapp: artisanProfiles.whatsapp,
      artisanInstagram: artisanProfiles.instagram,
      artisanFacebook: artisanProfiles.facebook,
      artisanBio: artisanProfiles.bio,
      artisanBusinessName: artisanProfiles.businessName,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(users, eq(products.artisanId, users.id))
    .leftJoin(artisanProfiles, eq(users.id, artisanProfiles.userId))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id))
    .limit(1);

  if (!product) notFound();

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(productImages.displayOrder);

  const price =
    product.price && product.currency
      ? product.currency === "CRC"
        ? `₡${Number(product.price).toLocaleString("es-CR")}`
        : `$${Number(product.price).toFixed(2)}`
      : null;

  // ── Related products (same category, exclude current) ─────────
  const relatedProducts = product.categorySlug
    ? await db
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
        .where(
          and(
            eq(products.categoryId, product.categoryId!),
            ne(products.id, id),
            eq(products.status, "active"),
          ),
        )
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
          categories.slug,
        )
        .orderBy(desc(products.createdAt))
        .limit(4)
    : [];

  // ── JSON-LD Structured Data ──────────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description?.substring(0, 200),
    image: images.length > 0 ? images[0].url : undefined,
    offers: product.price ? {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "USD",
      availability: "https://schema.org/InStock",
    } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
        <Link href="/" className="hover:text-carreta-red">{t("nav.home")}</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-carreta-red">{t("nav.browse")}</Link>
        <span>/</span>
        <span className="text-carreta-red font-medium">{product.title}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* ─── Images ───────────────────────────────────── */}

        <ProductImageGallery images={images} productTitle={product.title} />

        {/* ─── Product Info ──────────────────────────────── */}
        <div>
          {product.categoryName && (
            <span className="inline-block rounded-full bg-carreta-blue/10 px-4 py-1.5 text-xs font-semibold text-carreta-blue">
              {product.categorySlug ? t(`cat.${product.categorySlug}`) : product.categoryName}
            </span>
          )}

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell sm:text-4xl">
            {product.title}
          </h1>

          {price && (
            <p className="mt-4 text-3xl font-bold text-carreta-red">{price}</p>
          )}

          {/* Tags */}
          {product.tags && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.split(",").map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-carreta-gold/10 px-3 py-1 text-xs font-medium text-carreta-orange"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 carreta-divider" />

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
              {t("product.description")}
            </h2>
            <p className="mt-3 leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70 whitespace-pre-line">
              {product.description || t("product.noDescription")}
            </p>
          </div>

          {/* ─── Artisan Contact Card ────────────────────── */}
          <div className="mt-8 rounded-xl border-2 border-carreta-gold/20 bg-gradient-to-br from-carreta-gold/5 to-carreta-orange/5 p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-carreta-gold/20">
                  {product.artisanAvatar ? (
                    <Image
                      src={product.artisanAvatar}
                      alt={product.artisanName || "Artisan"}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xl">🎨</span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <Link
                  href={`/artisans/${product.artisanId}`}
                  className="text-lg font-semibold text-carreta-blue hover:text-carreta-red transition-colors"
                >
                  {product.artisanBusinessName || product.artisanName || "Artisan"}
                </Link>
                {product.artisanLocation && (
                  <p className="mt-1 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    📍 {product.artisanLocation}
                  </p>
                )}
                {product.artisanBio && (
                  <p className="mt-2 text-sm leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70 line-clamp-2">
                    {product.artisanBio}
                  </p>
                )}

                {/* Contact buttons */}
                <div className="mt-4 flex flex-wrap gap-3">
                  {product.artisanEmail && (
                    <TrackedLink
                      href={`mailto:${product.artisanEmail}`}
                      eventType="email_click"
                      artisanId={product.artisanId}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-carreta-blue/30 px-4 py-2 text-xs font-medium text-carreta-blue transition-all hover:border-carreta-blue hover:bg-carreta-blue/5"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {t("product.email")}
                    </TrackedLink>
                  )}
                  {product.artisanWhatsapp && (
                    <TrackedLink
                      href={`https://wa.me/${product.artisanWhatsapp.replace(/[^0-9]/g, "")}?text=Hi! I'm interested in ${product.title}`}
                      eventType="whatsapp_click"
                      artisanId={product.artisanId}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-green-500/30 px-4 py-2 text-xs font-medium text-green-600 transition-all hover:border-green-500 hover:bg-green-500/5"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {t("product.whatsapp")}
                    </TrackedLink>
                  )}
                  {product.artisanInstagram && (
                    <TrackedLink
                      href={`https://instagram.com/${product.artisanInstagram.replace("@", "")}`}
                      eventType="instagram_click"
                      artisanId={product.artisanId}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-carreta-fuchsia/30 px-4 py-2 text-xs font-medium text-carreta-fuchsia transition-all hover:border-carreta-fuchsia hover:bg-carreta-fuchsia/5"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                      {t("product.instagram")}
                    </TrackedLink>
                  )}
                  {product.artisanFacebook && (
                    <TrackedLink
                      href={product.artisanFacebook.startsWith("http") ? product.artisanFacebook : `https://facebook.com/${product.artisanFacebook}`}
                      eventType="facebook_click"
                      artisanId={product.artisanId}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-blue-500/30 px-4 py-2 text-xs font-medium text-blue-600 transition-all hover:border-blue-500 hover:bg-blue-500/5"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      {t("product.facebook")}
                    </TrackedLink>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Related Products ──────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-carreta-red/10 pt-12">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
                {t("product.related.title")}
              </h2>
              <p className="mt-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                {t("product.related.subtitle")}
              </p>
            </div>
            <Link
              href={`/products?category=${product.categorySlug}`}
              className="hidden shrink-0 text-sm font-semibold text-carreta-red transition-colors hover:text-carreta-orange sm:block"
            >
              {t("products.all")} →
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((rp) => (
              <ProductCard
                key={rp.id}
                product={rp}
                byLabel={t("products.by")}
                categoryLabel={rp.categorySlug ? t(`cat.${rp.categorySlug}`) : undefined}
              />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href={`/products?category=${product.categorySlug}`}
              className="carreta-btn inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium"
            >
              {t("products.all")} →
            </Link>
          </div>
        </section>
      )}
    </div>
    </>
  );
}
