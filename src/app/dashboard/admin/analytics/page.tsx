import { db } from "@/db";
import { clickEvents, artisanProfiles, users } from "@/db/schema";
import { sql, eq, and } from "drizzle-orm";
import { getTranslations } from "@/i18n/getTranslations";
import CarretaWheel from "@/components/CarretaWheel";

interface ClickStats {
  eventType: string;
  count: number;
}

interface ArtisanClickStats {
  artisanName: string | null;
  businessName: string | null;
  eventType: string;
  count: number;
}

async function getTotalClicks() {
  try {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(clickEvents);
    return result?.count || 0;
  } catch {
    return 0;
  }
}

async function getClicksByType(): Promise<ClickStats[]> {
  try {
    return await db
      .select({
        eventType: clickEvents.eventType,
        count: sql<number>`count(*)::int`,
      })
      .from(clickEvents)
      .groupBy(clickEvents.eventType)
      .orderBy(sql`count(*) desc`);
  } catch {
    return [];
  }
}

async function getRecentClicks(limit = 20) {
  try {
    return await db
      .select({
        id: clickEvents.id,
        eventType: clickEvents.eventType,
        target: clickEvents.target,
        pageUrl: clickEvents.pageUrl,
        artisanName: users.name,
        artisanBusinessName: artisanProfiles.businessName,
        createdAt: clickEvents.createdAt,
      })
      .from(clickEvents)
      .leftJoin(users, eq(clickEvents.artisanId, users.id))
      .leftJoin(artisanProfiles, eq(users.id, artisanProfiles.userId))
      .orderBy(sql`${clickEvents.createdAt} desc`)
      .limit(limit);
  } catch {
    return [];
  }
}

async function getTotalByArtisan(): Promise<ArtisanClickStats[]> {
  try {
    return await db
      .select({
        artisanName: users.name,
        businessName: artisanProfiles.businessName,
        eventType: clickEvents.eventType,
        count: sql<number>`count(*)::int`,
      })
      .from(clickEvents)
      .leftJoin(users, eq(clickEvents.artisanId, users.id))
      .leftJoin(artisanProfiles, eq(users.id, artisanProfiles.userId))
      .where(sql`${clickEvents.artisanId} is not null`)
      .groupBy(clickEvents.eventType, users.name, artisanProfiles.businessName)
      .orderBy(sql`count(*) desc`);
  } catch {
    return [];
  }
}

const EVENT_LABELS: Record<string, { en: string; es: string; emoji: string }> = {
  whatsapp_click: { en: "WhatsApp", es: "WhatsApp", emoji: "💬" },
  facebook_click: { en: "Facebook", es: "Facebook", emoji: "📘" },
  instagram_click: { en: "Instagram", es: "Instagram", emoji: "📸" },
  email_click: { en: "Email", es: "Correo", emoji: "✉️" },
  website_click: { en: "Website", es: "Sitio web", emoji: "🌐" },
  phone_click: { en: "Phone", es: "Teléfono", emoji: "📞" },
};

