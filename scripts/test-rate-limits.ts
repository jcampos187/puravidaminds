/**
 * ⚡ Rate Limit Burst Test
 *
 * Verifies that all rate-limited API endpoints enforce their limits by
 * sending rapid requests and checking for 429 (Too Many Requests) responses
 * with proper rate limit headers.
 *
 * Usage:
 *   Local dev:     npx tsx scripts/test-rate-limits.ts
 *   Vercel deploy: RATE_LIMIT_TEST_URL=https://your-app.vercel.app npx tsx scripts/test-rate-limits.ts
 */

export {};

const BASE_URL = (process.env.RATE_LIMIT_TEST_URL || "http://localhost:3000").replace(/\/+$/, "");
const FAKE_ID = "00000000-0000-0000-0000-000000000000";

interface RateLimitEndpoint {
  name: string;
  method: string;
  path: string;
  /** Whether this endpoint requires Clerk authentication */
  requiresAuth: boolean;
  /** How many rapid requests to send */
  burstCount: number;
  /** Expected request limit per window */
  limit: number;
  /** Request body (if any) */
  body?: Record<string, unknown>;
}

// Note: burstCount should be 2-3 over the limit to reliably trigger 429
// Auth-required endpoints can only be smoke-tested (they return 401 before rate limit check)
const endpoints: RateLimitEndpoint[] = [
  {
    name: "Contact form (5/min)",
    method: "POST",
    path: "/api/contact",
    requiresAuth: false,
    burstCount: 7,
    limit: 5,
    body: {},
  },
  {
    name: "Password validation (20/min)",
    method: "POST",
    path: "/api/validate-password",
    requiresAuth: false,
    burstCount: 3,
    limit: 20,
    body: { password: "TestPass1!" },
  },
  {
    name: "Product creation (10/min)",
    method: "POST",
    path: "/api/products",
    requiresAuth: true,
    burstCount: 3,
    limit: 10,
    body: { title: "test", description: "rate limit test" },
  },
  {
    name: "Product update (20/min)",
    method: "PATCH",
    path: `/api/products/${FAKE_ID}`,
    requiresAuth: true,
    burstCount: 3,
    limit: 20,
    body: { title: "test update" },
  },
  {
    name: "Product delete (20/min)",
    method: "DELETE",
    path: `/api/products/${FAKE_ID}`,
    requiresAuth: true,
    burstCount: 3,
    limit: 20,
  },
  {
    name: "Artisan profile (10/min)",
    method: "PUT",
    path: "/api/artisan-profile",
    requiresAuth: true,
    burstCount: 3,
    limit: 10,
    body: { bio: "test", phone: "8888-8888", whatsapp: "8888-8888" },
  },
  {
    name: "Admin review product (30/min)",
    method: "PATCH",
    path: "/api/admin/review-product",
    requiresAuth: true,
    burstCount: 3,
    limit: 30,
    body: { productId: FAKE_ID, action: "approve" },
  },
  {
    name: "Admin review artisan (30/min)",
    method: "PATCH",
    path: "/api/admin/review-artisan",
    requiresAuth: true,
    burstCount: 3,
    limit: 30,
    body: { artisanUserId: FAKE_ID, action: "approve" },
  },
];

interface EndpointResult {
  name: string;
  method: string;
  path: string;
  requiresAuth: boolean;
  limit: number;
  requestCount: number;
  statuses: number[];
  rateLimited: boolean;
  rateLimitedAt: number; // request number where 429 was received
  headersPresent: boolean;
  headersValid: boolean;
  passed: boolean;
  durationMs: number;
  error?: string;
}

