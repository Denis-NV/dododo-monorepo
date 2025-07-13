import { z } from "zod";
import { responseSchema, authResponseSchema } from "../schemas/general";
import {
  userProfileResponseSchema,
  createUserRequestBodySchema,
  loginUserRequestBodySchema,
  logoutUserRequestBodySchema,
} from "../schemas/user";
import {
  assessmentResponseSchema,
  createUpdateAssessmentRequestBodySchema,
} from "../schemas/assessment";
import {
  resentVerificationRequestBodySchema,
  verifyEmailBodySchema,
} from "../schemas/emailVerification";

export type TResponse = z.infer<typeof responseSchema>;
export type TAuthResponse = z.infer<typeof authResponseSchema>;
export type TUserProfileResponse = z.infer<typeof userProfileResponseSchema>;
export type TAssessmentResponse = z.infer<typeof assessmentResponseSchema>;
export type TCreateUpdateAssessmentRequestBody = z.infer<
  typeof createUpdateAssessmentRequestBodySchema
>;
export type TCreateUserRequestBody = z.infer<
  typeof createUserRequestBodySchema
>;
export type TLoginUserRequestBody = z.infer<typeof loginUserRequestBodySchema>;
export type TLogoutUserRequestBody = z.infer<
  typeof logoutUserRequestBodySchema
>;
export type TResentVerificationRequestBody = z.infer<
  typeof resentVerificationRequestBodySchema
>;
export type TVerifyEmailBody = z.infer<typeof verifyEmailBodySchema>;
