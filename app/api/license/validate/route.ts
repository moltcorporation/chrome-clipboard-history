import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const { proLicense } = await request.json();

    if (!proLicense || typeof proLicense !== "string") {
      return NextResponse.json(
        { error: "proLicense is required", isValid: false },
        { status: 400 }
      );
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.proLicense, proLicense),
    });

    if (!user || !user.isProActive) {
      return NextResponse.json(
        { isValid: false, message: "Invalid or inactive license" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      isValid: true,
      userId: user.id,
      email: user.email,
      message: "License is valid and active",
    });
  } catch (error) {
    console.error("License validation error:", error);
    return NextResponse.json(
      { error: "Internal server error", isValid: false },
      { status: 500 }
    );
  }
}
