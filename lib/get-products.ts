import { productCategoryEnum, products } from "@/app/db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export type Product = {
  id: number;
  name: string;
  category: Category | null;
  price: number;
  currency: string;
  images: Product_Images[];
  size?: string | null;
  active: boolean;
  createdAt: Date;
  printifyProductId: string;
};

type Product_Images = {
  id: number;
  imageUrl: string;
  color: string;
  productId: number;
};

export type Category = (typeof productCategoryEnum.enumValues)[number];

const getProductsList = unstable_cache(
  async () => {
    return await db.query.products.findMany({
      where: eq(products.active, true),
      with: {
        images: true,
      },
    });
  },
  ["products"],
  { revalidate: 7200 },
);

export const getProduct = async (category?: Category) => {
  const productsList = await getProductsList();

  if (!category) return productsList;

  return productsList.filter((p) => p.category === category);
};
