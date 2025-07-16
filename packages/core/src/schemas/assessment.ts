import { z } from "zod";

import { baseApiResponseSchema } from "./general";

export enum TAnswer {
  NEVER = "never",
  RARELY = "rarely",
  SOMETIMES = "sometimes",
  ALWAYS = "always",
}

const answerSchema = z.nativeEnum(TAnswer);

const skillAssessmentSchema = z.object({
  question1: answerSchema,
  question2: answerSchema,
  question3: answerSchema,
  question4: answerSchema,
  question5: answerSchema,
  question6: answerSchema,
  question7: answerSchema,
  question8: answerSchema,
  question9: answerSchema,
  question10: answerSchema,
  question11: answerSchema,
  question12: answerSchema,
  question13: answerSchema,
  question14: answerSchema,
  question15: answerSchema,
  question16: answerSchema,
  question17: answerSchema,
  question18: answerSchema,
  question19: answerSchema,
  question20: answerSchema,
});

export const assessmentSchema = z.object({
  emotions: skillAssessmentSchema.optional(),
  attention: skillAssessmentSchema.optional(),
  communication: skillAssessmentSchema.optional(),
  reading_writing: skillAssessmentSchema.optional(),
  fine_motor: skillAssessmentSchema.optional(),
  organizing: skillAssessmentSchema.optional(),
  logics: skillAssessmentSchema.optional(),
});

export const createUpdateAssessmentRequestSchema = z.object({
  userId: z.string(),
  assessment: assessmentSchema,
});

export const assessmentResponseSchema = baseApiResponseSchema.extend({
  assessment: assessmentSchema.optional(),
});
