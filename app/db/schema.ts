import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

export const orderStatusEnum = pgEnum("order_status", [
  "payment_pending",
  "paid",
  "printify_created",
  "in_production",
  "shipped",
  "delivered",
  "failed",
]);

export const productCategoryEnum = pgEnum("product_category", [
  "movies",
  "celebrities",
  "cats",
  "animation",
  "darkhumor",
]);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),

  email: text("email").notNull(),
  name: text("name").notNull(),

  total: integer("total").notNull(),

  stripeSessionId: text("stripe_session_id").unique(),

  status: orderStatusEnum("status").default("payment_pending").notNull(),

  printifyOrderId: text(),

  attempts: integer().default(0).notNull(),

  lastError: text(),

  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id, {
    onDelete: "cascade",
  }),
  name: text("name"),
  price: integer("price"),
  quantity: integer("quantity"),
  size: text("size"),
  category: productCategoryEnum("category"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),
  category: productCategoryEnum("category"),

  price: integer("price").notNull(),
  currency: text("currency").default("usd").notNull(),

  printifyProductId: text("printify_product_id").notNull(),

  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productImages = pgTable(
  "product_images",
  {
    id: serial("id").primaryKey(),
    imageUrl: text("image_url").notNull(),
    color: text("color").notNull(),
    productId: integer("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [index("product_images_product_id_idx").on(table.productId)],
);

export const tempOrders = pgTable("tempOrders", {
  id: text("id").primaryKey().notNull(),
  items: text("items").notNull(),
});

export const productsRelations = relations(products, ({ many }) => ({
  images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
