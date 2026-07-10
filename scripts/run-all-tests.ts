/**
 * 🎯 Pura Vida Minds — Master Test Runner
 *
 * Runs all 5 test suites sequentially and outputs a unified dashboard summary.
 * Runs sequentially to avoid rate limit collisions between concurrent suites.
 *
 * Usage:
 *   Local dev:     npx tsx scripts/run-all-tests.ts
 *   Vercel deploy: TEST_URL=https://your-app.vercel.app npx tsx scripts/run-all-tests.ts
 *
 *   You can also override individual URLs:
 *     TEST_URL=https://... \
 *     SMOKE_TEST_URL=https://... \
 *     npx tsx scripts/run-all-tests.ts
 */

import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";

// ── Configuration ──

interface TestSuite {
  id: string;
  name: string;
  icon: string;
  script: string;
  /** Expected number of individual checks/tests */
  expectedCount: number;
  /** Env var to set to TEST_URL (overridable via individual env var) */
  baseEnvVar: string;
  /** Estimated time budget (ms) — for progress estimation */
  timeBudgetMs: number;
}

const SCRIPTS_DIR = path.resolve(__dirname);

const suites: TestSuite[] = [
  {
    id: "password",
    name: "Password Validation",
    icon: "🔐",
    script: "test-password-validation.ts",
    expectedCount: 17,
    baseEnvVar: "VERIFICATION_URL",
    timeBudgetMs: 30_000,
  },
  {
    id: "smoke",
    name: "Deployment Smoke Test",
    icon: "🔥",
    script: "smoke-test.ts",
    expectedCount: 8,
    baseEnvVar: "SMOKE_TEST_URL",
    timeBudgetMs: 30_000,
  },
  {
    id: "auth",
    name: "Auth Guard Security",
    icon: "🛡️",
    script: "test-auth-guard.ts",
    expectedCount: 6,
    baseEnvVar: "AUTH_TEST_URL",
    timeBudgetMs: 30_000,
  },
  {
    id: "headers",
    name: "Security Headers",
    icon: "🛡️",
    script: "test-security-headers.ts",
    expectedCount: 3,
    baseEnvVar: "HEADER_TEST_URL",
    timeBudgetMs: 30_000,
  },
  {
    id: "ratelimit",
    name: "Rate Limit Burst",
    icon: "⚡",
    script: "test-rate-limits.ts",
    expectedCount: 8,
    baseEnvVar: "RATE_LIMIT_TEST_URL",
    timeBudgetMs: 60_000,
  },
];

// ── Results ──

interface SuiteResult {
  suite: TestSuite;
  passed: boolean;
  durationMs: number;
  exitCode: number;
  stdout: string;
  stderr: string;
  parsedPassed?: number;
  parsedFailed?: number;
  error?: string;
}

// ── Helpers ──

function parseSummary(stdout: string): { passed: number; failed: number } | null {
  const match = stdout.match(/(\d+)\s+passed,\s*(\d+)\s+failed/);
  if (match) {
    return { passed: parseInt(match[1], 10), failed: parseInt(match[2], 10) };
  }
  return null;
}

