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
    // Delete local user — artisan_profiles, products, and product_images
    // are cascade-deleted by the DB schema:
    //   - artisanProfiles.userId → users.id (onDelete: cascade)
    //   - products.artisanId → users.id (onDelete: cascade)
    //   - productImages.productId → products.id (onDelete: cascade)
    //
    // The Clerk user is intentionally NOT deleted here so that the
    // client-side signOut() call can properly clear the session without
    // running into an inconsistent state. The sign-in page validates
    // against the local users table, so orphaned Clerk accounts cannot
    // sign in.
    await db.delete(users).where(eq(users.id, localUser.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again." },
      { status: 500 }
    );
  }
}
