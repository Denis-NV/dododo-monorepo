import { integer, pgTable, text } from "drizzle-orm/pg-core";
// import { createInsertSchema } from "drizzle-zod";

import { timestamps } from "@/utils/columns.helpers";

export const AssessmentTable = pgTable("assessments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  description: text(),
  ...timestamps,
});

// export const insertAssessmentTableSchema = createInsertSchema(AssessmentTable, {
//   email: (schema) => schema.email.email(),
//   firstName: (schema) => schema.firstName.min(2).max(150).optional(),
//   lastName: (schema) => schema.lastName.min(2).max(150).optional(),
// });
