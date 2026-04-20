ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'payment_pending'::text;--> statement-breakpoint
DROP TYPE "public"."order_status";--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('payment_pending', 'paid', 'printify_created', 'in_production', 'shipped', 'delivered', 'failed');--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'payment_pending'::"public"."order_status";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE "public"."order_status" USING "status"::"public"."order_status";--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."product_category";--> statement-breakpoint
CREATE TYPE "public"."product_category" AS ENUM('movies', 'celebrities', 'cats', 'darkhumor');--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "category" SET DATA TYPE "public"."product_category" USING "category"::"public"."product_category";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category" SET DATA TYPE "public"."product_category" USING "category"::"public"."product_category";