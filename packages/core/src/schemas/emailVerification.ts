import { z } from "zod";

export const resentVerificationRequestBodySchema = z.object({
  userId: z.string(),
  email: z.string().email(),
});

export const verifyEmailBodySchema = z.object({
  userId: z.string(),
  code: z.string(),
});
