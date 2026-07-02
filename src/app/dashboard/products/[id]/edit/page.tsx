import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { users, products, productImages, categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import CarretaWheel from "@/components/CarretaWheel";
import { ProductForm } from "../../new/product-form";
import { getTranslations } from "@/i18n/getTranslations";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { t } = await getTranslations();
  const { id } = await params;
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const [localUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);
  if (!localUser) redirect("/dashboard");

  // Get the product and ensure it belongs to this user
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!product || product.artisanId !== localUser.id) notFound();

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(asc(productImages.displayOrder));

  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(categories.displayOrder);

  const initialData = {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price || "",
    currency: product.currency,
    categoryId: product.categoryId,
    tags: product.tags || "",
    status: product.status,
    imageUrls: images.map((img) => ({
      url: img.url,
      altText: img.altText,
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-4">
          <CarretaWheel size={36} variant="outline" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
              {t("edit.title")}
            </h1>
            <p className="mt-1 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
              {product.title}
            </p>
          </div>
        </div>
      </div>

      <ProductForm
        categories={allCategories}
        initialData={initialData}
        isEditing
      />
    </div>
  );
}
