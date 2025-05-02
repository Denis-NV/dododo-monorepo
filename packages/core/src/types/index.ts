import { z } from "zod";

export const accessJwtInputSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  username: z.string(),
  emailVerified: z.boolean(),
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

export const validationDetailsSchema = z.object({
  formErrors: z.array(z.string()),
  fieldErrors: z.record(z.array(z.string())),
});

export const authResponseSchema = z.object({
  error: z.string().optional(),
  message: z.string().optional(),
  details: validationDetailsSchema.optional(),
  accessToken: z.string().optional(),
});
