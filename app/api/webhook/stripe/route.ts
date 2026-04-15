import {
  orderItems,
  orders,
  productCategoryEnum,
  tempOrders,
} from "@/app/db/schema";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { CartItem } from "@/store/cart-store";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import Stripe from "stripe";

interface Shipping {
  name?: string | null;
  email?: string | null;
  address?: Stripe.Address | null;
}

type ProductCategory = (typeof productCategoryEnum.enumValues)[number];

const createPrintifyOrder = async ({
  items,
  shipping,
}: {
  items: CartItem[];
  shipping: Shipping;
}) => {
  const nameParts = shipping?.name?.split(" ") || [];

  const res = await fetch(
    `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        line_items: items.map((item) => {
          if (!item.variantId) {
            throw new Error(`Missing variantId for product ${item.id}`);
          }

          return {
            product_id: item.printifyProductId,
            variant_id: item.variantId,
            quantity: item.quantity,
          };
        }),
        shipping_method: 1,
        send_shipping_notification: true,
        address_to: {
          first_name: nameParts[0] || "",
          last_name: nameParts.slice(1).join(" ") || "",
          email: shipping?.email || "",
          country: shipping?.address?.country || "",
          region: shipping?.address?.state || "",
          city: shipping?.address?.city || "",
          address1: shipping.address?.line1 || "",
          postal_code: shipping?.address?.postal_code || "",
        },
      }),
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Printify error:", errorText);
    throw new Error("Failed to create Printify order");
  }

  const data = await res.json();
  console.log("Printify order created:", data);
};

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

      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("Missing orderId in metadata");
        return new Response("Invalid metadata", { status: 400 });
      }

      const existingOrder = await db.query.orders.findFirst({
        where: (orders, { eq }) => eq(orders.stripeSessionId, session.id),
      });

      if (existingOrder) {
        return new Response("Already processed", { status: 200 });
      }

      const [temOrder] = await db
        .select()
        .from(tempOrders)
        .where(eq(tempOrders.id, orderId));

      if (!temOrder) {
        console.error("Temp order not found:", orderId);
        return new Response("Order not found", { status: 404 });
      }

      let items: CartItem[];

      try {
        items = JSON.parse(temOrder.items);
      } catch (error) {
        console.error("Invalid items JSON", error);
        return new Response("Invalid data", { status: 400 });
      }

      const customer = session.customer_details;

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          expand: ["data.price.product"],
        },
      );

      let createdOrderId: number | null = null;

      await db.transaction(async (tx) => {
        const [orderCreated] = await tx
          .insert(orders)
          .values({
            email: session.customer_details?.email || "",
            name: session.customer_details?.name || "",
            total: session.amount_total || 0,
            stripeSessionId: session.id,
            status: "pending",
          })
          .returning();

        createdOrderId = orderCreated.id;

        const products = items.map((i) => ({
          orderId: orderCreated.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          size: i.size,
          category: i.category as ProductCategory,
        }));

        await tx.insert(orderItems).values(products);

        await tx.delete(tempOrders).where(eq(tempOrders.id, orderId));
      });

      try {
        await createPrintifyOrder({
          items,
          shipping: {
            name: customer?.name,
            email: customer?.email,
            address: customer?.address,
          },
        });

        await db
          .update(orders)
          .set({ status: "completed" })
          .where(eq(orders.id, createdOrderId!));
      } catch (error) {
        console.error("CRITICAL: Printify order failed", error);

        await db
          .update(orders)
          .set({ status: "failed" })
          .where(eq(orders.id, createdOrderId!));
      }

      console.log("Order processed:", createdOrderId);

      break;
    }
    default:
      console.log(`Event not treated: ${event.type}`);
  }

  return new Response("OK", { status: 200 });
}
