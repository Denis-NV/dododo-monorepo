import {
  integer,
  pgTable,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { timestamps } from "./columns";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const userTable = pgTable("user", {
  ...timestamps,
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  email: text().unique().notNull(),
  username: text().notNull(),
  passwordHash: text().notNull(),
  recoveryCode: text().notNull(),
  emailVerified: boolean().notNull().default(false),
});

export const sessionTable = pgTable("session", {
  ...timestamps,
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const AssessmentTable = pgTable("assessments", {
  ...timestamps,
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  description: text(),
  gender: text(),
});

// Validation

export const insertUserTableSchema = createInsertSchema(userTable);
export const selectUserTableSchema = createSelectSchema(userTable);
export const insertSessionTableSchema = createInsertSchema(sessionTable);
export const insertAssessmentTableSchema = createInsertSchema(AssessmentTable);

// Types

export type TInsertUser = InferInsertModel<typeof userTable>;
export type TSelectUser = InferSelectModel<typeof userTable>;

export type TInsertSession = InferInsertModel<typeof sessionTable>;
export type TSelectSession = InferSelectModel<typeof sessionTable>;

export type TInsertAssessment = InferInsertModel<typeof AssessmentTable>;
export type TSelectAssessment = InferSelectModel<typeof AssessmentTable>;
