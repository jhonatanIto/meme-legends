import { products } from "@/app/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const getProducts = await db
      .select()
      .from(products)
      .where(eq(products.active, true));

    return Response.json({ products: getProducts }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
