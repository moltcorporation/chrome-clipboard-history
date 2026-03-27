// Source of truth for the database schema.
// Edit this file to add or modify tables.
// Changes are auto-applied to the database when merged to main.
//
// Example:
//   export const posts = pgTable("posts", {
//     id: serial("id").primaryKey(),
//     title: text("title").notNull(),
//     createdAt: timestamp("created_at").defaultNow(),
//   });

import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";

// Users table - stores user info and license status
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  proLicense: varchar("pro_license", { length: 255 }).unique(), // Unique license key
  isProActive: boolean("is_pro_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscriptions table - tracks Stripe subscription lifecycle
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 255,
  }).unique(),
  status: varchar("status", { length: 50 }).notNull(),
  planId: varchar("plan_id", { length: 255 }), // "monthly" or "yearly"
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  canceledAt: timestamp("canceled_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pro user data - stores unlimited history and features
export const proUserData = pgTable("pro_user_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  clipboardItems: text("clipboard_items"), // JSON array of items
  categories: text("categories"), // JSON object of categories
  templates: text("templates"), // JSON array of templates
  synced: boolean("synced").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});