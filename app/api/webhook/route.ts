import { orderItems, orders } from "@/app/db/schema";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

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

      const existingOrder = await db.query.orders.findFirst({
        where: (orders, { eq }) => eq(orders.stripeSessionId, session.id),
      });

      if (existingOrder) {
        console.log("Order alread exists");
        return new Response("OK", { status: 200 });
      }

      const orderId = randomUUID();

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          expand: ["data.price.product"],
        },
      );

      await db.transaction(async (tx) => {
        await tx.insert(orders).values({
          id: orderId,
          email: session.customer_details?.email || "",
          name: session.customer_details?.name || "",
          total: session.amount_total || 0,
          stripeSessionId: session.id,
        });

        const items = lineItems.data.map((item) => {
          const product = item.price?.product as Stripe.Product;

          return {
            id: randomUUID(),
            orderId,
            name: product?.name || "Product",
            price: item.price?.unit_amount || 0,
            quantity: item.quantity || 1,
          };
        });

        await tx.insert(orderItems).values(items);
      });

      console.log("Order saved:", orderId);

      break;
    }
    default:
      console.log(`Event not treated: ${event.type}`);
  }

  return new Response("OK", { status: 200 });
}
