CREATE TABLE "audits" (
	"id" text PRIMARY KEY NOT NULL,
	"action" text NOT NULL,
	"description" text NOT NULL,
	"responsible" text NOT NULL,
	"affected" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "wallets" ALTER COLUMN "credits" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ALTER COLUMN "bonus" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ALTER COLUMN "total_deposited" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ALTER COLUMN "qty_deposits" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ALTER COLUMN "total_withdrawn" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ALTER COLUMN "qty_withdraws" SET NOT NULL;