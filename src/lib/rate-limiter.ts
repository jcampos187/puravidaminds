/**
 * Simple in-memory rate limiter.
 *
 * Tracks request counts per IP address within a fixed time window.
 * Old entries are cleaned up on each check to prevent memory leaks.
 *
 * Note: On Vercel serverless, each instance has its own memory, so this
 * provides basic rate limiting per-instance. For strict global limits,
 * use a Redis-based solution instead.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10, // 10 requests
  windowMs: 60_000, // per 60 seconds
};

const store = new Map<string, RateLimitEntry>();

/**
 * Checks if a request from the given IP is within the rate limit.
 * If allowed, increments the counter. Returns an object with `allowed` boolean
 * and remaining requests / reset time for response headers.
 */
export function checkRateLimit(
  ip: string,
  config: Partial<RateLimitConfig> = {}
): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const { maxRequests, windowMs } = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();

  // Clean up expired entries periodically (every ~100 checks)
  if (Math.random() < 0.01) {
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) {
        store.delete(key);
      }
    }
  }

  const entry = store.get(ip);

  if (!entry || entry.resetAt <= now) {
    // First request or window expired — create new entry
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  // Within limit — increment
  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
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
