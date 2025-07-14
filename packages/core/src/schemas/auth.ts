import { z } from "zod";

export const accessJwtInputSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  username: z.string(),
  emailVerified: z.boolean(),
  role: z.string(),
  curAssessmentVersion: z.number(),
});

export const accessJwtOutputSchema = accessJwtInputSchema.extend({
  iat: z.number(),
  exp: z.number(),
});

export const refreshJWTInputSchema = accessJwtInputSchema.extend({
  sessionId: z.string(),
});

export const refreshJWTOutputSchema = refreshJWTInputSchema.extend({
  iat: z.number(),
  exp: z.number(),
});
