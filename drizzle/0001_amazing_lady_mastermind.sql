ALTER TABLE "tenant_configs" ADD COLUMN "sportbook_status" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tenant_configs" ADD COLUMN "casino_status" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "tenant_configs" ADD COLUMN "lotteries_status" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tenant_configs" ADD COLUMN "default_page" text DEFAULT '/casino' NOT NULL;