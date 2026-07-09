import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { users, products, productImages } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { getTranslations } from "@/i18n/getTranslations";
import { ProductReviewActions } from "./actions";

export default async function AdminProductsPage() {
  const { t } = await getTranslations();

  const pendingProducts = await db
    .select({
      id: products.id,
      title: products.title,
      price: products.price,
      currency: products.currency,
      createdAt: products.createdAt,
      artisanName: users.name,
      artisanId: products.artisanId,
      imageUrl: sql<string | null>`(
        SELECT ${productImages.url} FROM ${productImages}
        WHERE ${productImages.productId} = ${products.id}
        ORDER BY ${productImages.displayOrder}
        LIMIT 1
      )`,
    })
    .from(products)
    .innerJoin(users, eq(products.artisanId, users.id))
    .where(eq(products.status, "pending"))
    .orderBy(desc(products.createdAt));

  // Recently approved
  const approvedProducts = await db
    .select({
      id: products.id,
      title: products.title,
      artisanName: users.name,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .innerJoin(users, eq(products.artisanId, users.id))
    .where(eq(products.status, "active"))
    .orderBy(desc(products.updatedAt))
    .limit(10);

  return (
    <div className="space-y-10">
      {/* Pending */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
          {t("admin.pendingProducts")}
        </h2>

        {pendingProducts.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-carreta-blue/20 bg-white/50 px-6 py-12 text-center dark:bg-[#22223A]/50">
            <p className="text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
              {t("admin.noPendingProducts")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border-2 border-carreta-blue/20">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-carreta-blue/5">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("admin.table.product")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("admin.table.artisanName")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("dashboard.table.price")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("admin.table.submitted")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("dashboard.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carreta-blue/10">
                {pendingProducts.map((product) => {
                  const price =
                    product.price && product.currency
                      ? product.currency === "CRC"
                        ? `₡${Number(product.price).toLocaleString("es-CR")}`
                        : `$${Number(product.price).toFixed(2)}`
                      : "—";
                  return (
                    <tr
                      key={product.id}
                      className="bg-white transition-colors hover:bg-carreta-blue/5 dark:bg-[#22223A] dark:hover:bg-carreta-blue/10"
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
                              <div className="flex h-full w-full items-center justify-center text-xs text-carreta-gold">
                                📷
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-[#1A1A2E] dark:text-carreta-eggshell">
                            {product.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                        {product.artisanName || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-carreta-red">
                        {price}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ProductReviewActions
                          productId={product.id}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recently Approved */}
      {approvedProducts.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
            {t("admin.approved")}
          </h2>
          <div className="overflow-x-auto rounded-xl border-2 border-green-200">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="bg-green-50 dark:bg-green-900/10">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("admin.table.product")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("admin.table.artisanName")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("admin.table.status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {approvedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="bg-white transition-colors dark:bg-[#22223A]"
                  >
                    <td className="px-6 py-4 font-medium text-[#1A1A2E] dark:text-carreta-eggshell">
                      {product.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                      {product.artisanName || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {t("admin.approved")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div>
        <Link
          href="/dashboard/admin"
          className="text-sm text-[#1A1A2E]/60 hover:text-carreta-red dark:text-carreta-eggshell/60 dark:hover:text-carreta-gold"
        >
          {t("admin.backToDashboard")}
        </Link>
      </div>
    </div>
  );
}
