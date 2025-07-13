import { z } from "zod";

export const baseApiResponseSchema = z.object({
  error: z.string().optional(),
  message: z.string().optional(),
});

export const authApiResponseSchema = baseApiResponseSchema.extend({
  accessToken: z.string().optional(),
});
