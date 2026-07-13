import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, artisanProfiles, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import CarretaWheel from "@/components/CarretaWheel";
import { ProductForm } from "./product-form";
import { getTranslations } from "@/i18n/getTranslations";

export default async function NewProductPage() {
  const { t } = await getTranslations();
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  // Get local user and verify they have an artisan profile
  const [localUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);
  if (!localUser) redirect("/dashboard/profile?setup=true");

  const [profileCheck] = await db
    .select({ id: artisanProfiles.id })
    .from(artisanProfiles)
    .where(eq(artisanProfiles.userId, localUser.id))
    .limit(1);
  if (!profileCheck) redirect("/dashboard/profile?setup=true");

  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(categories.displayOrder);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4">
          <CarretaWheel size={36} variant="outline" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
              {t("add.title")}
            </h1>
            <p className="mt-1 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
              {t("productForm.sub")}
            </p>
          </div>
        </div>
      </div>

      <ProductForm categories={allCategories} />
    </div>
  );
}
