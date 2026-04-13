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

export const productCategoryEnum = pgEnum("product_category", [
  "tshirt",
  "mug",
  "hoodie",
  "phonecase",
  "notebook",
  "mousepad",
  "pillow",
  "underwear",
]);

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  email: text("email"),
  name: text("name"),
  total: integer("total"),
  stripeSessionId: text("stripe_session_id"),
  created_at: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").references(() => orders.id, {
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
  description: text("description").notNull(),
  category: productCategoryEnum("category").notNull(),

  price: integer("price").notNull(),
  currency: text("currency").default("usd"),

  printifyProductId: text("printify_product_id").notNull(),

  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
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
