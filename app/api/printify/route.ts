import { NextResponse } from "next/server";

export async function GET() {
  const url = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
