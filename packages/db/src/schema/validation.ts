import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  AssessmentTable,
  sessionTable,
  userTable,
  emailVerificationRequestTable,
} from "./tables";

// ===== DRIZZLE-ZOD GENERATED SCHEMAS ONLY =====

// User table schemas
export const insertUserTableSchema = createInsertSchema(userTable, {
  email: z.string().email().min(5),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});
export const selectUserTableSchema = createSelectSchema(userTable);

// Email verification request table schemas
export const insertEmailVerificationRequestTableSchema = createInsertSchema(
  emailVerificationRequestTable
);
export const selectEmailVerificationRequestTableSchema = createSelectSchema(
  emailVerificationRequestTable
);

// Session table schemas
export const insertSessionTableSchema = createInsertSchema(sessionTable);
export const selectSessionTableSchema = createSelectSchema(sessionTable);

// Assessment table schemas
export const insertAssessmentTableSchema = createInsertSchema(AssessmentTable);
export const selectAssessmentTableSchema = createSelectSchema(AssessmentTable);
