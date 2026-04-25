import { orders } from "@/app/db/schema";
import { db } from "@/lib/db";
import { createPrintifyOrder, submit_order_to_printify } from "@/lib/printify";
import { emailQueue, orderQueue } from "@/lib/queue";
import { Job } from "bullmq";
import { and, eq, sql } from "drizzle-orm";

export const createOrder = async (job: Job) => {
  const { items, shipping, orderId, email, name } = job.data;

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

    await emailQueue.add(
      "send-order-confirmation-email",
      {
        email,
        name,
        orderId,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 30000,
        },
      },
    );

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
};

export const submitOrder = async (job: Job) => {
  const { orderId, printifyOrderId } = job.data;
  const maxAttempts = job.opts.attempts ?? 5;

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

  if (!updated.length) return;

  try {
    await submit_order_to_printify(printifyOrderId);

    await db
      .update(orders)
      .set({ status: "in_production", lastError: null })
      .where(eq(orders.id, orderId));
  } catch (error) {
    const err = error as Error;

    if (err.message.includes("pending") && job.attemptsMade < maxAttempts - 1) {
      throw error;
    }

    await db
      .update(orders)
      .set({ status: "needs_manual_review", lastError: err.message })
      .where(eq(orders.id, orderId));

    throw new Error(`Manual review needed: ${err.message}`);
  }
};
