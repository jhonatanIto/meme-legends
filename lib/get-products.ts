import { productCategoryEnum, products } from "@/app/db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export type Product = {
  id: number;
  name: string;
  description: string;
  category: Category;
  price: number;
  currency: string;
  images: Product_Images[];
  size?: string;
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

type Category = (typeof productCategoryEnum.enumValues)[number];

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
  { revalidate: 1 },
);

export const getProduct = async (category?: Category) => {
  const productsList = await getProductsList();

  if (!category) return productsList;

  return productsList.filter((p) => p.category === category);
};
