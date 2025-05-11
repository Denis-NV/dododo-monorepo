import {
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
  id: uuid().primaryKey().defaultRandom(),
  email: text().unique().notNull(),
  username: text().notNull(),
  firstName: text(),
  lastName: text(),
  passwordHash: text().notNull(),
  recoveryCode: bytea().notNull(),
  emailVerified: boolean().notNull().default(false),
});

export const emailVerificationRequestTable = pgTable(
  "email_verification_request",
  {
    ...timestamps,
    id: text().primaryKey().notNull(),
    userId: uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    email: text().notNull(),
    code: text().notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  }
);

export const sessionTable = pgTable("session", {
  ...timestamps,
  id: text().primaryKey().notNull(),
  userId: uuid()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const AssessmentTable = pgTable("assessments", {
  ...timestamps,
  id: uuid().primaryKey().defaultRandom(),
  description: text(),
  gender: text(),
});
