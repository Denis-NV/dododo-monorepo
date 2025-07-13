import { z } from "zod";

export const responseSchema = z.object({
  error: z.string().optional(),
  message: z.string().optional(),
});

export const authResponseSchema = responseSchema.extend({
  accessToken: z.string().optional(),
});
