import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users, subscriptions, proUserData } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

async function generateProLicense(): Promise<string> {
  return crypto.randomBytes(16).toString("hex");
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") || "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );

        const user = await db.query.users.findFirst({
          where: (users, { eq }) =>
            eq(users.stripeCustomerId, customer.id as string),
        });

        if (!user) {
          console.error("User not found for customer:", customer.id);
          break;
        }

        // Get the plan type from the price
        const planId = subscription.items.data[0]?.price?.id;
        const status = subscription.status;

        // Check if subscription record exists
        const existingSub = await db.query.subscriptions.findFirst({
          where: (subscriptions, { eq }) =>
            eq(subscriptions.stripeSubscriptionId, subscription.id),
        });

        if (existingSub) {
          // Update subscription
          await db
            .update(subscriptions)
            .set({
              status,
              planId,
              currentPeriodStart: new Date(
                subscription.current_period_start * 1000
              ),
              currentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, existingSub.id));
        } else {
          // Create subscription
          const proLicense = await generateProLicense();

          // Create subscription record
          await db.insert(subscriptions).values({
            userId: user.id,
            stripeSubscriptionId: subscription.id,
            status,
            planId,
            currentPeriodStart: new Date(
              subscription.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          });

          // Update user with pro license and set isProActive
          await db
            .update(users)
            .set({
              proLicense,
              isProActive: status === "active",
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));

          // Create pro user data record
          await db.insert(proUserData).values({
            userId: user.id,
            clipboardItems: JSON.stringify([]),
            categories: JSON.stringify({}),
            templates: JSON.stringify([]),
          });
        }

        // Update user pro status based on subscription status
        if (status === "active") {
          await db
            .update(users)
            .set({ isProActive: true, updatedAt: new Date() })
            .where(eq(users.id, user.id));
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        const existingSub = await db.query.subscriptions.findFirst({
          where: (subscriptions, { eq }) =>
            eq(subscriptions.stripeSubscriptionId, subscription.id),
        });

        if (existingSub) {
          await db
            .update(subscriptions)
            .set({
              status: "canceled",
              canceledAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, existingSub.id));

          await db
            .update(users)
            .set({ isProActive: false, updatedAt: new Date() })
            .where(eq(users.id, existingSub.userId));
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const existingSub = await db.query.subscriptions.findFirst({
            where: (subscriptions, { eq }) =>
              eq(subscriptions.stripeSubscriptionId, invoice.subscription as string),
          });

          if (existingSub) {
            await db
              .update(subscriptions)
              .set({
                status: "past_due",
                updatedAt: new Date(),
              })
              .where(eq(subscriptions.id, existingSub.id));

            await db
              .update(users)
              .set({ isProActive: false, updatedAt: new Date() })
              .where(eq(users.id, existingSub.userId));
          }
        }
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