function extractDurationMs(stdout: string): number | null {
  const match = stdout.match(/Total:\s*(\d+)ms/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
}

function tail(str: string, lines: number): string {
  const parts = str.split("\n").filter(Boolean);
  return parts.slice(-lines).join("\n");
}

// ── Execution ──

function runSuite(suite: TestSuite, baseUrl: string): SuiteResult {
  const start = performance.now();
  const scriptPath = path.join(SCRIPTS_DIR, suite.script);
  const projectRoot = path.resolve(SCRIPTS_DIR, "..");

  if (!existsSync(scriptPath)) {
    return {
      suite,
      passed: false,
      durationMs: 0,
      exitCode: -1,
      stdout: "",
      stderr: "",
      error: `Script not found: ${scriptPath}`,
    };
  }

  // Build env: use individual env var if set, otherwise use TEST_URL
  const env = {
    ...process.env,
    [suite.baseEnvVar]:
      process.env[suite.baseEnvVar] || baseUrl,
  };

  const cmd = `npx tsx "${scriptPath}"`;
  const timeout = suite.timeBudgetMs + 30_000;

  let stdout = "";
  let stderr = "";
  let exitCode = -1;

  try {
    stdout = execSync(cmd, {
      cwd: projectRoot,
      env: env as NodeJS.ProcessEnv,
      timeout,
      encoding: "utf-8",
      stdio: "pipe",
    });
    exitCode = 0;
  } catch (err: unknown) {
    if (err && typeof err === "object" && "status" in err) {
      exitCode = (err as { status?: number }).status ?? -1;
    }
    if (err && typeof err === "object" && "stdout" in err) {
      const out = (err as { stdout?: unknown }).stdout;
      stdout = typeof out === "string" ? out : "";
    }
    if (err && typeof err === "object" && "stderr" in err) {
      const errOut = (err as { stderr?: unknown }).stderr;
      stderr = typeof errOut === "string" ? errOut : "";
    }
    if (!stdout && err instanceof Error) {
      stderr = stderr || err.message;
    }
  }

  const durationMs = Math.round(performance.now() - start);
  const summary = parseSummary(stdout);
  const outputDuration = extractDurationMs(stdout);

  return {
    suite,
    passed: exitCode === 0,
    durationMs: outputDuration ?? durationMs,
    exitCode,
    stdout,
    stderr,
    parsedPassed: summary?.passed,
    parsedFailed: summary?.failed,
  };
}

// ── Dashboard ──

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function buildBar(ratio: number, width: number): string {
  const safe = Number.isFinite(ratio) ? Math.max(0, Math.min(1, ratio)) : 0;
  const filled = Math.round(safe * width);
  const empty = width - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

function printDashboard(results: SuiteResult[], totalStart: number): void {
  const totalDuration = Math.round(performance.now() - totalStart);

  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║        🎯  Pura Vida Minds — Complete Test Suite Report    ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log();

  let suitesPassed = 0;
  let suitesFailed = 0;
  let totalChecksPassed = 0;
  let totalChecksFailed = 0;

  for (const result of results) {
    const s = result.suite;
    const icon = result.passed ? "✅" : "❌";
    const label = result.passed ? "PASS" : "FAIL";
    const duration = formatDuration(result.durationMs);

    if (result.passed) suitesPassed++;
    else suitesFailed++;

    const cp = result.parsedPassed ?? 0;
    const cf = result.parsedFailed ?? 0;
    totalChecksPassed += cp;
    totalChecksFailed += cf;

    const ratio = (cp + cf) > 0 ? cp / (cp + cf) : (result.passed ? 1 : 0);
    const countStr = `${cp}/${s.expectedCount}`;

    // Suite header
    console.log(`  ${icon}  ${s.icon}  ${s.name}`);
    console.log(`      ${label.padEnd(5)}  •  ${countStr.padStart(4)} checks  •  ${duration.padStart(7)}`);

    // Bar
    console.log(`      ${buildBar(ratio, 45)}  ${Math.round(ratio * 100)}%`);

    // Error context if failed
    if (!result.passed && result.stdout) {
      const context = tail(result.stdout, 5);
      console.log(`      ──`);
      for (const line of context.split("\n")) {
        console.log(`      ${line.trim()}`);
      }
    }

    console.log(`      ${"·".repeat(52)}`);
  }

  // ── Final score ──
  const grandTotal = totalChecksPassed + totalChecksFailed;
  const overallRatio = grandTotal > 0 ? totalChecksPassed / grandTotal : 0;
  const allPassed = suitesFailed === 0;

  console.log();
  console.log("  ┌────────────────────────────────────────────────────────┐");
  console.log("  │                    🏆  FINAL SCORE                    │");
  console.log("  ├────────────────────────────────────────────────────────┤");
  console.log(`  │  ${allPassed ? "✅" : "❌"}  Suites: ${suitesPassed}/${results.length} passed   Checks: ${totalChecksPassed}/${grandTotal} passed  │`);
  console.log(`  │  ⏱  Total time: ${formatDuration(totalDuration).padEnd(20)}              │`);
  console.log(`  │  ${buildBar(overallRatio, 40)}  ${Math.round(overallRatio * 100)}%  │`);
  console.log("  └────────────────────────────────────────────────────────┘");
  console.log();

  if (!allPassed) {
    console.log("  ❌  Failed suites:");
    for (const r of results.filter((r) => !r.passed)) {
      console.log(`     • ${r.suite.icon} ${r.suite.name} (exit ${r.exitCode})`);
    }
    console.log();
    console.log("  ℹ️  Re-run individual suites for full output:");
    for (const r of results.filter((r) => !r.passed)) {
      console.log(`     ${r.suite.baseEnvVar}=... npx tsx scripts/${r.suite.script}`);
    }
    console.log();
    console.log("  ⚠️  Note: rate limit tests consume API budgets.");
    console.log("       Wait ~60s before re-running affected suites.\n");
    process.exit(1);
  }

  console.log("  🎉  All tests pass! The deployment is healthy.\n");
}

// ── Main ──

async function main(): Promise<void> {
  const baseUrl = (process.env.TEST_URL || "http://localhost:3000").replace(/\/+$/, "");

  console.log();
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║         🎯  Pura Vida Minds — Master Test Runner           ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log();
  console.log(`  📍  Target: ${baseUrl}`);
  console.log(`  📋  Suites: ${suites.length} (sequential — no parallel concurrency)`);
  console.log(`  🔢  Total checks: ${suites.reduce((s, t) => s + t.expectedCount, 0)}`);
  console.log();
  console.log(`  ${"─".repeat(56)}`);

  const totalStart = performance.now();
  const results: SuiteResult[] = [];

  for (const suite of suites) {
    process.stdout.write(`  ${suite.icon}  ${suite.name.padEnd(27)}  running...`);

    const result = runSuite(suite, baseUrl);
    results.push(result);

    const icon = result.passed ? "✅" : "❌";
    const duration = formatDuration(result.durationMs);
    const count =
      result.parsedPassed !== undefined
        ? `${result.parsedPassed}/${result.suite.expectedCount}`
        : "?/?";

    process.stdout.write(`\r  ${icon}  ${suite.name.padEnd(27)}  ${count.padStart(4).padEnd(6)}  ${duration.padStart(7)}\n`);
  }

  console.log(`  ${"─".repeat(56)}`);
  console.log();

  printDashboard(results, totalStart);
}

main();
