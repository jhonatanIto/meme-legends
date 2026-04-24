import { CartItem } from "@/store/cart-store";
import Stripe from "stripe";
import { orderQueue } from "./queue";

interface Shipping {
  name?: string | null;
  email?: string | null;
  address?: Stripe.Address | null;
  phone?: string | null;
}

const JP_STATE_MAP: Record<string, string> = {
  北海道: "Hokkaido",
  青森県: "Aomori",
  岩手県: "Iwate",
  宮城県: "Miyagi",
  秋田県: "Akita",
  山形県: "Yamagata",
  福島県: "Fukushima",

  茨城県: "Ibaraki",
  栃木県: "Tochigi",
  群馬県: "Gunma",
  埼玉県: "Saitama",
  千葉県: "Chiba",
  東京都: "Tokyo",
  神奈川県: "Kanagawa",

  新潟県: "Niigata",
  富山県: "Toyama",
  石川県: "Ishikawa",
  福井県: "Fukui",
  山梨県: "Yamanashi",
  長野県: "Nagano",

  岐阜県: "Gifu",
  静岡県: "Shizuoka",
  愛知県: "Aichi",
  三重県: "Mie",

  滋賀県: "Shiga",
  京都府: "Kyoto",
  大阪府: "Osaka",
  兵庫県: "Hyogo",
  奈良県: "Nara",
  和歌山県: "Wakayama",

  鳥取県: "Tottori",
  島根県: "Shimane",
  岡山県: "Okayama",
  広島県: "Hiroshima",
  山口県: "Yamaguchi",

  徳島県: "Tokushima",
  香川県: "Kagawa",
  愛媛県: "Ehime",
  高知県: "Kochi",

  福岡県: "Fukuoka",
  佐賀県: "Saga",
  長崎県: "Nagasaki",
  熊本県: "Kumamoto",
  大分県: "Oita",
  宮崎県: "Miyazaki",
  鹿児島県: "Kagoshima",
  沖縄県: "Okinawa",
};

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
          first_name: nameParts[0] || "Customer",
          last_name: nameParts.slice(1).join(" ") || "-",
          email: shipping?.email || "",
          country: shipping?.address?.country || "",
          region:
            shipping?.address?.country === "JP"
              ? JP_STATE_MAP[shipping?.address?.state || ""] || ""
              : shipping?.address?.state || "",
          city: shipping?.address?.city || "",
          address1: shipping?.address?.line1 || "",
          address2: shipping?.address?.line2 || "",
          zip:
            shipping?.address?.postal_code?.replace(
              /^(\d{3})(\d{4})$/,
              "$1-$2",
            ) || "",
          phone: shipping?.phone || "",
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
