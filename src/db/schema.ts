import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  integer,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", ["customer", "artisan", "admin"]);
export const productStatusEnum = pgEnum("product_status", ["active", "inactive", "sold", "pending"]);

// ─── Users ───────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").unique().notNull(),
  email: text("email").notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").default("customer").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Artisan Profiles ────────────────────────────────────────────
export const artisanProfiles = pgTable("artisan_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  businessName: text("business_name"),
  bio: text("bio"),
  location: text("location"), // e.g. "Sarchí, Alajuela"
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  website: text("website"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  coverImageUrl: text("cover_image_url"),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Categories ──────────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Products ────────────────────────────────────────────────────
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  artisanId: uuid("artisan_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: uuid("category_id")
    .references(() => categories.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: text("currency").default("CRC").notNull(),
  status: productStatusEnum("status").default("pending").notNull(),
  tags: text("tags"), // comma-separated
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Product Images ──────────────────────────────────────────────
export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Type exports ────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ArtisanProfile = typeof artisanProfiles.$inferSelect;
export type NewArtisanProfile = typeof artisanProfiles.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
