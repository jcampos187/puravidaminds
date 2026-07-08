import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);

  // Get all products with their images
  const products = await sql`
    SELECT p.id, p.title, json_agg(json_build_object(
      'img_id', pi.id,
      'url', pi.url,
      'order', pi.display_order,
      'alt', pi.alt_text
    ) ORDER BY pi.display_order) as images
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    GROUP BY p.id
    ORDER BY p.title
  `;

  for (const p of products) {
    console.log(`\n━━━ ${p.title} ━━━`);
    const imgs = p.images as any[];
    for (const img of imgs) {
      // Extract photo ID from URL
      const match = img.url?.match(/photo-([a-zA-Z0-9_-]+)\?/);
      const photoId = match ? match[1] : 'unknown';
      console.log(`  [${img.order}] ${photoId}  (${img.img_id?.substring(0,8)}...)`);
    }
  }
}

main().catch(console.error);
