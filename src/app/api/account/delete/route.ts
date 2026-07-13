import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
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
    // 1. Delete local user — artisan_profiles, products, and product_images
    //    are cascade-deleted by the DB schema:
    //    - artisanProfiles.userId → users.id (onDelete: cascade)
    //    - products.artisanId → users.id (onDelete: cascade)
    //    - productImages.productId → products.id (onDelete: cascade)
    await db.delete(users).where(eq(users.id, localUser.id));

    // 2. Delete the Clerk user via the Backend API so they can't sign in again
    if (process.env.CLERK_SECRET_KEY) {
      const res = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error(
          `Clerk API returned ${res.status} when deleting user ${clerkId}:`,
          body
        );
        // Non-fatal — the local user is already deleted
      }
    } else {
      console.warn(
        "CLERK_SECRET_KEY not configured — Clerk user not deleted."
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again." },
      { status: 500 }
    );
  }
}
