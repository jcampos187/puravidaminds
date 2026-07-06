import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { users, products, productImages, categories } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import CarretaWheel from "@/components/CarretaWheel";
import { getTranslations } from "@/i18n/getTranslations";

export default async function MyProductsPage() {
  const { t } = await getTranslations();
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const [localUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!localUser) redirect("/dashboard");

  const myProducts = await db
    .select({
      id: products.id,
      title: products.title,
      price: products.price,
      currency: products.currency,
      status: products.status,
      createdAt: products.createdAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
      imageUrl: sql<string | null>`(
        SELECT ${productImages.url} FROM ${productImages}
        WHERE ${productImages.productId} = ${products.id}
        ORDER BY ${productImages.displayOrder}
        LIMIT 1
      )`,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.artisanId, localUser.id))
    .orderBy(desc(products.createdAt));

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <CarretaWheel size={36} variant="outline" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
              {t("dashboard.myProducts")}
            </h1>
            <p className="mt-1 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
              {t("dashboard.myProducts.count", String(myProducts.length))}
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/products/new"
          className="carreta-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
        >
          + {t("dashboard.addProduct")}
        </Link>
      </div>

      {/* Products */}
      {myProducts.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-carreta-red/20 bg-white/50 px-6 py-20 dark:bg-[#22223A]/50">
          <CarretaWheel size={64} variant="outline" className="opacity-30" />
          <h3 className="mt-6 text-lg font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
            {t("dashboard.noProducts")}
          </h3>
          <p className="mt-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
            {t("dashboard.noProducts.sub")}
          </p>
          <Link
            href="/dashboard/products/new"
            className="carreta-btn mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
          >
            + {t("dashboard.addFirstProduct")}
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border-2 border-carreta-red/10">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-carreta-red/5 dark:bg-carreta-red/10">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                  {t("dashboard.table.product")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                  {t("dashboard.table.category")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                  {t("dashboard.table.price")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                  {t("dashboard.table.status")}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                  {t("dashboard.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carreta-red/10">
              {myProducts.map((product) => {
                const price =
                  product.price && product.currency
                    ? product.currency === "CRC"
                      ? `₡${Number(product.price).toLocaleString("es-CR")}`
                      : `$${Number(product.price).toFixed(2)}`
                    : "—";
                return (
                  <tr
                    key={product.id}
                    className="bg-white transition-colors hover:bg-carreta-gold/5 dark:bg-[#22223A] dark:hover:bg-carreta-gold/10"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-carreta-eggshell/50">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-carreta-gold">
                              <CarretaWheel size={24} variant="outline" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-[#1A1A2E] dark:text-carreta-eggshell">
                          {product.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                      {product.categorySlug ? t(`cat.${product.categorySlug}`) : product.categoryName || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-carreta-red">
                      {price}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : product.status === "inactive"
                              ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {t(`product.status.${product.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/products/${product.id}/edit`}
                        className="text-sm font-medium text-carreta-blue transition-colors hover:text-carreta-red"
                      >
                        {t("dashboard.table.edit")}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/dashboard"
          className="text-sm text-[#1A1A2E]/60 hover:text-carreta-red dark:text-carreta-eggshell/60 dark:hover:text-carreta-gold"
        >
          {t("dashboard.products.back")}
        </Link>
      </div>
    </div>
  );
}
