import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log("Running migration: add pending product status and review columns...");

  // Add 'pending' to product_status enum
  await sql`ALTER TYPE product_status ADD VALUE IF NOT EXISTS 'pending'`;
  console.log("✅ Added 'pending' value to product_status enum");

  // Add review columns to products table (if not already present)
  try {
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP`;
    console.log("✅ Added reviewed_at column");
  } catch (e) {
    console.log("ℹ️ reviewed_at column may already exist");
  }

  try {
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id)`;
    console.log("✅ Added reviewed_by column");
  } catch (e) {
    console.log("ℹ️ reviewed_by column may already exist");
  }

  console.log("✅ Pending status migration complete");

  // ─── Click Events Table ─────────────────────────────────────
  console.log("\nRunning migration: create click_events table...");

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS click_events (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        event_type TEXT NOT NULL,
        target TEXT NOT NULL,
        page_url TEXT,
        artisan_id UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log("✅ Created click_events table");
  } catch (e) {
    console.log("ℹ️ click_events table may already exist:", e);
  }

  console.log("\nMigration complete!");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
