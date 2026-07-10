import { NextResponse } from "next/server";

const MIN_LENGTH = 8;
const UPPER_RE = /[A-Z]/;
const LOWER_RE = /[a-z]/;
const NUMBER_RE = /[0-9]/;
const SPECIAL_RE = /[!@#$%^&*(),.?":{}|<>_]/;

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

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
