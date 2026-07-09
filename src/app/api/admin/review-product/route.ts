import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, products } from "@/db/schema";
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
    const { productId, action } = await request.json();

    if (!productId || !["approve", "decline"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

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
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reviewing product:", error);
    return NextResponse.json({ error: "Failed to review product" }, { status: 500 });
  }
}
