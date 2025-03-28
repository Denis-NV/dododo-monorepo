import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { AssessmentTable, sessionTable, userTable } from "./tables";

export const insertUserTableSchema = createInsertSchema(userTable);
export const selectUserTableSchema = createSelectSchema(userTable);
export const insertSessionTableSchema = createInsertSchema(sessionTable);
export const insertAssessmentTableSchema = createInsertSchema(AssessmentTable);
