ALTER TABLE "assessments" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ADD COLUMN "locked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ADD COLUMN "version" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ADD COLUMN "json" json NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "integer" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "assessments" DROP COLUMN "gender";