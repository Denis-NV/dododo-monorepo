import {
  integer,
  pgTable,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "@/utils/columns.helpers";

export const userTable = pgTable("user", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  email: text().unique().notNull(),
  username: text().notNull(),
  passwordHash: text().notNull(),
  recoveryCode: text().notNull(),
  emailVerified: boolean().notNull().default(false),
  ...timestamps,
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  ...timestamps,
});

export const AssessmentTable = pgTable("assessments", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  description: text(),
  ...timestamps,
});

// Validation

export const insertUserTableSchema = createInsertSchema(userTable);
export const insertSessionTableSchema = createInsertSchema(sessionTable);
export const insertAssessmentTableSchema = createInsertSchema(AssessmentTable);

// Types

export type TUser = z.infer<typeof insertUserTableSchema>;
export type TSession = z.infer<typeof insertSessionTableSchema>;
export type TAssessment = z.infer<typeof insertAssessmentTableSchema>;
