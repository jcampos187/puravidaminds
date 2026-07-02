import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { products, productImages, users } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
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

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!product || product.artisanId !== localUser.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { title, description, price, currency, categoryId, tags, status, imageUrls } = body;

    const slug = title
      ? title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      : product.slug;

    const [updated] = await db
      .update(products)
      .set({
        title: title || product.title,
        slug,
        description: description || product.description,
        price: price !== undefined ? price : product.price,
        currency: currency || product.currency,
        categoryId: categoryId !== undefined ? categoryId : product.categoryId,
        tags: tags !== undefined ? tags : product.tags,
        status: status || product.status,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    // Update images if provided
    if (imageUrls && Array.isArray(imageUrls)) {
      await db.delete(productImages).where(eq(productImages.productId, id));
      if (imageUrls.length > 0) {
        await db.insert(productImages).values(
          imageUrls.map((img: { url: string; altText: string | null }, i: number) => ({
            productId: id,
            url: img.url,
            altText: img.altText || null,
            displayOrder: i,
          }))
        );
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
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
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!product || product.artisanId !== localUser.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(products).where(eq(products.id, id));
  return NextResponse.json({ success: true });
}
