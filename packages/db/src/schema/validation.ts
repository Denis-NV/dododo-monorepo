import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  AssessmentTable,
  sessionTable,
  userTable,
  emailVerificationRequestTable,
} from "./tables";
import { responseSchema } from "@dododo/core";

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

export const loginUserRequestBody = selectUserTableSchema
  .pick({
    email: true,
  })
  .extend({
    password: z.string(),
  });

export const logoutUserRequestBody = selectUserTableSchema.pick({
  id: true,
});

// Email verification request table
export const insertEmailVerificationRequestTableSchema = createInsertSchema(
  emailVerificationRequestTable
);
export const selectEmailVerificationRequestTableSchema = createSelectSchema(
  emailVerificationRequestTable
);

export const resentVerificationRequestBody =
  selectEmailVerificationRequestTableSchema.pick({
    userId: true,
    email: true,
  });

export const verifyEmailBody = selectEmailVerificationRequestTableSchema
  .pick({
    userId: true,
  })
  .extend({
    code: z.string(),
  });

// Session table
export const insertSessionTableSchema = createInsertSchema(sessionTable);
export const selectSessionTableSchema = createSelectSchema(sessionTable);

export const insertAssessmentTableSchema = createInsertSchema(AssessmentTable);

// General

export const userProfileResponseSchema = responseSchema.extend({
  user: selectUserTableSchema
    .pick({
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
    })
    .optional(),
});
