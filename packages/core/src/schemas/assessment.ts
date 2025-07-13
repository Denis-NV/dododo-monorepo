import { z } from "zod";

export const createUpdateAssessmentRequestBodySchema = z.object({
  userId: z.string(),
  version: z.number(),
  assessment: z.record(z.any()), // This will be typed as TAssesmentJson from types
});

export const assessmentResponseSchema = z.object({
  error: z.string().optional(),
  message: z.string().optional(),
  assessment: z
    .object({
      id: z.string(),
      userId: z.string(),
      version: z.number(),
      assessment: z.record(z.any()),
      locked: z.boolean(),
    })
    .optional(),
});
