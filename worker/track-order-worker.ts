import { Worker } from "bullmq";
import { connection } from "../lib/redis";
import { db } from "../lib/db";
import { orders } from "../app/db/schema";
import { eq } from "drizzle-orm";
import { sendShippingEmail } from "../lib/email";

new Worker(
  "printify-track-order",
  async (job) => {
    const { printifyOrderId, email, orderId } = job.data;

    const res = await fetch(
      `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders/${printifyOrderId}.json`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch Printify order");

    const data = await res.json();

    const status = data.status;
    const tracking = data.shipments?.[0]?.tracking_number;

    if (status !== "shipped" && status !== "fulfilled") {
      throw new Error("Order not shipped yet");
    }

    await db
      .update(orders)
      .set({ status: "shipped" })
      .where(eq(orders.id, orderId));

    await sendShippingEmail({
      email,
      orderId,
      trackingNumber: tracking,
    });
  },
  {
    connection,
  },
);
