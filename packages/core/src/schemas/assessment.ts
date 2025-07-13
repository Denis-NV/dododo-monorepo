import { z } from "zod";

import { baseApiResponseSchema } from "./general";

export const createUpdateAssessmentRequestSchema = z.object({
  userId: z.string(),
  version: z.number(),
  assessment: z.record(z.any()), // This will be typed as TAssesmentJson from types
});

export const assessmentResponseSchema = baseApiResponseSchema.extend({
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
