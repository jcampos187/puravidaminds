import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clickEvents } from "@/db/schema";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

// 30 click events per minute per IP — generous enough for real users, but limits abuse
const RATE_LIMIT_CONFIG = { maxRequests: 30, windowMs: 60_000 };

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(ip, RATE_LIMIT_CONFIG);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const body = await request.json() as {
      eventType: string;
      target: string;
      pageUrl?: string;
      artisanId?: string | null;
    };

    const { eventType, target, pageUrl, artisanId } = body;

    if (!eventType || !target) {
      return NextResponse.json(
        { error: "eventType and target are required" },
        { status: 400 },
      );
    }

    const validTypes = ["whatsapp_click", "facebook_click", "instagram_click", "email_click", "website_click", "phone_click"];
    if (!validTypes.includes(eventType)) {
      return NextResponse.json(
        { error: `Invalid eventType. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 },
      );
    }

    await db.insert(clickEvents).values({
      eventType,
      target,
      pageUrl: pageUrl || null,
      artisanId: artisanId || null,
    });

    return NextResponse.json({ success: true });
  } catch {
    // Fail silently — analytics should never break the user experience
    return NextResponse.json({ success: true });
  }
}
