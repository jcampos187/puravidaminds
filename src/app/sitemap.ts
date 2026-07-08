import type { MetadataRoute } from "next";
import { db } from "@/db";
import { products, users, artisanProfiles } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://puravidaminds.vercel.app";
  const lastModified = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/artisans`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Product pages
  try {
    const allProducts = await db
      .select({ id: products.id, updatedAt: products.updatedAt })
      .from(products)
      .where(eq(products.status, "active"));

    const productPages: MetadataRoute.Sitemap = allProducts.map((p) => ({
      url: `${baseUrl}/products/${p.id}`,
      lastModified: p.updatedAt || lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Artisan pages
    const allArtisans = await db
      .select({ id: users.id })
      .from(users)
      .innerJoin(artisanProfiles, eq(users.id, artisanProfiles.userId));

    const artisanPages: MetadataRoute.Sitemap = allArtisans.map((a) => ({
      url: `${baseUrl}/artisans/${a.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...productPages, ...artisanPages];
  } catch {
    return staticPages;
  }
}
