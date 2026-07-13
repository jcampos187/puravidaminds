import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { error: "Email parameter is required" },
      { status: 400 }
    );
  }

  try {
    const [existing] = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    return NextResponse.json({ exists: !!existing });
  } catch (error) {
    console.error("Error checking artisan:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
