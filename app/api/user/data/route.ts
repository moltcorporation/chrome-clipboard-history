import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { proUserData, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const proLicense = request.nextUrl.searchParams.get("proLicense");

    if (!proLicense) {
      return NextResponse.json(
        { error: "proLicense is required" },
        { status: 400 }
      );
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.proLicense, proLicense),
    });

    if (!user || !user.isProActive) {
      return NextResponse.json(
        { error: "Invalid or inactive license" },
        { status: 403 }
      );
    }

    const data = await db.query.proUserData.findFirst({
      where: (proUserData, { eq }) => eq(proUserData.userId, user.id),
    });

    if (!data) {
      return NextResponse.json(
        { clipboardItems: [], categories: {}, templates: [] },
        { status: 200 }
      );
    }

    return NextResponse.json({
      clipboardItems: data.clipboardItems ? JSON.parse(data.clipboardItems) : [],
      categories: data.categories ? JSON.parse(data.categories) : {},
      templates: data.templates ? JSON.parse(data.templates) : [],
      synced: data.synced,
    });
  } catch (error) {
    console.error("Get user data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { proLicense, clipboardItems, categories, templates } =
      await request.json();

    if (!proLicense) {
      return NextResponse.json(
        { error: "proLicense is required" },
        { status: 400 }
      );
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.proLicense, proLicense),
    });

    if (!user || !user.isProActive) {
      return NextResponse.json(
        { error: "Invalid or inactive license" },
        { status: 403 }
      );
    }

    const existingData = await db.query.proUserData.findFirst({
      where: (proUserData, { eq }) => eq(proUserData.userId, user.id),
    });

    if (existingData) {
      await db
        .update(proUserData)
        .set({
          clipboardItems: JSON.stringify(clipboardItems || []),
          categories: JSON.stringify(categories || {}),
          templates: JSON.stringify(templates || []),
          synced: true,
          updatedAt: new Date(),
        })
        .where(eq(proUserData.userId, user.id));
    } else {
      await db.insert(proUserData).values({
        userId: user.id,
        clipboardItems: JSON.stringify(clipboardItems || []),
        categories: JSON.stringify(categories || {}),
        templates: JSON.stringify(templates || []),
        synced: true,
      });
    }

    return NextResponse.json({ success: true, message: "Data synced" });
  } catch (error) {
    console.error("Sync user data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
