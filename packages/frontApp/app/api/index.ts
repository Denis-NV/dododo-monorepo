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

type TResponseWithHeaders = TBaseApiResponse & {
  headers?: Headers;
};

type TAuthResponseWithHeaders = TAuthApiResponse & {
  headers?: Headers;
};

type TMethod = "GET" | "POST" | "PUT" | "DELETE";

const fetchApi =
  <TResponseJson extends TResponseWithHeaders, TBody = Record<string, any>>(
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

export const registerUser = fetchApi<
  TAuthResponseWithHeaders,
  TCreateUserRequest
>("auth/register", "POST", authApiResponseSchema);

export const logIn = fetchApi<TAuthResponseWithHeaders, TLoginUserRequest>(
  "auth/login",
  "POST",
  authApiResponseSchema
);

export const logOut = fetchApi<TAuthResponseWithHeaders, TLogoutUserRequest>(
  "auth/logout",
  "POST",
  authApiResponseSchema
);

export const refreshSession = fetchApi<TAuthResponseWithHeaders>(
  "auth/refresh",
  "POST",
  authApiResponseSchema
);

export const resendEmailVerificationCode = fetchApi<
  TResponseWithHeaders,
  TResentVerificationRequest
>("auth/resend-email-verification", "POST", baseApiResponseSchema);

export const verifyEmail = fetchApi<
  TAuthResponseWithHeaders,
  TVerifyEmailRequest
>("auth/verify-email", "POST", authApiResponseSchema);

export const getProfile = fetchApi<TUserProfileResponse>(
  "user",
  "GET",
  userProfileResponseSchema
);

export const createUpdateAssessment = fetchApi<
  TAssessmentResponse,
  TCreateUpdateAssessmentRequest
>("assessment", "POST", assessmentResponseSchema);
