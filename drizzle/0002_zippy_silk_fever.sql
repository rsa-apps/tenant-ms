CREATE TABLE "affiliate_info" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"manager_commission" integer DEFAULT 0 NOT NULL,
	"commision" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_config" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'punter' NOT NULL,
	"status" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text,
	"document" text,
	"wallet" integer DEFAULT 0 NOT NULL,
	"birth_date" timestamp,
	"affiliate_id" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
