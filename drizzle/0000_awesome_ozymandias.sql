CREATE TABLE "tenants" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"domain" text NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"default_url" text DEFAULT '/app/lotteries' NOT NULL,
	"webhook_url" text,
	"products" text[],
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "tenants_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "theme" (
	"id" text PRIMARY KEY NOT NULL,
	"logo" text DEFAULT 'https://rsa.bet/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frsa-logo.f7e387d5.png&w=256&q=75',
	"favicon" text DEFAULT 'https://rsa.bet/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frsa-logo.f7e387d5.png&w=256&q=75',
	"primary_color" text DEFAULT '#000000',
	"secondary_color" text DEFAULT '#FFFFFF',
	"background_color" text DEFAULT '#F0F0F0',
	"tenant_id" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "affiliate_info" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"manager_commission" integer DEFAULT 0 NOT NULL,
	"commision" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_token" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"username" text,
	"phone_number" text,
	"vat_code" text,
	"status" boolean DEFAULT true NOT NULL,
	"role" text[] DEFAULT '{"PUNTER"}',
	"password" text NOT NULL,
	"birth_date" timestamp NOT NULL,
	"invited_by" text,
	"affiliation_id" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"credits" integer DEFAULT 0 NOT NULL,
	"bonus" integer DEFAULT 0 NOT NULL,
	"total_deposited" integer DEFAULT 0 NOT NULL,
	"qty_deposits" integer DEFAULT 0 NOT NULL,
	"total_withdrawn" integer DEFAULT 0 NOT NULL,
	"qty_withdraws" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
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
