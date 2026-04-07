CREATE TABLE "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text,
	"name" text,
	"price" integer,
	"quantity" integer
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"name" text,
	"total" integer,
	"stripe_session_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;