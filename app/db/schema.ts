import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

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
  orderId: text("order_id").references(() => orders.id),
  name: text("name"),
  price: integer("price"),
  quantity: integer("quantity"),
});

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

export const products = pgTable("products", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),
  description: text("description").notNull(),
  category: productCategoryEnum("category").notNull(),

  price: integer("price").notNull(),
  currency: text("currency").default("usd"),

  imageUrl: text("image_url").notNull(),

  printifyProductId: text("printify_product_id").notNull(),

  active: boolean("active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
});
