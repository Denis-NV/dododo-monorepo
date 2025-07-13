import { z } from "zod";
import {
  baseApiResponseSchema,
  authApiResponseSchema,
} from "../schemas/general";
import {
  userProfileResponseSchema,
  createUserRequestSchema,
  loginUserRequestSchema,
  logoutUserRequestSchema,
} from "../schemas/user";
import {
  assessmentResponseSchema,
  createUpdateAssessmentRequestSchema,
} from "../schemas/assessment";
import {
  resentVerificationRequestSchema,
  verifyEmailRequestSchema,
} from "../schemas/emailVerification";

// Inferred Response Body Types
export type TBaseApiResponse = z.infer<typeof baseApiResponseSchema>;
export type TAuthApiResponse = z.infer<typeof authApiResponseSchema>;
export type TUserProfileResponse = z.infer<typeof userProfileResponseSchema>;
export type TAssessmentResponse = z.infer<typeof assessmentResponseSchema>;

// Inferred Request Body Types
export type TCreateUpdateAssessmentRequest = z.infer<
  typeof createUpdateAssessmentRequestSchema
>;
export type TCreateUserRequest = z.infer<typeof createUserRequestSchema>;
export type TLoginUserRequest = z.infer<typeof loginUserRequestSchema>;
export type TLogoutUserRequest = z.infer<typeof logoutUserRequestSchema>;
export type TResentVerificationRequest = z.infer<
  typeof resentVerificationRequestSchema
>;
export type TVerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>;
