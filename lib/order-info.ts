"use server";

import { orders } from "@/app/db/schema";
import { db } from "./db";
import { and, eq } from "drizzle-orm";

export const orderInfo = async (orderId: number, email: string) => {
  if (!orderId) return;
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.email, email)));

  if (!order)
    return {
      status: `Order #${orderId} not found, or incorrect email.`,
    };

  return order;
};
