import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, artisanProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(request: Request) {
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
    } else {
      // Decline — set role back to customer, deactivate
      await db
        .update(users)
        .set({ role: "customer", isActive: false })
        .where(eq(users.id, artisanUserId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reviewing artisan:", error);
    return NextResponse.json({ error: "Failed to review artisan" }, { status: 500 });
  }
}
