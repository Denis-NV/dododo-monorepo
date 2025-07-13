import { Resource } from "sst";
import { Schema, z } from "zod";

import {
  userProfileResponseSchema,
  assessmentResponseSchema,
  AUTHORIZATION,
  authApiResponseSchema,
  baseApiResponseSchema,
  TBaseApiResponse,
  TAuthApiResponse,
  TUserProfileResponse,
  TAssessmentResponse,
  TCreateUpdateAssessmentRequest,
  TCreateUserRequest,
  TLoginUserRequest,
  TLogoutUserRequest,
  TResentVerificationRequest,
  TVerifyEmailRequest,
} from "@dododo/core";

type TResult = TBaseApiResponse & {
  headers?: Headers;
};

type TAuthResult = TAuthApiResponse & {
  headers?: Headers;
};

type TMethod = "GET" | "POST" | "PUT" | "DELETE";

const fetchApi =
  <TResponseJson extends TResult, TBody = Record<string, any>>(
    route: string,
    method: TMethod,
    responseSchema: Schema
  ) =>
  async ({
    body,
    reqHeaders,
  }: {
    body?: TBody;
    reqHeaders?: Headers;
  }): Promise<TResponseJson> => {
    try {
      const response = await fetch(`${Resource.dododoApi.url}/${route}`, {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: reqHeaders?.get("cookie") || "",
          [AUTHORIZATION]: reqHeaders?.get(AUTHORIZATION) || "",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseJson = await response.json();

      console.log(`::: Response from route ${route}:`, responseJson);

      const parseResult = responseSchema.safeParse(responseJson);

      if (!parseResult.success) {
        return {
          error: "Response parsing error",
          message: parseResult.error.flatten().formErrors.join(", "),
        } as TResponseJson;
      }

      return { headers: response.headers, ...parseResult.data };
    } catch (error) {
      return {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      } as TResponseJson;
    }
  };

export const registerUser = fetchApi<TAuthResult, TCreateUserRequest>(
  "auth/register",
  "POST",
  authApiResponseSchema
);

export const logIn = fetchApi<TAuthResult, TLoginUserRequest>(
  "auth/login",
  "POST",
  authApiResponseSchema
);

export const logOut = fetchApi<TAuthResult, TLogoutUserRequest>(
  "auth/logout",
  "POST",
  authApiResponseSchema
);

export const refreshSession = fetchApi<TAuthResult>(
  "auth/refresh",
  "POST",
  authApiResponseSchema
);

export const resendEmailVerificationCode = fetchApi<
  TResult,
  TResentVerificationRequest
>("auth/resend-email-verification", "POST", baseApiResponseSchema);

export const verifyEmail = fetchApi<TAuthResult, TVerifyEmailRequest>(
  "auth/verify-email",
  "POST",
  authApiResponseSchema
);

export const getProfile = fetchApi<TUserProfileResponse>(
  "user",
  "GET",
  userProfileResponseSchema
);

export const createUpdateAssessment = fetchApi<
  TAssessmentResponse,
  TCreateUpdateAssessmentRequest
>("assessment", "POST", assessmentResponseSchema);
