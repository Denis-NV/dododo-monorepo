import { z } from "zod";

export const resentVerificationRequestSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
});

export const verifyEmailRequestSchema = z.object({
  userId: z.string(),
  code: z.string(),
});
