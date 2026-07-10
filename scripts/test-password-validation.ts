/**
 * 🧪 Password Validation API Test Script
 *
 * Tests the /api/validate-password endpoint with various password scenarios.
 *
 * Usage:
 *   Local dev:     npx tsx scripts/test-password-validation.ts
 *   Vercel deploy: VERIFICATION_URL=https://your-app.vercel.app npx tsx scripts/test-password-validation.ts
 */

// Export marker to make this a module so TypeScript doesn't conflict
// with other scripts that declare the same variable names.
export {};

const BASE_URL = process.env.VERIFICATION_URL || "http://localhost:3000";
const ENDPOINT = `${BASE_URL.replace(/\/+$/, "")}/api/validate-password`;

interface TestCase {
  name: string;
  payload: Record<string, unknown> | unknown[];
  expectedStatus: number;
  expectedValid?: boolean;
  expectedMetCount?: number;
}

interface ValidationResult {
  valid: boolean;
  requirements: {
    minLength: boolean;
    hasUpper: boolean;
    hasLower: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
  metCount: number;
  error?: string;
}

const tests: TestCase[] = [
  {
    name: "Strong password — all requirements met",
    payload: { password: "Str0ng!Pass" },
    expectedStatus: 200,
    expectedValid: true,
    expectedMetCount: 5,
  },
  {
    name: "Missing password field",
    payload: {},
    expectedStatus: 400,
  },
  {
    name: "Password is null",
    payload: { password: null },
    expectedStatus: 400,
  },
  {
    name: "Password is a number instead of string",
    payload: { password: 12345678 },
    expectedStatus: 400,
  },
  {
    name: "Too short — only 4 characters",
    payload: { password: "Abc1" },
    expectedStatus: 200,
    expectedValid: false,
    expectedMetCount: 3, // hasUpper ✓, hasLower ✓, hasNumber ✓
  },
  {
    name: "No uppercase letter",
    payload: { password: "weakpass1!" },
    expectedStatus: 200,
    expectedValid: false,
    expectedMetCount: 4, // missing hasUpper
  },
  {
    name: "No lowercase letter",
    payload: { password: "WEAKPASS1!" },
    expectedStatus: 200,
    expectedValid: false,
    expectedMetCount: 4, // missing hasLower
  },
  {
    name: "No number",
    payload: { password: "WeakPass!" },
    expectedStatus: 200,
    expectedValid: false,
    expectedMetCount: 4, // missing hasNumber
  },
  {
    name: "No special character",
    payload: { password: "WeakPass1" },
    expectedStatus: 200,
    expectedValid: false,
    expectedMetCount: 4, // missing hasSpecial
  },
  {
    name: "Only lowercase letters — very weak",
    payload: { password: "weakpass" },
    expectedStatus: 200,
    expectedValid: false,
    expectedMetCount: 2, // minLength ✓, hasLower ✓
  },
  {
    name: "Exactly 8 characters with all requirements",
    payload: { password: "Abcd!234" },
    expectedStatus: 200,
    expectedValid: true,
    expectedMetCount: 5,
  },
  {
    name: "All special characters and numbers — but no letters",
    payload: { password: "1234!@#$" },
    expectedStatus: 200,
    expectedValid: false,
    expectedMetCount: 3, // minLength, hasNumber, hasSpecial
  },
  {
    name: "Password with underscore (counts as special)",
    payload: { password: "Strong_Pass1" },
    expectedStatus: 200,
    expectedValid: true,
    expectedMetCount: 5,
  },
  {
    name: "Long password — 100 characters",
    payload: { password: "A".repeat(50) + "1!a" + "x".repeat(47) },
    expectedStatus: 200,
    expectedValid: true,
    expectedMetCount: 5,
  },
  {
    name: "Whitespace-only password",
    payload: { password: "        " },
    expectedStatus: 200,
    expectedValid: false,
    expectedMetCount: 1, // only minLength
  },
  {
    name: "Empty string password",
    payload: { password: "" },
    expectedStatus: 400, // empty string is falsy → returns "Password is required."
  },
  {
    name: "Array body instead of object — parsed as JSON but not a valid password",
    payload: ["password123"],
    expectedStatus: 400,
  },
];

interface TestResult {
  name: string;
  passed: boolean;
  status: number;
  data?: ValidationResult;
  error?: string;
}

async function runTests(): Promise<void> {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🧪 Password Validation API Tests");
  console.log(`  Endpoint: ${ENDPOINT}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // First check if the server is running (skip for Vercel deployments)
  if (!process.env.VERIFICATION_URL) {
    try {
      const healthCheck = await fetch(BASE_URL, { signal: AbortSignal.timeout(3000) });
      if (!healthCheck.ok) {
        console.log(`  ⚠️  Server responded but with status ${healthCheck.status}`);
      }
    } catch {
      console.log("  ❌ Server is not running!");
      console.log("  → Start the dev server first:  npm run dev");
      console.log("  → Or point to a Vercel deployment:");
      console.log("    VERIFICATION_URL=https://your-app.vercel.app npx tsx scripts/test-password-validation.ts\n");
      process.exit(1);
    }
  } else {
    console.log(`  🌐 Testing against Vercel deployment: ${BASE_URL}`);
    // Warm-up pings to avoid cold-start timeouts — API functions cold-start independently
    console.log("  🌡️  Warming up...");
    const contactEndpoint = `${BASE_URL.replace(/\/+$/, "")}/api/contact`;
    await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => {});
    await fetch(contactEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => {});
    console.log();
  }

  const results: TestResult[] = [];

  for (const test of tests) {
    const result: TestResult = {
      name: test.name,
      passed: false,
      status: 0,
    };

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(test.payload),
        signal: AbortSignal.timeout(10000),
      });

      result.status = response.status;

      if (response.ok) {
        const data: ValidationResult = await response.json();
        result.data = data;

        const statusOk = response.status === test.expectedStatus;
        const validOk = test.expectedValid === undefined || data.valid === test.expectedValid;
        const metCountOk = test.expectedMetCount === undefined || data.metCount === test.expectedMetCount;

        result.passed = statusOk && validOk && metCountOk;

        if (!result.passed) {
          const issues: string[] = [];
          if (!statusOk) issues.push(`expected status ${test.expectedStatus}, got ${response.status}`);
          if (!validOk) issues.push(`expected valid=${test.expectedValid}, got ${data.valid}`);
          if (!metCountOk) issues.push(`expected metCount=${test.expectedMetCount}, got ${data.metCount}`);
          result.error = issues.join("; ");
        }
      } else {
        const errData = await response.json().catch(() => null);
        result.passed = response.status === test.expectedStatus;
        if (!result.passed) {
          result.error = `expected status ${test.expectedStatus}, got ${response.status} — ${JSON.stringify(errData)}`;
        }
      }
    } catch (err) {
      result.error = err instanceof Error ? err.message : String(err);
    }

    results.push(result);

    const icon = result.passed ? "✅" : "❌";
    const details = result.data
      ? `  valid: ${result.data.valid} | met: ${result.data.metCount}/5 | status: ${result.status}`
      : `  status: ${result.status}`;
    console.log(`  ${icon} ${test.name}`);
    console.log(`     ${details}`);
    if (result.error) {
      console.log(`     ⚠️  ${result.error}`);
    }
    console.log();
  }

  // Summary
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  📊 Results: ${passed} passed, ${failed} failed`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (failed > 0) {
    console.log("  ❌ Failed tests:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`     - ${r.name}`);
        console.log(`       ${r.error}`);
      });
    console.log();
    process.exit(1);
  }
}

runTests();
