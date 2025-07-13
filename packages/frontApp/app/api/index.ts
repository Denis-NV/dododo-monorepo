import { Resource } from "sst";
import { Schema, z } from "zod";

import {
  userProfileResponseSchema,
  assessmentResponseSchema,
  AUTHORIZATION,
  authResponseSchema,
  responseSchema,
  TResponse,
  TAuthResponse,
  TUserProfileResponse,
  TAssessmentResponse,
  TCreateUpdateAssessmentRequestBody,
  TCreateUserRequestBody,
  TLoginUserRequestBody,
  TLogoutUserRequestBody,
  TResentVerificationRequestBody,
  TVerifyEmailBody,
} from "@dododo/core";

type TResult = TResponse & {
  headers?: Headers;
};

type TAuthResult = TAuthResponse & {
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

export const registerUser = fetchApi<TAuthResult, TCreateUserRequestBody>(
  "auth/register",
  "POST",
  authResponseSchema
);

export const logIn = fetchApi<TAuthResult, TLoginUserRequestBody>(
  "auth/login",
  "POST",
  authResponseSchema
);

export const logOut = fetchApi<TAuthResult, TLogoutUserRequestBody>(
  "auth/logout",
  "POST",
  authResponseSchema
);

export const refreshSession = fetchApi<TAuthResult>(
  "auth/refresh",
  "POST",
  authResponseSchema
);

export const resendEmailVerificationCode = fetchApi<
  TResult,
  TResentVerificationRequestBody
>("auth/resend-email-verification", "POST", responseSchema);

export const verifyEmail = fetchApi<TAuthResult, TVerifyEmailBody>(
  "auth/verify-email",
  "POST",
  authResponseSchema
);

export const getProfile = fetchApi<TUserProfileResponse>(
  "user",
  "GET",
  userProfileResponseSchema
);

export const createUpdateAssessment = fetchApi<
  TAssessmentResponse,
  TCreateUpdateAssessmentRequestBody
>("assessment", "POST", assessmentResponseSchema);
