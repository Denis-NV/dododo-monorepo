import {
  integer,
  pgTable,
  text,
  timestamp,
  boolean,
  customType,
  uuid,
} from "drizzle-orm/pg-core";

import { timestamps } from "./columns";

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return "bytea";
  },
});

export const userTable = pgTable("user", {
  ...timestamps,
  id: uuid().defaultRandom().primaryKey(),
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
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const AssessmentTable = pgTable("assessments", {
  ...timestamps,
  id: uuid().defaultRandom().primaryKey(),
  description: text(),
  gender: text(),
});
