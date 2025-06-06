CREATE TABLE "wallets" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"credits" integer DEFAULT 0,
	"bonus" integer DEFAULT 0,
	"total_deposited" integer DEFAULT 0,
	"total_withdrawn" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "wallet";