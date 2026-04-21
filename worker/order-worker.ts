import { Worker } from "bullmq";
import { connection } from "@/lib/redis";
import { createPrintifyOrder } from "@/lib/printify";
import { db } from "@/lib/db";
import { orders } from "@/app/db/schema";
import { eq, sql } from "drizzle-orm";

new Worker(
  "order-queue",
  async (job) => {
    const { items, shipping, orderId } = job.data;

    await db
      .update(orders)
      .set({
        status: "printify_created",
        attempts: sql`${orders.attempts} + 1`,
      })
      .where(eq(orders.id, orderId));

    try {
      const printifyOrder = await createPrintifyOrder({
        items,
        shipping,
        orderId,
      });

      await db
        .update(orders)
        .set({
          status: "in_production",
          printifyOrderId: printifyOrder?.id,
          lastError: null,
        })
        .where(eq(orders.id, orderId));
    } catch (error) {
      const err = error as Error;

      await db
        .update(orders)
        .set({
          status: "failed",
          lastError: err.message || "unknown error",
        })
        .where(eq(orders.id, orderId));

      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
  },
);