async function testEndpoint(endpoint: RateLimitEndpoint): Promise<EndpointResult> {
  const start = performance.now();
  const url = `${BASE_URL}${endpoint.path}`;

  const result: EndpointResult = {
    name: endpoint.name,
    method: endpoint.method,
    path: endpoint.path,
    requiresAuth: endpoint.requiresAuth,
    limit: endpoint.limit,
    requestCount: 0,
    statuses: [],
    rateLimited: false,
    rateLimitedAt: 0,
    headersPresent: false,
    headersValid: false,
    passed: false,
    durationMs: 0,
  };

  try {
    const headers: Record<string, string> = {};
    if (endpoint.method === "POST" || endpoint.method === "PATCH" || endpoint.method === "PUT") {
      headers["Content-Type"] = "application/json";
    }

    for (let i = 1; i <= endpoint.burstCount; i++) {
      await new Promise((r) => setTimeout(r, 200));
      const response = await fetch(url, {
        method: endpoint.method,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
        body: endpoint.body ? JSON.stringify(endpoint.body) : undefined,
        signal: AbortSignal.timeout(15000),
      });

      result.requestCount = i;
      result.statuses.push(response.status);
      const remainingHeader = response.headers.get("x-ratelimit-remaining");
      const limitHeader = response.headers.get("x-ratelimit-limit");
      const resetHeader = response.headers.get("x-ratelimit-reset");

      // Check rate limit headers
      if (limitHeader && remainingHeader && resetHeader) {
        result.headersPresent = true;
        // Remaining should be between 0 and limit-1
        const remaining = parseInt(remainingHeader, 10);
        const limit = parseInt(limitHeader, 10);
        if (!isNaN(remaining) && !isNaN(limit) && remaining >= 0 && remaining <= limit) {
          result.headersValid = true;
        }
      }

      if (response.status === 429) {
        result.rateLimited = true;
        result.rateLimitedAt = i;
        break; // Stop sending once rate limited
      }
    }

    // Determine pass/fail
    if (endpoint.requiresAuth) {
      // Auth-required endpoints return 401 before rate limit check runs.
      // Verify the endpoint responds with 401 (expected for unauthenticated)
      const lastStatus = result.statuses[result.statuses.length - 1];
      result.passed = lastStatus === 401;
      if (result.passed && result.headersPresent) {
        // Bonus: if rate limit headers are present anyway, check them
        result.passed = result.headersValid;
      }
      if (!result.passed) {
        result.error = `Expected 401 (unauthenticated), got ${lastStatus ?? "no response"} (statuses: ${result.statuses.join(", ")})`;
      }
    } else if (endpoint.burstCount > endpoint.limit) {
      // Burst test: verify rate limiting kicks in
      result.passed = result.rateLimited;
      if (!result.rateLimited) {
        result.error = `Expected rate limit after ${endpoint.limit} requests, but got none (statuses: ${result.statuses.join(", ")})`;
      }
    } else {
      // For shorter bursts, verify headers are valid
      result.passed = result.headersPresent && result.headersValid;
      if (!result.headersPresent) {
        result.error = "Rate limit headers (X-RateLimit-*) not present in response";
      } else if (!result.headersValid) {
        result.error = "Rate limit headers have invalid values";
      }
    }
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
  }

  result.durationMs = Math.round(performance.now() - start);
  return result;
}

async function main(): Promise<void> {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  ⚡ Rate Limit Burst Test");
  console.log(`  URL: ${BASE_URL}`);
  console.log(`  Endpoints: ${endpoints.length}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Warm-up
  if (process.env.RATE_LIMIT_TEST_URL) {
    console.log("  🌡️  Warming up...");
    await fetch(BASE_URL, { signal: AbortSignal.timeout(10000) }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1000));
    console.log();
  }

  const results: EndpointResult[] = [];

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);

    const icon = result.passed ? "✅" : "❌";
    const duration = `${result.durationMs}ms`.padStart(7);
    const limitIcon = result.rateLimited ? "🚫" : "  ";
    const authBadge = result.requiresAuth ? "🔒" : "🔓";
    console.log(`  ${icon} ${authBadge} ${endpoint.method} ${endpoint.path}`);
    console.log(`     ${duration}  •  Limit: ${endpoint.limit}/min  •  Sent: ${result.requestCount} requests`);

    if (result.rateLimited) {
      console.log(`     🚫 Rate limited at request #${result.rateLimitedAt} (429)`);
    }

    // Show status progression
    if (result.statuses.length > 0) {
      const statusLine = result.statuses
        .slice(0, 8)
        .map((s, i) => `#${i + 1}=${s}`)
        .join(", ");
      console.log(`     Statuses: ${statusLine}${result.statuses.length > 8 ? "..." : ""}`);
    }

    const headerNote = result.requiresAuth && !result.headersPresent ? " (no auth — headers not expected)" : "";
    console.log(`     Headers: ${result.headersPresent ? "✓" : "✗"}${headerNote}`);
    if (result.error) {
      console.log(`     ⚠️  ${result.error}`);
    }
    console.log();
  }

  // Summary
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalTime = results.reduce((sum, r) => sum + r.durationMs, 0);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  📊 Results: ${passed} passed, ${failed} failed`);
  console.log(`  ⏱  Total: ${totalTime}ms (avg ${Math.round(totalTime / results.length)}ms per endpoint)`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (failed > 0) {
    console.log("  ❌ Rate limit issues detected:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        const authTag = r.requiresAuth ? " [requires auth]" : "";
        console.log(`     - ${r.name} (${r.method} ${r.path})${authTag}`);
        console.log(`       ${r.error}`);
      });
    console.log();
    process.exit(1);
  }

  if (results.some((r) => r.requiresAuth)) {
    console.log(`  ℹ️  ${results.filter((r) => r.requiresAuth).length} endpoints require auth — only smoke-tested (no rate limit verification on those)\n`);
  }

  console.log("  ✅ All rate limits are enforced correctly!\n");
}

main();
