"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import CarretaWheel from "@/components/CarretaWheel";
import { useTranslations } from "@/i18n/useTranslations";
import type { Category } from "@/db/schema";

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    title: string;
    description: string;
    price: string;
    currency: string;
    categoryId: string | null;
    tags: string | null;
    status: string;
    imageUrls: { url: string; altText: string | null }[];
  };
  isEditing?: boolean;
}

export function ProductForm({ categories, initialData, isEditing }: ProductFormProps) {
  const router = useRouter();
  const { t } = useTranslations();
  const [imageUrls, setImageUrls] = useState<{ url: string; altText: string | null }[]>(
    initialData?.imageUrls || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get("title") as string,
      description: form.get("description") as string,
      price: form.get("price") as string,
      currency: form.get("currency") as string,
      categoryId: form.get("categoryId") as string,
      tags: form.get("tags") as string,
      status: form.get("status") as string,
      imageUrls: imageUrls,
    };

    try {
      const url = isEditing
        ? `/api/products/${initialData!.id}`
        : "/api/products";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("productForm.error.save"));
      }

      router.push("/dashboard/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("productForm.error.generic"));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error */}
      {error && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
        >
          {t("productForm.title.label")}
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initialData?.title || ""}
          placeholder={t("productForm.title.placeholder")}
          className="w-full rounded-xl border-2 border-carreta-blue/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-blue dark:bg-[#22223A] dark:text-carreta-eggshell"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
        >
          {t("productForm.desc.label")}
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          defaultValue={initialData?.description || ""}
          placeholder={t("productForm.desc.placeholder")}
          className="w-full rounded-xl border-2 border-carreta-blue/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-blue dark:bg-[#22223A] dark:text-carreta-eggshell"
        />
      </div>

      {/* Price & Currency */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="price"
            className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
          >
            {t("productForm.price.label")}
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialData?.price || ""}
            placeholder={t("productForm.price.placeholder")}
            className="w-full rounded-xl border-2 border-carreta-blue/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-blue dark:bg-[#22223A] dark:text-carreta-eggshell"
          />
        </div>

        <div>
          <label
            htmlFor="currency"
            className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
          >
            {t("productForm.currency.label")}
          </label>
          <select
            id="currency"
            name="currency"
            defaultValue={initialData?.currency || "CRC"}
            className="w-full rounded-xl border-2 border-carreta-blue/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] outline-none transition-all focus:border-carreta-blue dark:bg-[#22223A] dark:text-carreta-eggshell"
          >
            <option value="CRC">₡ CRC (Costa Rican Colón)</option>
            <option value="USD">$ USD (US Dollar)</option>
          </select>
        </div>
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="categoryId"
          className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
        >
          {t("productForm.category.label")}
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={initialData?.categoryId || ""}
          className="w-full rounded-xl border-2 border-carreta-blue/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] outline-none transition-all focus:border-carreta-blue dark:bg-[#22223A] dark:text-carreta-eggshell"
        >
          <option value="">{t("productForm.category.placeholder")}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {t(`cat.${cat.slug}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label
          htmlFor="tags"
          className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
        >
          {t("productForm.tags.label")}
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={initialData?.tags || ""}
          placeholder={t("productForm.tags.placeholder")}
          className="w-full rounded-xl border-2 border-carreta-blue/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] placeholder-[#1A1A2E]/40 outline-none transition-all focus:border-carreta-blue dark:bg-[#22223A] dark:text-carreta-eggshell"
        />
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="status"
          className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
        >
          {t("productForm.status.label")}
        </label>
        <select
          id="status"
          name="status"
          defaultValue={initialData?.status || "active"}
          className="w-full rounded-xl border-2 border-carreta-blue/20 bg-white px-5 py-3 text-sm text-[#1A1A2E] outline-none transition-all focus:border-carreta-blue dark:bg-[#22223A] dark:text-carreta-eggshell"
        >
          <option value="active">{t("productForm.status.active")}</option>
          <option value="inactive">{t("productForm.status.inactive")}</option>
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">
          {t("productForm.images.label")}
        </label>
        <div className="rounded-xl border-2 border-dashed border-carreta-blue/20 bg-white p-6 dark:bg-[#22223A]">
          <UploadButton
            endpoint="productImage"
            onClientUploadComplete={(res) => {
              if (res) {
                setImageUrls((prev) => [
                  ...prev,
                  ...res.map((r) => ({ url: r.url, altText: null })),
                ]);
              }
            }}
            onUploadError={(err) => {
              setError(err.message);
            }}
            appearance={{
              button:
                "carreta-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold",
              allowedContent:
                "mt-2 text-xs text-[#1A1A2E]/50 dark:text-carreta-eggshell/50",
            }}
          />

          {imageUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {imageUrls.map((img, i) => (
                <div key={img.url} className="relative aspect-square">
                  <Image
                    src={img.url}
                    alt={`Product image ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrls((prev) => prev.filter((_, j) => j !== i))
                    }
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-carreta-red text-xs text-white shadow-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="carreta-btn inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold disabled:opacity-50"
        >
          {isSubmitting
            ? t("productForm.loading")
            : isEditing
              ? t("productForm.submit.update")
              : t("productForm.submit.publish")}
          {!isSubmitting && <CarretaWheel size={18} variant="outline" />}
        </button>
        <Link
          href="/dashboard/products"
          className="text-sm text-[#1A1A2E]/60 hover:text-carreta-red dark:text-carreta-eggshell/60 dark:hover:text-carreta-gold"
        >
          {t("productForm.cancel")}
        </Link>
      </div>

      {/* Hidden field for image data */}
      <input
        type="hidden"
        name="imageData"
        value={JSON.stringify(imageUrls)}
      />
    </form>
  );
}
