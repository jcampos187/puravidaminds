import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { products, productImages, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
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
    const { title, description, price, currency, categoryId, tags, imageUrls } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Create the slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const [product] = await db
      .insert(products)
      .values({
        artisanId: localUser.id,
        title,
        slug,
        description,
        price: price || null,
        currency: currency || "CRC",
        categoryId: categoryId || null,
        tags: tags || null,
        status: "pending",
      })
      .returning();

    // Insert images
    if (imageUrls && imageUrls.length > 0) {
      await db.insert(productImages).values(
        imageUrls.map((img: { url: string; altText: string | null }, i: number) => ({
          productId: product.id,
          url: img.url,
          altText: img.altText || null,
          displayOrder: i,
        }))
      );
    }

    // Update user role to artisan if not already
    if (localUser.role === "customer") {
      await db
        .update(users)
        .set({ role: "artisan" })
        .where(eq(users.id, localUser.id));
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
