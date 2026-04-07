CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"price" integer,
	"currency" text DEFAULT 'usd',
	"image_url" text,
	"printify_product_id" text,
	"printify_variant_id" integer,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
