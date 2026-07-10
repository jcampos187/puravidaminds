/**
 * Global Redis-backed rate limiter using Upstash.
 *
 * Uses atomic INCR + EXPIRE to track request counts per IP across all Vercel instances.
 * Falls back to permissive (always allowed) if Redis is unavailable so the app
 * degrades gracefully instead of blocking legitimate traffic.
 */

import { redis } from "@/lib/redis";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60_000,
};

/**
 * Checks whether `identifier` (typically an IP address) has exceeded the rate
 * limit. Returns the result synchronously so callers receive immediate feedback
 * without awaiting a promise at the response layer.
 *
 * The function itself is async because it queries Redis, but the caller should
 * `await` the result, not try to return it early.
 */
export async function checkRateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): Promise<RateLimitResult> {
  const { maxRequests, windowMs } = { ...DEFAULT_CONFIG, ...config };

  try {
    const key = `ratelimit:${identifier}`;

    // INCR is atomic — safe under concurrent requests
    const count = await redis.incr(key);

    if (count === 1) {
      // First request in this window — set expiry
      await redis.expire(key, Math.ceil(windowMs / 1000));
    }

    const ttl = await redis.ttl(key);
    const resetAt = Date.now() + Math.max(ttl, 0) * 1000;

    if (count > maxRequests) {
      return { allowed: false, remaining: 0, resetAt };
    }

    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - count),
      resetAt,
    };
  } catch {
    // Redis unavailable — allow the request through gracefully
    return { allowed: true, remaining: 1, resetAt: Date.now() + windowMs };
  }
}

/**
 * Builds standard rate-limit response headers for use in NextResponse.
 */
export function buildRateLimitHeaders(
  rateLimit: RateLimitResult,
  maxRequests: number
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(maxRequests),
    "X-RateLimit-Remaining": String(rateLimit.remaining),
    "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
  };
}

/**
 * Extracts the client IP from a Request object.
 * Checks common headers used by Vercel, Cloudflare, and other proxies.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("true-client-ip") ||
    "127.0.0.1"
  );
}
