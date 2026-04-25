import {
  orderItems,
  orders,
  productCategoryEnum,
  tempOrders,
} from "@/app/db/schema";

import { db } from "@/lib/db";
import { orderQueue } from "@/lib/queue";
import { stripe } from "@/lib/stripe";
import { CartItem } from "@/store/cart-store";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import Stripe from "stripe";

type ProductCategory = (typeof productCategoryEnum.enumValues)[number];

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook Error", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("Missing orderId in metadata");
        return new Response("Invalid metadata", { status: 400 });
      }

      const [tempOrder] = await db
        .select()
        .from(tempOrders)
        .where(eq(tempOrders.id, orderId));

      if (!tempOrder) {
        console.error("Temp order not found:", orderId);
        return new Response("Order not found", { status: 404 });
      }

      let items: CartItem[];

      try {
        items = JSON.parse(tempOrder.items);
      } catch (error) {
        console.error("Invalid items JSON", error);
        return new Response("Invalid data", { status: 400 });
      }

      const customer = session.customer_details;

      let createdOrderId: number | null = null;

      await db.transaction(async (tx) => {
        const [orderCreated] = await tx
          .insert(orders)
          .values({
            email: session.customer_details?.email || "",
            name: session.customer_details?.name || "",
            total: session.amount_total || 0,
            stripeSessionId: session.id,
            status: "paid",
          })
          .returning();

        createdOrderId = orderCreated.id;

        if (!createdOrderId) {
          throw new Error("Order creation failed");
        }

        const products = items.map((i) => ({
          orderId: orderCreated.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          size: i.size,
          category: i.category as ProductCategory,
          type: i.type,
        }));

        await tx.insert(orderItems).values(products);

        await tx.delete(tempOrders).where(eq(tempOrders.id, orderId));
      });

      console.log("Order enqueued:", { orderId: createdOrderId });

      if (!createdOrderId) {
        return new Response("Order creation failed", { status: 500 });
      }

      await orderQueue.add(
        "create-order",
        {
          items,
          shipping: {
            name: customer?.name,
            email: customer?.email,
            address: customer?.address
              ? JSON.parse(JSON.stringify(customer.address))
              : null,
            phone: customer?.phone,
          },
          orderId: createdOrderId,
          email: customer?.email,
          name: customer?.name,
        },
        {
          attempts: 5,
          backoff: {
            type: "exponential",
            delay: 60000,
          },
        },
      );

      break;
    }
    default:
      console.log(`Event not treated: ${event.type}`);
  }

  return new Response("OK", { status: 200 });
}
