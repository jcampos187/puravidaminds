import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

const MIN_LENGTH = 8;
const UPPER_RE = /[A-Z]/;
const LOWER_RE = /[a-z]/;
const NUMBER_RE = /[0-9]/;
const SPECIAL_RE = /[!@#$%^&*(),.?":{}|<>_]/;

// Allow up to 20 requests per IP per 60 seconds
const RATE_LIMIT_CONFIG = { maxRequests: 20, windowMs: 60_000 };

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

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(ip, RATE_LIMIT_CONFIG);

    const headers = {
      "X-RateLimit-Limit": String(RATE_LIMIT_CONFIG.maxRequests),
      "X-RateLimit-Remaining": String(rateLimit.remaining),
      "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
    };

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        { status: 429, headers }
      );
    }

    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    const requirements = {
      minLength: password.length >= MIN_LENGTH,
      hasUpper: UPPER_RE.test(password),
      hasLower: LOWER_RE.test(password),
      hasNumber: NUMBER_RE.test(password),
      hasSpecial: SPECIAL_RE.test(password),
    };

    const metCount = Object.values(requirements).filter(Boolean).length;
    const valid = metCount === 5;

    const result: ValidationResult = {
      valid,
      requirements,
      metCount,
    };

    if (!valid) {
      result.error = "Password does not meet security requirements.";
    }

    return NextResponse.json(result, { headers });  } catch {
    // Rate limit was already counted at the top of try — just return error
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
