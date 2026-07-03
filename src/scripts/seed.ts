import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { categories } from "@/db/schema";

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL not set. Make sure .env.local exists with DATABASE_URL.");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  const seedCategories = [
    {
      name: "Wood Carvings",
      slug: "wood-carvings",
      description:
        "Intricate hand-carved wooden pieces from Costa Rican hardwoods like cedar, mahogany, and balsa.",
      displayOrder: 1,
    },
    {
      name: "Jewelry & Accessories",
      slug: "jewelry",
      description:
        "Handcrafted adornments made from seeds, stones, leather, silver, and tropical materials.",
      displayOrder: 2,
    },
    {
      name: "Textiles & Weaving",
      slug: "textiles",
      description:
        "Traditional woven goods including hammocks, bags, blankets, and clothing from local fibers.",
      displayOrder: 3,
    },
    {
      name: "Ceramics & Pottery",
      slug: "ceramics",
      description:
        "Earthenware and pottery crafted from Costa Rican clay, featuring traditional and modern designs.",
      displayOrder: 4,
    },
    {
      name: "Paintings & Art",
      slug: "paintings",
      description:
        "Folk art, contemporary paintings, and mixed-media works inspired by Costa Rican landscapes and culture.",
      displayOrder: 5,
    },
    {
      name: "Coffee & Cacao",
      slug: "coffee-cacao",
      description:
        "Premium single-origin Costa Rican coffee and artisan chocolate made from local cacao.",
      displayOrder: 6,
    },
    {
      name: "Home Decor",
      slug: "home-decor",
      description:
        "Handcrafted furniture, decorative items, and furnishings that bring Costa Rican style to your home.",
      displayOrder: 7,
    },
    {
      name: "Leatherwork",
      slug: "leatherwork",
      description:
        "Hand-tooled leather goods including belts, bags, wallets, and traditional accessories.",
      displayOrder: 8,
    },
  ];

  console.log("🌱 Seeding categories...\n");

  for (const cat of seedCategories) {
    try {
      await db.insert(categories).values(cat);
      console.log(`  ✅ Created: ${cat.name}`);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err && (err as Record<string, unknown>).code === "23505") {
        console.log(`  ⏭️  Skipped (already exists): ${cat.name}`);
      } else {
        console.error(`  ❌ Error creating ${cat.name}:`, err);
      }
    }
  }

  console.log("\n✨ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
