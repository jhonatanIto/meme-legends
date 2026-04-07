import { productCategoryEnum, products } from "@/app/db/schema";
import { db } from "./db";
import { and, eq } from "drizzle-orm";

type Category = (typeof productCategoryEnum.enumValues)[number];

export const getProduct = async (category?: Category) => {
  return await db
    .select()
    .from(products)
    .where(
      category
        ? and(eq(products.active, true), eq(products.category, category))
        : eq(products.active, true),
    );
};
