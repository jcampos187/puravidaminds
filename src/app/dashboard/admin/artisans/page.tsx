import Link from "next/link";
import { db } from "@/db";
import { users, artisanProfiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getTranslations } from "@/i18n/getTranslations";
import { ArtisanReviewActions } from "./actions";

export default async function AdminArtisansPage() {
  const { t } = await getTranslations();

  const pendingArtisans = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      profile: {
        businessName: artisanProfiles.businessName,
        location: artisanProfiles.location,
        isVerified: artisanProfiles.isVerified,
      },
    })
    .from(users)
    .innerJoin(artisanProfiles, eq(users.id, artisanProfiles.userId))
    .where(eq(artisanProfiles.isVerified, false))
    .orderBy(desc(users.createdAt));

  // Also show recently approved artisans
  const approvedArtisans = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      profile: {
        businessName: artisanProfiles.businessName,
        location: artisanProfiles.location,
        isVerified: artisanProfiles.isVerified,
      },
    })
    .from(users)
    .innerJoin(artisanProfiles, eq(users.id, artisanProfiles.userId))
    .where(eq(artisanProfiles.isVerified, true))
    .orderBy(desc(artisanProfiles.updatedAt))
    .limit(10);

  return (
    <div className="space-y-10">
      {/* Pending */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
          {t("admin.pendingArtisans")}
        </h2>

        {pendingArtisans.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-carreta-gold/20 bg-white/50 px-6 py-12 text-center dark:bg-[#22223A]/50">
            <p className="text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
              {t("admin.noPendingArtisans")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border-2 border-carreta-gold/20">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-carreta-gold/5">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("admin.table.artisan")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("admin.table.email")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("admin.table.business")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("admin.table.submitted")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("dashboard.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carreta-gold/10">
                {pendingArtisans.map((artisan) => (
                  <tr
                    key={artisan.id}
                    className="bg-white transition-colors hover:bg-carreta-gold/5 dark:bg-[#22223A] dark:hover:bg-carreta-gold/10"
                  >
                    <td className="px-6 py-4 font-medium text-[#1A1A2E] dark:text-carreta-eggshell">
                      {artisan.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                      {artisan.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                      {artisan.profile?.businessName || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                      {new Date(artisan.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ArtisanReviewActions
                        artisanUserId={artisan.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recently Approved */}
      {approvedArtisans.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
            {t("admin.approved")}
          </h2>
          <div className="overflow-x-auto rounded-xl border-2 border-green-200">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-green-50 dark:bg-green-900/10">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("admin.table.artisan")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("admin.table.business")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {t("admin.table.status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {approvedArtisans.map((artisan) => (
                  <tr
                    key={artisan.id}
                    className="bg-white transition-colors dark:bg-[#22223A]"
                  >
                    <td className="px-6 py-4 font-medium text-[#1A1A2E] dark:text-carreta-eggshell">
                      {artisan.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                      {artisan.profile?.businessName || "—"}
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
