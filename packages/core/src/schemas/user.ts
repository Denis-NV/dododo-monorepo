import { z } from "zod";
import { baseApiResponseSchema } from "./general";

export const createUserRequestSchema = z.object({
  email: z.string().email().min(5),
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string(),
});

export const loginUserRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const logoutUserRequestSchema = z.object({
  id: z.string(),
});

export const userProfileResponseSchema = baseApiResponseSchema.extend({
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
