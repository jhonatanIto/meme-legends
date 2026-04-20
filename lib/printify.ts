import { CartItem } from "@/store/cart-store";
import Stripe from "stripe";
import { orderQueue } from "./queue";

interface Shipping {
  name?: string | null;
  email?: string | null;
  address?: Stripe.Address | null;
}

export const createPrintifyOrder = async ({
  items,
  shipping,
  orderId,
}: {
  items: CartItem[];
  shipping: Shipping;
  orderId: number;
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
        external_id: `order_${orderId}`,
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

  const printifyOrderId = data.id || data.data?.id;

  if (!printifyOrderId) {
    throw new Error("Printify order ID not returned");
  }

  await orderQueue.add("printify-track-order", {
    orderId,
    printifyOrderId,
    email: shipping?.email,
  });
  return { id: printifyOrderId, raw: data };
};
