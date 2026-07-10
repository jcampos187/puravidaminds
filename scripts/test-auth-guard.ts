/**
 * 🛡️ Auth Guard Test
 *
 * Verifies that all authenticated API routes properly reject unauthenticated
 * requests with HTTP 401 (Unauthorized).
 *
 * Usage:
 *   Local dev:     npx tsx scripts/test-auth-guard.ts
 *   Vercel deploy: AUTH_TEST_URL=https://your-app.vercel.app npx tsx scripts/test-auth-guard.ts
 */

export {};

const BASE_URL = (process.env.AUTH_TEST_URL || "http://localhost:3000").replace(/\/+$/, "");
const FAKE_ID = "00000000-0000-0000-0000-000000000000";

interface AuthCheck {
  name: string;
  method: string;
  path: string;
  /** Expected status for an unauthenticated request */
  expectStatus: number;
  /** Request body (if any) */
  body?: Record<string, unknown>;
}

const checks: AuthCheck[] = [
  {
    name: "Product creation — POST /api/products",
    method: "POST",
    path: "/api/products",
    expectStatus: 401,
    body: { title: "Test", description: "Should not be created" },
  },
  {
    name: "Product update — PATCH /api/products/:id",
    method: "PATCH",
    path: `/api/products/${FAKE_ID}`,
    expectStatus: 401,
    body: { title: "Should not update" },
  },
  {
    name: "Product delete — DELETE /api/products/:id",
    method: "DELETE",
    path: `/api/products/${FAKE_ID}`,
    expectStatus: 401,
  },
  {
    name: "Artisan profile — PUT /api/artisan-profile",
    method: "PUT",
    path: "/api/artisan-profile",
    expectStatus: 401,
    body: { name: "Should not save", bio: "Should not save", phone: "8888-8888", whatsapp: "8888-8888" },
  },
  {
    name: "Admin review product — PATCH /api/admin/review-product",
    method: "PATCH",
    path: "/api/admin/review-product",
    expectStatus: 401,
    body: { productId: FAKE_ID, action: "approve" },
  },
  {
    name: "Admin review artisan — PATCH /api/admin/review-artisan",
    method: "PATCH",
    path: "/api/admin/review-artisan",
    expectStatus: 401,
    body: { artisanUserId: FAKE_ID, action: "approve" },
  },
];

interface CheckResult {
  name: string;
  passed: boolean;
  status: number;
  durationMs: number;
  error?: string;
}

async function runCheck(check: AuthCheck): Promise<CheckResult> {
  const url = `${BASE_URL}${check.path}`;
  const start = performance.now();

  const result: CheckResult = {
    name: check.name,
    passed: false,
    status: 0,
    durationMs: 0,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const body = check.body ? JSON.stringify(check.body) : undefined;

    const response = await fetch(url, {
      method: check.method,
      headers,
      body,
      signal: AbortSignal.timeout(15000),
    });

    result.status = response.status;
    result.durationMs = Math.round(performance.now() - start);

    if (response.status === check.expectStatus) {
      result.passed = true;
    } else if (response.status === 429) {
      result.error = `Rate limited (429) — auth test cannot proceed. Try again later.`;
    } else {
      const bodyPreview = await response.text().then((t) => t.slice(0, 100)).catch(() => "");
      result.error = `Expected ${check.expectStatus}, got ${response.status} — ${bodyPreview}`;
    }
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
    result.durationMs = Math.round(performance.now() - start);
  }

  return result;
}

async function main(): Promise<void> {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🛡️  Auth Guard Security Test");
  console.log(`  URL: ${BASE_URL}`);
  console.log(`  Checks: ${checks.length} (authenticated routes)`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Warm-up for Vercel cold starts
  if (process.env.AUTH_TEST_URL) {
    console.log("  🌡️  Warming up...");
    await fetch(BASE_URL, { signal: AbortSignal.timeout(10000) }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1000));
    console.log();
  }

  const results: CheckResult[] = [];

  for (const check of checks) {
    const result = await runCheck(check);
    results.push(result);

    const icon = result.passed ? "✅" : "❌";
    const duration = `${result.durationMs}ms`.padStart(7);
    console.log(`  ${icon} ${check.method} ${check.path}`);
    console.log(`     ${duration}  •  HTTP ${result.status}  ${result.error ? `⚠️  ${result.error}` : "(expected 401)"}`);
    console.log();
  }

  // Summary
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalTime = results.reduce((sum, r) => sum + r.durationMs, 0);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  📊 Results: ${passed} passed, ${failed} failed`);
  console.log(`  ⏱  Total: ${totalTime}ms (avg ${Math.round(totalTime / results.length)}ms per check)`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (failed > 0) {
    console.log("  ❌ Auth guard failures — these routes are NOT properly protected:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`     - ${r.name}`);
        console.log(`       ${r.error}`);
      });
    console.log();
    console.log("  ⚠️  If these fail, public users can access protected endpoints!");
    console.log();
    process.exit(1);
  }

  console.log("  ✅ All 6 authenticated routes properly reject unauthorized requests!\n");
}

main();
