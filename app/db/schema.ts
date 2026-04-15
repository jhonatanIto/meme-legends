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
  id: serial("id").primaryKey(),
  email: text("email"),
  name: text("name"),
  total: integer("total"),
  stripeSessionId: text("stripe_session_id"),
  status: text("status"),
  created_at: timestamp("created_at").defaultNow(),
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

  size: text("size"),
  color: text("color"),

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
