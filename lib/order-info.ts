"use server";

import { orders } from "@/app/db/schema";
import { db } from "./db";
import { and, eq } from "drizzle-orm";
import { OrderStatus } from "@/components/order-placed";

export const orderInfo = async (
  orderId: number,
  email: string,
): Promise<OrderStatus | null> => {
  if (!orderId) return null;

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.email, email)));

  if (!order) return null;

  return order.status;
};
