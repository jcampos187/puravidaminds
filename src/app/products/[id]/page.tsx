import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { products, productImages, users, artisanProfiles, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import CarretaWheel from "@/components/CarretaWheel";
import { getTranslations } from "@/i18n/getTranslations";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { t } = await getTranslations();
  const { id } = await params;

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
      artisanEmail: users.email,
      artisanLocation: artisanProfiles.location,
      artisanPhone: artisanProfiles.phone,
      artisanWhatsapp: artisanProfiles.whatsapp,
      artisanInstagram: artisanProfiles.instagram,
      artisanFacebook: artisanProfiles.facebook,
      artisanBio: artisanProfiles.bio,
      artisanBusinessName: artisanProfiles.businessName,
      categoryName: categories.name,
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

        <div>
          <div className="relative overflow-hidden rounded-2xl border-2 border-carreta-red/20 bg-carreta-eggshell/50">
            {images.length > 0 ? (
              <img
                src={images[0].url}
                alt={images[0].altText || product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center">
                <CarretaWheel size={120} variant="outline" className="opacity-30" />
              </div>
            )}
          </div>

          {/* Thumbnail gallery */}
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  className={`shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    i === 0
                      ? "border-carreta-red"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText || `${product.title} image ${i + 1}`}
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Product Info ──────────────────────────────── */}
        <div>
          {product.categoryName && (
            <span className="inline-block rounded-full bg-carreta-blue/10 px-4 py-1.5 text-xs font-semibold text-carreta-blue">
              {product.categoryName}
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
              Description
            </h2>
            <p className="mt-3 leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70 whitespace-pre-line">
              {product.description || t("product.noDescription")}
            </p>
          </div>

          {/* ─── Artisan Contact Card ────────────────────── */}
          <div className="mt-8 rounded-xl border-2 border-carreta-gold/20 bg-gradient-to-br from-carreta-gold/5 to-carreta-orange/5 p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-carreta-gold/20">
                  {product.artisanAvatar ? (
                    <img
                      src={product.artisanAvatar}
                      alt={product.artisanName || "Artisan"}
                      className="h-full w-full object-cover"
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
                    <a
                      href={`mailto:${product.artisanEmail}?subject=Inquiry about ${product.title}`}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-carreta-blue/30 px-4 py-2 text-xs font-medium text-carreta-blue transition-all hover:border-carreta-blue hover:bg-carreta-blue/5"
                    >
                      ✉ {t("product.contact.title")}
                    </a>
                  )}
                  {product.artisanWhatsapp && (
                    <a
                      href={`https://wa.me/${product.artisanWhatsapp.replace(/[^0-9]/g, "")}?text=Hi! I'm interested in ${product.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-green-500/30 px-4 py-2 text-xs font-medium text-green-600 transition-all hover:border-green-500 hover:bg-green-500/5"
                    >
                      💬 WhatsApp
                    </a>
                  )}
                  {product.artisanInstagram && (
                    <a
                      href={`https://instagram.com/${product.artisanInstagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-carreta-fuchsia/30 px-4 py-2 text-xs font-medium text-carreta-fuchsia transition-all hover:border-carreta-fuchsia hover:bg-carreta-fuchsia/5"
                    >
                      📸 Instagram
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
