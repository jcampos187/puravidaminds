import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, artisanProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [localUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!localUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
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
          businessName: businessName || null,
          bio: bio || null,
          location: location || null,
          phone: phone || null,
          whatsapp: whatsapp || null,
          website: website || null,
          instagram: instagram || null,
          facebook: facebook || null,
          coverImageUrl: coverImageUrl || null,
          updatedAt: new Date(),
        })
        .where(eq(artisanProfiles.userId, localUser.id));
    } else {
      await db.insert(artisanProfiles).values({
        userId: localUser.id,
        businessName: businessName || null,
        bio: bio || null,
        location: location || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        website: website || null,
        instagram: instagram || null,
        facebook: facebook || null,
        coverImageUrl: coverImageUrl || null,
      });
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
