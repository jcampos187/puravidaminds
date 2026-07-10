import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, artisanProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notifyArtisanReviewResult } from "@/lib/notifications";
import { checkRateLimit, getClientIp, buildRateLimitHeaders } from "@/lib/rate-limiter";

// 30 admin review actions per minute per IP
const RATE_LIMIT_CONFIG = { maxRequests: 30, windowMs: 60_000 };

export async function PATCH(request: Request) {
  // Rate limiting
  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit(`admin:review-artisan:${ip}`, RATE_LIMIT_CONFIG);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      {
        status: 429,
        headers: buildRateLimitHeaders(rateLimit, RATE_LIMIT_CONFIG.maxRequests),
      }
    );
  }

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [admin] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { artisanUserId, action } = await request.json();

    if (!artisanUserId || !["approve", "decline"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Fetch the artisan user's info for the notification email
    const [artisanUser] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, artisanUserId))
      .limit(1);

    if (!artisanUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the artisan profile for business name
    const [artisanProfile] = await db
      .select({ businessName: artisanProfiles.businessName })
      .from(artisanProfiles)
      .where(eq(artisanProfiles.userId, artisanUserId))
      .limit(1);

    const businessName = artisanProfile?.businessName ?? null;

    if (action === "approve") {
      // Approve the artisan
      await db
        .update(artisanProfiles)
        .set({ isVerified: true, updatedAt: new Date() })
        .where(eq(artisanProfiles.userId, artisanUserId));

      // Also update user role to artisan
      await db
        .update(users)
        .set({ role: "artisan" })
        .where(eq(users.id, artisanUserId));

      // Send approval email to the artisan
      await notifyArtisanReviewResult(
        artisanUser.email,
        artisanUser.name || "Artisan",
        businessName,
        true
      );
    } else {
      // Decline — remove the artisan profile so it no longer shows in pending
      await db
        .delete(artisanProfiles)
        .where(eq(artisanProfiles.userId, artisanUserId));

      // Reset user role to customer and deactivate
      await db
        .update(users)
        .set({ role: "customer", isActive: false })
        .where(eq(users.id, artisanUserId));

      // Send decline email to the artisan
      await notifyArtisanReviewResult(
        artisanUser.email,
        artisanUser.name || "Artisan",
        businessName,
        false
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reviewing artisan:", error);
    return NextResponse.json({ error: "Failed to review artisan" }, { status: 500 });
  }
}
