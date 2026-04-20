CREATE TYPE "public"."order_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "total" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."order_status";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE "public"."order_status" USING "status"::"public"."order_status";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "printifyOrderId" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "lastError" text;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_stripe_session_id_unique" UNIQUE("stripe_session_id");