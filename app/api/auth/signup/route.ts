import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existing) {
      return NextResponse.json(
        { userId: existing.id, proLicense: existing.proLicense },
        { status: 200 }
      );
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      metadata: { type: "clipboard_history" },
    });

    // Generate a unique pro license key (will be assigned only after purchase)
    const proLicense = null;

    // Create user
    await db.insert(users).values({
      email,
      stripeCustomerId: customer.id,
      proLicense,
      isProActive: false,
    });

    // Fetch the created user to get the ID
    const newUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    return NextResponse.json(
      { userId: newUser?.id, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
