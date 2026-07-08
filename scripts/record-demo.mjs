import { chromium } from "playwright";

const URL = "https://puravidaminds.vercel.app";

async function main() {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    locale: "en-US",
    recordVideo: {
      dir: "/Users/jcampos/Downloads",
      size: { width: 780, height: 1688 },
    },
  });

  const page = await context.newPage();

  try {
    // ─── Scene 1: Hero ──────────────────────────────────
    console.log("📱 Scene 1: Loading hero...");
    await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(3000);

    // ─── Scene 2: Open menu ─────────────────────────────
    console.log("📱 Scene 2: Opening menu...");
    // Find by aria-label containing "men" (matches both EN "menu" and ES "menú")
    const menuBtn = page.locator('[aria-label*="men" i]').first();
    await menuBtn.waitFor({ state: "visible", timeout: 15000 });
    await menuBtn.click();
    console.log("  ✓ Menu opened");
    await page.waitForTimeout(3000);

    // ─── Scene 3: Menu visible ──────────────────────────
    console.log("📱 Scene 3: Menu items displayed...");
    // Look for products link inside the mobile menu overlay (fixed, z-50)
    const browseLink = page.locator('.fixed.inset-0.z-50 nav a[href="/products"]');
    await browseLink.waitFor({ state: "visible", timeout: 5000 });
    console.log("  ✓ Products link visible");
    await page.waitForTimeout(2000);

    // ─── Scene 4: Click Browse ──────────────────────────
    console.log("📱 Scene 4: Tapping Browse...");
    await browseLink.click();
    await page.waitForTimeout(3000);

    // ─── Scene 5: Scroll products ───────────────────────
    console.log("📱 Scene 5: Scrolling products...");
    await page.evaluate(() => window.scrollBy({ top: 500, behavior: "smooth" }));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollBy({ top: 500, behavior: "smooth" }));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // ─── Scene 6: Open product ──────────────────────────
    console.log("📱 Scene 6: Opening product...");
    const productLink = page.locator('a[href^="/products/"]').first();
    await productLink.waitFor({ state: "visible", timeout: 10000 });
    await productLink.click();
    await page.waitForTimeout(3000);

    // ─── Scene 7: Scroll product details ────────────────
    console.log("📱 Scene 7: Scrolling product...");
    await page.evaluate(() => window.scrollBy({ top: 500, behavior: "smooth" }));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await page.waitForTimeout(1500);

    // ─── Scene 8: Products page + menu ──────────────────
    console.log("📱 Scene 8: Back to products...");
    await page.goto(`${URL}/products`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);

    const menuBtn2 = page.locator('[aria-label*="men" i]').first();
    await menuBtn2.click();
    await page.waitForTimeout(2500);

    // ─── Scene 9: Navigate to Artisans ──────────────────
    console.log("📱 Scene 9: Tapping Artisans...");
    const artLink = page.locator('.fixed.inset-0.z-50 nav a[href="/artisans"]');
    await artLink.click();
    await page.waitForTimeout(3000);

    // ─── Scene 10: Scroll artisans ──────────────────────
    console.log("📱 Scene 10: Scrolling artisans...");
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: "smooth" }));
    await page.waitForTimeout(2000);

    // ─── Scene 11: Back to hero ─────────────────────────
    console.log("📱 Scene 11: Back to hero...");
    await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);

    console.log("✅ Recording complete!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await context.close();
    await browser.close();

    const videoPath = (await page.video()?.path());
    if (videoPath) {
      console.log(`📁 Video saved: ${videoPath}`);
    }
  }
}

main();
