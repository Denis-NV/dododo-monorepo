import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  AssessmentTable,
  sessionTable,
  userTable,
  emailVerificationRequestTable,
} from "./tables";

// User table
export const insertUserTableSchema = createInsertSchema(userTable, {
  email: z.string().email().min(5),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});
export const selectUserTableSchema = createSelectSchema(userTable);

export const createUserRequestBody = insertUserTableSchema
  .omit({
    createdAt: true,
    updatedAt: true,
    passwordHash: true,
    recoveryCode: true,
    emailVerified: true,
  })
  .extend({
    password: z.string(),
  });

// Email verification request table
export const insertEmailVerificationRequestTableSchema = createInsertSchema(
  emailVerificationRequestTable
);
export const selectEmailVerificationRequestTableSchema = createSelectSchema(
  emailVerificationRequestTable
);

// Session table
export const insertSessionTableSchema = createInsertSchema(sessionTable);
export const selectSessionTableSchema = createSelectSchema(sessionTable);

export const insertAssessmentTableSchema = createInsertSchema(AssessmentTable);
