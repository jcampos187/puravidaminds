/**
 * 🛡️ Security Headers Test
 *
 * Verifies that security headers are present on pages and API routes.
 *
 * Usage:
 *   Local dev:     npx tsx scripts/test-security-headers.ts
 *   Vercel deploy: HEADER_TEST_URL=https://your-app.vercel.app npx tsx scripts/test-security-headers.ts
 */

export {};

const BASE_URL = (process.env.HEADER_TEST_URL || "http://localhost:3000").replace(/\/+$/, "");

interface HeaderCheck {
  name: string;
  path: string;
  method: string;
  expectedHeaders: Record<string, string>;
}

// Note: CORS headers (Access-Control-Allow-Origin, etc.) are intentionally NOT
// verified because this app serves its own API — no third-party cross-origin
// requests are expected. If the API is ever consumed by external clients in
// the future, CORS headers should be added and tested here.
const checks: HeaderCheck[] = [
  {
    name: "Home page security headers",
    path: "/",
    method: "GET",
    expectedHeaders: {
      "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
      "x-frame-options": "DENY",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), display-capture=(), geolocation=(), microphone=(), payment=(), usb=()",
      // CSP: verify all key directives are present
      "content-security-policy":
        "default-src 'self'; script-src 'self' https://*.clerk.accounts.dev https://challenges.cloudflare.com 'unsafe-inline'; style-src 'self' https://*.clerk.accounts.dev 'unsafe-inline';" +
        " img-src 'self' data: blob: https://*.clerk.com https://utfs.io https://images.unsplash.com;" +
        " font-src 'self' data:;" +
        " connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev wss://*.clerk.com;" +
        " frame-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com;" +
        " worker-src 'self' blob:;" +
        " object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    },
  },
  {
    name: "API route security headers",
    path: "/api/validate-password",
    method: "POST",
    expectedHeaders: {
      "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
      "x-frame-options": "DENY",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), display-capture=(), geolocation=(), microphone=(), payment=(), usb=()",
      "content-security-policy":
        "default-src 'self'; script-src 'self' https://*.clerk.accounts.dev https://challenges.cloudflare.com 'unsafe-inline'; style-src 'self' https://*.clerk.accounts.dev 'unsafe-inline';" +
        " img-src 'self' data: blob: https://*.clerk.com https://utfs.io https://images.unsplash.com;" +
        " font-src 'self' data:;" +
        " connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev wss://*.clerk.com;" +
        " frame-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com;" +
        " worker-src 'self' blob:;" +
        " object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    },
  },
  {
    name: "Products listing headers",
    path: "/products",
    method: "GET",
    expectedHeaders: {
      "x-frame-options": "DENY",
    },
  },
];

interface CheckResult {
  name: string;
  passed: boolean;
  status: number;
  durationMs: number;
  headers: Record<string, string>;
  missing: string[];
  mismatched: { header: string; expected: string; actual: string }[];
}

async function runCheck(check: HeaderCheck): Promise<CheckResult> {
  const url = `${BASE_URL}${check.path}`;
  const start = performance.now();

  const result: CheckResult = {
    name: check.name,
    passed: false,
    status: 0,
    durationMs: 0,
    headers: {},
    missing: [],
    mismatched: [],
  };

  try {
    const headers: Record<string, string> = {};
    let body: string | undefined;

    if (check.method === "POST") {
      headers["Content-Type"] = "application/json";
      body = "{}";
    }

    const response = await fetch(url, {
      method: check.method,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
      body,
      signal: AbortSignal.timeout(15000),
    });

    result.status = response.status;
    result.durationMs = Math.round(performance.now() - start);

    // Collect all response headers
    response.headers.forEach((value, key) => {
      result.headers[key.toLowerCase()] = value;
    });

    // Check each expected header
    for (const [expectedKey, expectedValue] of Object.entries(check.expectedHeaders)) {
      const actualValue = result.headers[expectedKey.toLowerCase()];

      if (actualValue === undefined) {
        result.missing.push(expectedKey);
      } else if (!compareHeaderValues(expectedKey, expectedValue, actualValue)) {
        result.mismatched.push({
          header: expectedKey,
          expected: expectedValue,
          actual: actualValue,
        });
      }
    }

    result.passed = result.missing.length === 0 && result.mismatched.length === 0;
  } catch (err) {
    result.durationMs = Math.round(performance.now() - start);
  }

  return result;
}

/**
 * Compare header values with some flexibility:
 * - HSTS: check it starts with the expected value (Vercel may add directives)
 * - CSP: check each expected directive is present in the actual value
 * - Other headers: exact match
 */
function compareHeaderValues(key: string, expected: string, actual: string): boolean {
  const lowerKey = key.toLowerCase();

  if (lowerKey === "strict-transport-security") {
    return actual.startsWith(expected);
  }

  if (lowerKey === "content-security-policy") {
    // CSP can have additional directives; check each expected directive is present
    const expectedParts = expected.split(";").map((p) => p.trim()).filter(Boolean);
    return expectedParts.every((part) => actual.includes(part));
  }

  return actual === expected;
}

async function main(): Promise<void> {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🛡️  Security Headers Test");
  console.log(`  URL: ${BASE_URL}`);
  console.log(`  Checks: ${checks.length}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Warm-up for Vercel cold starts
  if (process.env.HEADER_TEST_URL) {
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
    console.log(`  ${icon} ${check.name}`);
    console.log(`     ${duration}  •  HTTP ${result.status}`);

    // Show header details
    for (const [key, value] of Object.entries(check.expectedHeaders)) {
      const actual = result.headers[key.toLowerCase()];
      const match = actual !== undefined && compareHeaderValues(key, value, actual);
      console.log(`     ${match ? "✓" : "✗"} ${key}: ${actual || "MISSING"}`);
    }

    if (result.mismatched.length > 0) {
      for (const m of result.mismatched) {
        console.log(`     ⚠️  ${m.header}: expected "${m.expected}", got "${m.actual}"`);
      }
    }

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
    console.log("  ❌ Missing or incorrect security headers:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`     - ${r.name}`);
        r.missing.forEach((h) => console.log(`       ✗ ${h}: MISSING`));
        r.mismatched.forEach((m) =>
          console.log(`       ⚠️  ${m.header}: expected "${m.expected}", got "${m.actual}"`)
        );
      });
    console.log();
    process.exit(1);
  }

  console.log("  ✅ All security headers are present and correct!\n");
}

main();
