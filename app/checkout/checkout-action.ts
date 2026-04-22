"use server";

import { db } from "@/lib/db";
import { getProducts } from "@/lib/get-products";
import { stripe } from "@/lib/stripe";
import { CartItem } from "@/store/cart-store";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { tempOrders } from "../db/schema";
import { headers } from "next/headers";

export const checkoutAction = async (formData: FormData): Promise<void> => {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");

  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : headersList.get("x-real-ip") || "unknown";

  const itemsJson = formData.get("items") as string;
  const items = JSON.parse(itemsJson);

  const dbProducts = await getProducts();

  const line_items = items.map((item: CartItem) => {
    const product = dbProducts.find(
      (p) =>
        p.id === item.id &&
        p.printifyProductId === item.printifyProductId &&
        p.name === item.name,
    );

    if (!product) {
      throw new Error(`Product not found: ${item.id}`);
    }

    return {
      price_data: {
        currency: "usd",
        product_data: { name: item.name, images: [item.imageUrl] },
        unit_amount: product?.price,
      },
      quantity: item.quantity,
    };
  });

  const orderId = randomUUID();

  await db
    .insert(tempOrders)
    .values({ id: orderId, items: JSON.stringify(items) });

  let country = "US";
  let shippingAmount = 500;

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    country = data.country_code;

    shippingAmount = country === "US" ? 500 : 700;
  } catch (error) {
    console.error(error);
    shippingAmount = 500;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",

    metadata: {
      orderId,
    },

    shipping_address_collection: {
      allowed_countries: [
        "US",
        "CA",
        "GB",
        "AU",
        "JP",
        "BR",
        "DE",
        "FR",
        "ES",
        "NL",
        "SE",
        "IT",
      ],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: shippingAmount,
            currency: "usd",
          },
          display_name: "Standard Shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 5 },
            maximum: { unit: "business_day", value: 30 },
          },
        },
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });

  redirect(session.url!);
};
