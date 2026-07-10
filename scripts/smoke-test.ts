/**
 * 🔥 Pura Vida Minds — Deployment Smoke Test
 *
 * Pings all public pages and API routes to verify the app is healthy.
 *
 * Usage:
 *   Local dev:     npx tsx scripts/smoke-test.ts
 *   Vercel deploy: SMOKE_TEST_URL=https://your-app.vercel.app npx tsx scripts/smoke-test.ts
 */

const BASE_URL = (process.env.SMOKE_TEST_URL || "http://localhost:3000").replace(/\/+$/, "");

interface SmokeCheck {
  name: string;
  type: "page" | "api";
  method: string;
  path: string;
  /** For pages, check that body contains this string (optional) */
  bodyContains?: string;
  /** Expected HTTP status */
  expectStatus: number;
  /** For API routes, expect JSON content-type */
  expectJson?: boolean;
}

const checks: SmokeCheck[] = [
  // ── Public Pages ──
  { name: "Home page", type: "page", method: "GET", path: "/", expectStatus: 200, bodyContains: "Pura" },
  { name: "Products listing", type: "page", method: "GET", path: "/products", expectStatus: 200 },
  { name: "Artisans listing", type: "page", method: "GET", path: "/artisans", expectStatus: 200 },
  { name: "Privacy policy", type: "page", method: "GET", path: "/privacy", expectStatus: 200 },
  { name: "Terms of service", type: "page", method: "GET", path: "/terms", expectStatus: 200 },
  { name: "Sign-in page", type: "page", method: "GET", path: "/sign-in", expectStatus: 200 },
  { name: "Register page", type: "page", method: "GET", path: "/register", expectStatus: 200 },

  // ── API Routes ──
  {
    name: "Password validation — strong password",
    type: "api",
    method: "POST",
    path: "/api/validate-password",
    expectStatus: 200,
    expectJson: true,
  },
  {
    name: "Password validation — missing password (400)",
    type: "api",
    method: "POST",
    path: "/api/validate-password",
    expectStatus: 400,
    expectJson: true,
  },
  {
    name: "Contact form — missing fields (400)",
    type: "api",
    method: "POST",
    path: "/api/contact",
    expectStatus: 400,
    expectJson: true,
  },
];

interface CheckResult {
  name: string;
  passed: boolean;
  status: number;
  durationMs: number;
  error?: string;
}

async function runCheck(check: SmokeCheck): Promise<CheckResult> {
  const url = `${BASE_URL}${check.path}`;
  const start = performance.now();

  const result: CheckResult = {
    name: check.name,
    passed: false,
    status: 0,
    durationMs: 0,
  };

  try {
    const headers: Record<string, string> = {};
    let body: string | undefined;

    if (check.method === "POST" && check.path === "/api/validate-password") {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(
        check.expectStatus === 400 ? {} : { password: "Sm0ke!Test99" }
      );
    }

    if (check.method === "POST" && check.path === "/api/contact") {
      headers["Content-Type"] = "application/json";
      // Send empty body so it returns 400 (missing name/email/message)
      body = JSON.stringify({});
    }

    const response = await fetch(url, {
      method: check.method,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
      body,
      signal: AbortSignal.timeout(15000),
    });

    result.status = response.status;
    result.durationMs = Math.round(performance.now() - start);

    const contentType = response.headers.get("content-type") || "";

    if (check.expectJson && !contentType.includes("application/json")) {
      result.error = `Expected JSON but got ${contentType}`;
      return result;
    }

    if (response.status !== check.expectStatus) {
      const bodyPreview = await response.text().then((t) => t.slice(0, 100)).catch(() => "");
      result.error = `Expected status ${check.expectStatus}, got ${response.status} — ${bodyPreview}`;
      return result;
    }

    // For pages, optionally check body contains expected text
    if (check.bodyContains && check.type === "page") {
      const text = await response.text().catch(() => "");
      if (!text.includes(check.bodyContains)) {
        result.error = `Body did not contain "${check.bodyContains}"`;
        return result;
      }
    }

    result.passed = true;
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
    result.durationMs = Math.round(performance.now() - start);
  }

  return result;
}

async function main(): Promise<void> {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🔥 Pura Vida Minds — Deployment Smoke Test");
  console.log(`  URL: ${BASE_URL}`);
  console.log(`  Checks: ${checks.length}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Warm-up for Vercel cold starts — serverless functions cold-start independently per endpoint
  if (process.env.SMOKE_TEST_URL) {
    console.log("  🌡️  Warming up (cold-start prevention)...");
    await fetch(BASE_URL, { signal: AbortSignal.timeout(10000) }).catch(() => {});
    await fetch(`${BASE_URL}/api/validate-password`, {
      method: "POST",
      body: "{}",
      signal: AbortSignal.timeout(10000),
    }).catch(() => {});
    await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      body: "{}",
      signal: AbortSignal.timeout(10000),
    }).catch(() => {});
    // Small delay for serverless function to spin up
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
    console.log(`     ${duration}  •  HTTP ${result.status}  ${result.error ? `⚠️  ${result.error}` : ""}`);
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
    console.log("  ❌ Failed checks:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`     - ${r.name}`);
        console.log(`       ${r.error}`);
      });
    console.log();
    process.exit(1);
  }

  console.log("  ✅ All checks passed — deployment is healthy!\n");
}

main();
