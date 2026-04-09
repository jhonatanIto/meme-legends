import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["files.stripe.com", "images-api.printify.com"],
  },
};

export default nextConfig;
