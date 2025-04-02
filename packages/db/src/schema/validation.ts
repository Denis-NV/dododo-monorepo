import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { AssessmentTable, sessionTable, userTable } from "./tables";

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

export const createUserResponseBody = selectUserTableSchema.omit({
  passwordHash: true,
  recoveryCode: true,
  emailVerified: true,
});

export const insertSessionTableSchema = createInsertSchema(sessionTable);
export const insertAssessmentTableSchema = createInsertSchema(AssessmentTable);
