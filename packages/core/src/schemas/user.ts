import { z } from "zod";

export const createUserRequestBodySchema = z.object({
  email: z.string().email().min(5),
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string(),
});

export const loginUserRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const logoutUserRequestBodySchema = z.object({
  id: z.string(),
});

export const userProfileResponseSchema = z.object({
  error: z.string().optional(),
  message: z.string().optional(),
  user: z
    .object({
      id: z.string(),
      email: z.string().email(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      username: z.string(),
    })
    .optional(),
});
