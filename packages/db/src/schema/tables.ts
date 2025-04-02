import {
  integer,
  pgTable,
  text,
  timestamp,
  boolean,
  customType,
} from "drizzle-orm/pg-core";

import { timestamps } from "./columns";

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return "bytea";
  },
});

export const userTable = pgTable("user", {
  ...timestamps,
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  email: text().unique().notNull(),
  username: text().notNull(),
  firstName: text(),
  lastName: text(),
  passwordHash: text().notNull(),
  recoveryCode: bytea().notNull(),
  emailVerified: boolean().notNull().default(false),
});

export const sessionTable = pgTable("session", {
  ...timestamps,
  id: text().primaryKey(),
  userId: integer()
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
