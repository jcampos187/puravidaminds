import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/db/schema";

interface ProductCardProps {
  product: Product & {
    images?: { url: string; altText: string | null }[];
    artisanName?: string | null;
    artisanLocation?: string | null;
    categoryName?: string | null;
    categorySlug?: string | null;
  };
  byLabel?: string;
  categoryLabel?: string;
}

export default function ProductCard({ product, byLabel = "by", categoryLabel }: ProductCardProps) {
  const primaryImage = product.images?.[0]?.url;
  const price =
    product.price && product.currency
      ? product.currency === "CRC"
        ? `₡${Number(product.price).toLocaleString("es-CR")}`
        : `$${Number(product.price).toFixed(2)}`
      : null;

  return (
    <Link href={`/products/${product.id}`} className="carreta-card group block rounded-xl bg-white dark:bg-[#22223A]">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-carreta-eggshell/50">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.images?.[0]?.altText || product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              viewBox="0 0 120 120"
              className="h-16 w-16 opacity-30"
              aria-hidden="true"
            >
              <circle cx="60" cy="60" r="50" fill="none" stroke="#CC2936" strokeWidth="3" />
              <line x1="60" y1="12" x2="60" y2="108" stroke="#005ABB" strokeWidth="2" />
              <line x1="12" y1="60" x2="108" y2="60" stroke="#005ABB" strokeWidth="2" />
              <circle cx="60" cy="60" r="8" fill="#FFD700" stroke="#CC2936" strokeWidth="2" />
            </svg>
          </div>
        )}

        {/* Category badge */}
        {(categoryLabel || product.categoryName) && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-carreta-blue shadow-sm backdrop-blur-sm dark:bg-[#1A1A2E]/90 dark:text-carreta-turquoise">
            {categoryLabel || product.categoryName}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-[#1A1A2E] transition-colors group-hover:text-carreta-red dark:text-carreta-eggshell dark:group-hover:text-carreta-gold">
          {product.title}
        </h3>

        {product.artisanName && (
          <p className="mt-1 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
            {byLabel}{" "}
            <span className="font-medium text-carreta-blue">
              {product.artisanName}
            </span>
            {product.artisanLocation && (
              <span> · {product.artisanLocation}</span>
            )}
          </p>
        )}

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
          {product.description}
        </p>

        {/* Price */}
        {price && (
          <p className="mt-3 text-lg font-bold text-carreta-red">{price}</p>
        )}

        {/* Decorative bottom accent */}
        <div className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-carreta-red via-carreta-gold to-carreta-blue opacity-0 transition-all group-hover:w-full group-hover:opacity-100" />
      </div>
    </Link>
  );
}