function formatDate(date: Date) {
  const d = new Date(date);
  return d.toLocaleDateString("es-CR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AnalyticsPage() {
  const { t, locale } = await getTranslations();
  const isEs = locale === "es";

  const [totalClicks, clicksByType, recentClicks, artisanStats] = await Promise.all([
    getTotalClicks(),
    getClicksByType(),
    getRecentClicks(),
    getTotalByArtisan(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E] dark:text-carreta-eggshell">
          📊 {isEs ? "Analíticas" : "Analytics"}
        </h1>
        <p className="mt-2 text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
          {isEs
            ? "Seguimiento de clics en enlaces de redes sociales y contacto"
            : "Track clicks on social media and contact links"}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border-2 border-carreta-red/20 bg-white p-6 dark:bg-[#22223A]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-carreta-red/10">
              <CarretaWheel size={24} variant="outline" />
            </div>
            <div>
              <p className="text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                {isEs ? "Total de clics" : "Total Clicks"}
              </p>
              <p className="text-3xl font-bold text-[#1A1A2E] dark:text-carreta-eggshell">
                {totalClicks}
              </p>
            </div>
          </div>
        </div>

        {clicksByType.map((stat) => {
          const label = EVENT_LABELS[stat.eventType] || {
            en: stat.eventType,
            es: stat.eventType,
            emoji: "🔗",
          };
          return (
            <div
              key={stat.eventType}
              className="rounded-xl border-2 border-carreta-gold/20 bg-white p-6 dark:bg-[#22223A]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-carreta-gold/10 text-xl">
                  {label.emoji}
                </div>
                <div>
                  <p className="text-sm text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                    {isEs ? label.es : label.en}
                  </p>
                  <p className="text-3xl font-bold text-[#1A1A2E] dark:text-carreta-eggshell">
                    {stat.count}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* By Artisan */}
      {artisanStats.length > 0 && (
        <div className="rounded-xl border-2 border-carreta-blue/20 bg-white p-6 dark:bg-[#22223A]">
          <h2 className="text-lg font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
            {isEs ? "Por artesano" : "By Artisan"}
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-carreta-red/10 text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                  <th className="pb-3 pr-4 font-medium">
                    {isEs ? "Artesano" : "Artisan"}
                  </th>
                  <th className="pb-3 pr-4 font-medium">
                    {isEs ? "Tipo" : "Type"}
                  </th>
                  <th className="pb-3 font-medium">
                    {isEs ? "Clics" : "Clicks"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {artisanStats.map((stat, i) => {
                  const label = EVENT_LABELS[stat.eventType] || {
                    en: stat.eventType,
                    es: stat.eventType,
                    emoji: "🔗",
                  };
                  const displayName =
                    stat.businessName || stat.artisanName || "Unknown";
                  return (
                    <tr
                      key={`${displayName}-${stat.eventType}-${i}`}
                      className="border-b border-carreta-red/5"
                    >
                      <td className="py-3 pr-4 text-[#1A1A2E] dark:text-carreta-eggshell">
                        {displayName}
                      </td>
                      <td className="py-3 pr-4 text-[#1A1A2E]/70 dark:text-carreta-eggshell/70">
                        {label.emoji}{" "}
                        {isEs ? label.es : label.en}
                      </td>
                      <td className="py-3 font-semibold text-carreta-red">
                        {stat.count}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="rounded-xl border-2 border-carreta-red/20 bg-white p-6 dark:bg-[#22223A]">
        <h2 className="text-lg font-semibold text-[#1A1A2E] dark:text-carreta-eggshell">
          {isEs ? "Actividad reciente" : "Recent Activity"}
        </h2>
        <div className="mt-4 space-y-2">
          {recentClicks.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#1A1A2E]/50 dark:text-carreta-eggshell/50">
              {isEs
                ? "Aún no hay actividad. Los clics comenzarán a registrarse cuando los visitantes interactúen con los enlaces."
                : "No activity yet. Clicks will start recording once visitors interact with links."}
            </p>
          ) : (
            recentClicks.map((click) => {
              const label = EVENT_LABELS[click.eventType] || {
                en: click.eventType,
                es: click.eventType,
                emoji: "🔗",
              };
              const displayName =
                click.artisanBusinessName || click.artisanName || null;
              return (
                <div
                  key={click.id}
                  className="flex items-center justify-between rounded-lg border border-carreta-red/10 bg-carreta-cream/50 px-4 py-3 dark:bg-[#1A1A2E]/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-carreta-gold/10 text-sm">
                      {label.emoji}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell">
                        {isEs ? label.es : label.en}
                      </p>
                      {displayName && (
                        <p className="text-xs text-[#1A1A2E]/60 dark:text-carreta-eggshell/60">
                          {displayName}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-[#1A1A2E]/50 dark:text-carreta-eggshell/50">
                    {formatDate(click.createdAt)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
