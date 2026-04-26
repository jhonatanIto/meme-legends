import { type NextRequest, NextResponse } from "next/server";

const ALLOWED_COUNTRIES = [
  "US",
  "CA",
  "GB",
  "AU",
  "JP",
  "BR",
  "DE",
  "FR",
  "ES",
  "IT",
  "NL",
  "SE",
  "DK",
  "FI",
  "BE",
  "AT",
  "IE",
  "PT",
];

export function proxy(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country");

  if (!country) {
    return NextResponse.next();
  }

  if (!ALLOWED_COUNTRIES.includes(country)) {
    return new NextResponse("Not available in your region", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
