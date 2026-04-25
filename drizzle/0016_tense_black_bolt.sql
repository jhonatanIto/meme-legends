ALTER TYPE "public"."order_status" ADD VALUE 'processing' BEFORE 'printify_created';--> statement-breakpoint
ALTER TYPE "public"."order_status" ADD VALUE 'needs_manual_review';