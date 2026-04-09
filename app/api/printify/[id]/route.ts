import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const SHOP_ID = process.env.PRINTIFY_SHOP_ID!;
  const API_TOKEN = process.env.PRINTIFY_API_TOKEN!;
  console.log("PARAM ID:", id);

  try {
    const res = await fetch(
      `https://api.printify.com/v1/shops/${SHOP_ID}/products/${id}.json`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      },
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
