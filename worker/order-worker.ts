import { Worker } from "bullmq";
import { connection } from "../lib/redis";
import { createPrintifyOrder, submit_order_to_printify } from "../lib/printify";
import { db } from "../lib/db";
import { orders } from "../app/db/schema";
import { and, eq, sql } from "drizzle-orm";

new Worker(
  "order-queue",
  async (job) => {
    if (job.name !== "create-order") return;
    console.log("Worker started");

    const { items, shipping, orderId } = job.data;
    console.log("JOB RECEBIDO", job.name, job.data);

    const updated = await db
      .update(orders)
      .set({ status: "processing" })
      .where(and(eq(orders.id, orderId), eq(orders.status, "paid")))
      .returning();

    if (!updated.length) {
      console.log("Order already locked by another worker");
      return;
    }

    try {
      const printifyOrder = await createPrintifyOrder({
        items,
        shipping,
        orderId,
      });

      await db
        .update(orders)
        .set({
          status: "printify_created",
          attempts: sql`${orders.attempts} + 1`,
          printifyOrderId: printifyOrder.id,
        })
        .where(eq(orders.id, orderId));

      console.log("Order created:", printifyOrder.id);

      try {
        await submit_order_to_printify(printifyOrder.id);

        await db
          .update(orders)
          .set({
            status: "in_production",
            lastError: null,
          })
          .where(eq(orders.id, orderId));

        console.log("Order sent to production", printifyOrder.id);
      } catch (error) {
        const err = error as Error;

        await db
          .update(orders)
          .set({
            status: "needs_manual_review",
            printifyOrderId: printifyOrder.id,
            lastError: err.message,
          })
          .where(eq(orders.id, orderId));
      }
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
