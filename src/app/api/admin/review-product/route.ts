import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notifyProductReviewResult } from "@/lib/notifications";
import { checkRateLimit, getClientIp, buildRateLimitHeaders } from "@/lib/rate-limiter";

// 30 admin review actions per minute per IP
const RATE_LIMIT_CONFIG = { maxRequests: 30, windowMs: 60_000 };

export async function PATCH(request: Request) {
  // Rate limiting
  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit(`admin:review-product:${ip}`, RATE_LIMIT_CONFIG);

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
    const { productId, action } = await request.json();

    if (!productId || !["approve", "decline"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Fetch the product and its artisan for the notification email
    const [product] = await db
      .select({
        id: products.id,
        title: products.title,
        artisanId: products.artisanId,
      })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch the artisan's email and name
    const [artisanUser] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, product.artisanId))
      .limit(1);

    if (action === "approve") {
      await db
        .update(products)
        .set({
          status: "active",
          reviewedAt: new Date(),
          reviewedBy: admin.id,
          updatedAt: new Date(),
        })
        .where(eq(products.id, productId));

      // Send approval email to the artisan
      if (artisanUser) {
        await notifyProductReviewResult(
          artisanUser.email,
          artisanUser.name || "Artisan",
          product.title,
          true
        );
      }
    } else {
      await db
        .update(products)
        .set({
          status: "inactive",
          reviewedAt: new Date(),
          reviewedBy: admin.id,
          updatedAt: new Date(),
        })
        .where(eq(products.id, productId));

      // Send decline email to the artisan
      if (artisanUser) {
        await notifyProductReviewResult(
          artisanUser.email,
          artisanUser.name || "Artisan",
          product.title,
          false
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reviewing product:", error);
    return NextResponse.json({ error: "Failed to review product" }, { status: 500 });
  }
}
