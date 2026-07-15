CREATE TABLE "click_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" text NOT NULL,
	"target" text NOT NULL,
	"page_url" text,
	"artisan_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "click_events" ADD CONSTRAINT "click_events_artisan_id_users_id_fk" FOREIGN KEY ("artisan_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;