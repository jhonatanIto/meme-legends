import { productCategoryEnum, products } from "@/app/db/schema";
import { db } from "./db";
import { eq, InferSelectModel } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export type Product = InferSelectModel<typeof products>;

type Category = (typeof productCategoryEnum.enumValues)[number];

const getProductsList = unstable_cache(
  async () => {
    console.log("dabase hit");
    return await db.select().from(products).where(eq(products.active, true));
  },
  ["products"],
  { revalidate: 3600 },
);

export const getProduct = async (category?: Category) => {
  const productsList = await getProductsList();

  if (!category) return productsList;

  return productsList.filter((p) => p.category === category);
};
