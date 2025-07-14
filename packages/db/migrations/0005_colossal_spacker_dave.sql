CREATE TYPE "public"."role" AS ENUM('user', 'manager', 'admin');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" DEFAULT 'user' NOT NULL;