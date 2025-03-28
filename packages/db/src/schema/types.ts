import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { AssessmentTable, sessionTable, userTable } from "./tables";

export type TInsertUser = InferInsertModel<typeof userTable>;
export type TSelectUser = InferSelectModel<typeof userTable>;

export type TInsertSession = InferInsertModel<typeof sessionTable>;
export type TSelectSession = InferSelectModel<typeof sessionTable>;

export type TInsertAssessment = InferInsertModel<typeof AssessmentTable>;
export type TSelectAssessment = InferSelectModel<typeof AssessmentTable>;
