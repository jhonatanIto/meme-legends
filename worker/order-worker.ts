import { Worker } from "bullmq";
import { connection } from "../lib/redis";
import { createPrintifyOrder, submit_order_to_printify } from "../lib/printify";
import { db } from "../lib/db";
import { orders } from "../app/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { orderQueue } from "@/lib/queue";

new Worker(
  "order-queue",
  async (job) => {
    if (job.name === "create-order") {
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

        await orderQueue.add(
          "submit-order",
          {
            orderId,
            printifyOrderId: printifyOrder.id,
          },
          {
            delay: 6000,
            attempts: 5,
            backoff: { type: "exponential", delay: 5000 },
          },
        );
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
    }
    if (job.name === "submit-order") {
      const { orderId, printifyOrderId } = job.data;

      const updated = await db
        .update(orders)
        .set({ status: "submitting" })
        .where(
          and(
            eq(orders.id, orderId),
            sql`${orders.status} IN ('printify_created', 'submitting')`,
          ),
        )
        .returning();

      if (!updated.length) {
        console.log("Submit already in progress or done");
        return;
      }

      try {
        await submit_order_to_printify(printifyOrderId);

        await db
          .update(orders)
          .set({ status: "in_production", lastError: null })
          .where(eq(orders.id, orderId));
      } catch (error) {
        const err = error as Error;

        if (err.message.includes("pending")) {
          if (job.attemptsMade >= job.opts.attempts!) {
            console.log("Max retries reached - manual review");

            await db
              .update(orders)
              .set({ status: "needs_manual_review", lastError: err.message })
              .where(eq(orders.id, orderId));

            return;
          }
          console.log("Order still pending, retrying...");
          throw error;
        }

        await db
          .update(orders)
          .set({ status: "needs_manual_review", lastError: err.message })
          .where(eq(orders.id, orderId));
      }
    }
  },
  {
    connection,
    concurrency: 5,
  },
);
