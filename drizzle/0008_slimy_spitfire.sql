CREATE TABLE "tenant_payment_configs" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"min_deposit" integer DEFAULT 1,
	"min_withdraw" integer DEFAULT 1,
	"max_withdraw" integer DEFAULT 10000,
	"max_qty_withdraw" integer DEFAULT 0,
	"webhook_url" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_document_unique";--> statement-breakpoint
ALTER TABLE "tenants" DROP COLUMN "document";