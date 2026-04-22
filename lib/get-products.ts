import {
  productCategoryEnum,
  products,
  productTypeEnum,
} from "@/app/db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export type Product = {
  id: number;
  name: string;
  category: Category | null;
  type: productType;
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
export type productType = (typeof productTypeEnum.enumValues)[number];

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

export const getProducts = async (type?: productType, category?: Category) => {
  const productsList = await getProductsList();

  if (!type) return productsList;

  const products = productsList.filter((p) => p.type === type);

  if (!category) return products;

  return products.filter((p) => p.category === category);
};
