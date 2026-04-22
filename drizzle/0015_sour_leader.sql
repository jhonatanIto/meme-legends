CREATE TYPE "public"."product_type" AS ENUM('tshirts', 'sweatshirt', 'hoodie');--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "type" "product_type" DEFAULT 'tshirts' NOT NULL;