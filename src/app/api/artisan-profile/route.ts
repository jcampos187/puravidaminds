import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, artisanProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notifyNewArtisan } from "@/lib/notifications";
import { checkRateLimit, getClientIp, buildRateLimitHeaders } from "@/lib/rate-limiter";

// 10 profile saves per minute per IP
const RATE_LIMIT_CONFIG = { maxRequests: 10, windowMs: 60_000 };

export async function PUT(request: Request) {
  // Rate limiting
  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit(`profile:${ip}`, RATE_LIMIT_CONFIG);

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

  // Parse body first so we can access email/name for user creation
  let signUpEmail = "";
  let signUpName: string | null = null;
  let body: Record<string, unknown>;

  try {
    body = await request.json();
    signUpEmail = (body.email as string) || "";
    signUpName = (body.name as string) || null;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  let [localUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  // Auto-create local user for new sign-ups (e.g. from custom sign-up form)
  if (!localUser) {
    // Check for duplicate email before creating
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, signUpEmail))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    const [created] = await db
      .insert(users)
      .values({
        clerkId,
        email: signUpEmail,
        name: signUpName,
        role: "artisan",
        isActive: true,
      })
      .returning();
    localUser = created;
  }

  try {
    const {
      businessName,
      bio,
      location,
      phone,
      whatsapp,
      website,
      instagram,
      facebook,
      coverImageUrl,
    } = body;

    // Validate required fields
    if (!bio || !(bio as string).trim()) {
      return NextResponse.json(
        { error: "Bio is required. Please tell us about yourself." },
        { status: 400 }
      );
    }
    if (!phone || !(phone as string).trim()) {
      return NextResponse.json(
        { error: "Phone number is required for customers to contact you." },
        { status: 400 }
      );
    }
    if (!whatsapp || !(whatsapp as string).trim()) {
      return NextResponse.json(
        { error: "WhatsApp number is required for customers to contact you." },
        { status: 400 }
      );
    }

    // Upsert artisan profile
    const [existing] = await db
      .select()
      .from(artisanProfiles)
      .where(eq(artisanProfiles.userId, localUser.id))
      .limit(1);

    if (existing) {
      await db
        .update(artisanProfiles)
        .set({
          businessName: (businessName as string) || null,
          bio: (bio as string) || null,
          location: (location as string) || null,
          phone: (phone as string) || null,
          whatsapp: (whatsapp as string) || null,
          website: (website as string) || null,
          instagram: (instagram as string) || null,
          facebook: (facebook as string) || null,
          coverImageUrl: (coverImageUrl as string) || null,
          updatedAt: new Date(),
        })
        .where(eq(artisanProfiles.userId, localUser.id));
    } else {
      await db.insert(artisanProfiles).values({
        userId: localUser.id,
        businessName: (businessName as string) || null,
        bio: (bio as string) || null,
        location: (location as string) || null,
        phone: (phone as string) || null,
        whatsapp: (whatsapp as string) || null,
        website: (website as string) || null,
        instagram: (instagram as string) || null,
        facebook: (facebook as string) || null,
        coverImageUrl: (coverImageUrl as string) || null,
        isVerified: false,
      });

      // Notify admin about new artisan registration
      await notifyNewArtisan(
        localUser.name || signUpName || "Unknown",
        localUser.email || signUpEmail,
        (businessName as string) || null,
        (location as string) || null
      );
    }

    // Update user role
    if (localUser.role === "customer") {
      await db
        .update(users)
        .set({ role: "artisan" })
        .where(eq(users.id, localUser.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
