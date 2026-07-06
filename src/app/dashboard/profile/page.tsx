import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, artisanProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import CarretaWheel from "@/components/CarretaWheel";
import { ProfileForm } from "./profile-form";
import { getTranslations } from "@/i18n/getTranslations";

interface PageProps {
  searchParams: Promise<{ setup?: string }>;
}

export default async function ProfileSettingsPage({ searchParams }: PageProps) {
  const { setup } = await searchParams;
  const { t } = await getTranslations();
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  let [localUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  // First-time sign-ups from Clerk won't have a local user record yet
  if (!localUser) {
    const [created] = await db
      .insert(users)
      .values({
        clerkId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : null,
        avatarUrl: clerkUser.imageUrl,
        role: "artisan",
      })
      .returning();
    localUser = created;
  }

  const [profile] = await db
    .select()
    .from(artisanProfiles)
    .where(eq(artisanProfiles.userId, localUser.id))
    .limit(1);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10">
        {setup === "true" && (
          <div className="mb-8 rounded-xl border-2 border-carreta-gold/30 bg-gradient-to-br from-carreta-gold/10 to-carreta-orange/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <CarretaWheel size={28} animated />
              <div>
                <h2 className="font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
                  {t("dashboard.welcome", clerkUser?.firstName || "friend")}
                </h2>
                <p className="mt-1 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                  {t("dashboard.profile.setup")}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <CarretaWheel size={36} variant="outline" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E] dark:text-carreta-eggshell">
              {t("dashboard.profile")}
            </h1>
            <p className="mt-1 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
              {t("dashboard.profile.sub")}
            </p>
          </div>
        </div>
      </div>

      <ProfileForm
        initialData={
          profile
            ? {
                businessName: profile.businessName,
                bio: profile.bio,
                location: profile.location,
                phone: profile.phone,
                whatsapp: profile.whatsapp,
                website: profile.website,
                instagram: profile.instagram,
                facebook: profile.facebook,
                coverImageUrl: profile.coverImageUrl,
              }
            : undefined
        }
      />
    </div>
  );
}
