import {
  integer,
  pgTable,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

import { timestamps } from "./columns";

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
