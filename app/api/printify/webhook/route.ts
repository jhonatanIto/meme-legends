import { sendShippingEmail } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("WEBHOOK RECEBIDO", body);

  if (body.topic === "order:updated") {
    const order = body.data;

    const trackingNumber = order.shipments?.[0]?.tracking_number ?? null;

    const email = order.address_to?.email;

    if (trackingNumber) {
      await sendShippingEmail({
        email,
        orderId: Number(order.external_id),
        trackingNumber,
      });
    }
  }

  return new Response("OK");
}
