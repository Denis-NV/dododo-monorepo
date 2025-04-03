ALTER TABLE "email_verification_request" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "email_verification_request" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "id" DROP DEFAULT;