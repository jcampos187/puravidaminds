import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { products, productImages, users, artisanProfiles, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProductImageGallery from "@/components/ProductImageGallery";
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

  if (locale === "es") {
    return {
      title: `${product.title} | Pura Vida Artesanías`,
      description: `Artesanía de ${artisanName}. Descubre este producto hecho a mano en Costa Rica.`,
    };
  }

  return {
    title: `${product.title} | Pura Vida Artesanías`,
    description: `Handcrafted by ${artisanName}. Discover this authentic Costa Rican product.`,
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
      artisanName: users.name,
      artisanAvatar: users.avatarUrl,
      artisanLocation: artisanProfiles.location,
      artisanPhone: artisanProfiles.phone,
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

  return (
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
                  {product.artisanWhatsapp && (
                    <a
                      href={`https://wa.me/${product.artisanWhatsapp.replace(/[^0-9]/g, "")}?text=Hi! I'm interested in ${product.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-green-500/30 px-4 py-2 text-xs font-medium text-green-600 transition-all hover:border-green-500 hover:bg-green-500/5"
                    >
                      💬 {t("product.whatsapp")}
                    </a>
                  )}
                  {product.artisanInstagram && (
                    <a
                      href={`https://instagram.com/${product.artisanInstagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-carreta-fuchsia/30 px-4 py-2 text-xs font-medium text-carreta-fuchsia transition-all hover:border-carreta-fuchsia hover:bg-carreta-fuchsia/5"
                    >
                      📸 {t("product.instagram")}
                    </a>
                  )}
                  {product.artisanFacebook && (
                    <a
                      href={product.artisanFacebook.startsWith("http") ? product.artisanFacebook : `https://facebook.com/${product.artisanFacebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-blue-500/30 px-4 py-2 text-xs font-medium text-blue-600 transition-all hover:border-blue-500 hover:bg-blue-500/5"
                    >
                      📘 {t("product.facebook")}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
