import { Resource } from "sst";
import { z } from "zod";

import {
  createUserRequestBody,
  loginUserRequestBody,
  logoutUserRequestBody,
  resentVerificationRequestBody,
} from "@dododo/db";
import { authResponseSchema, responseSchema } from "@dododo/core";

type TResult = z.infer<typeof responseSchema> & {
  headers?: Headers;
};

type TAuthResult = z.infer<typeof authResponseSchema> & {
  headers?: Headers;
};

type TRegisterUserReqBody = z.infer<typeof createUserRequestBody>;

export const registerUser = async (
  body: TRegisterUserReqBody
): Promise<TAuthResult> => {
  try {
    const response = await fetch(`${Resource.dododoApi.url}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseJson = await response.json();

    return { headers: response.headers, ...responseJson };
  } catch (error) {
    return {
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

type TLoginUserReqBody = z.infer<typeof loginUserRequestBody>;

export const logIn = async (body: TLoginUserReqBody): Promise<TAuthResult> => {
  try {
    console.log("FE login body:", body);

    const response = await fetch(`${Resource.dododoApi.url}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("FE login response:", response);

    const responseJson = await response.json();

    console.log("FE login json:", responseJson);

    return { headers: response.headers, ...responseJson };
  } catch (error) {
    return {
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

type TLogoutUserReqBody = z.infer<typeof logoutUserRequestBody>;

export const logOut = async (
  body: TLogoutUserReqBody
): Promise<TAuthResult> => {
  try {
    const response = await fetch(`${Resource.dododoApi.url}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return await response.json();
  } catch (error) {
    return {
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const refreshSession = async (
  reqHeaders: Headers
): Promise<TAuthResult> => {
  try {
    const cookies = reqHeaders.get("cookie") || "";

    const response = await fetch(`${Resource.dododoApi.url}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
      },
    });

    const responseJson = await response.json();

    return {
      headers: response.headers,
      ...responseJson,
    };
  } catch (error) {
    return {
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

type TResendVerificationReqBody = z.infer<typeof resentVerificationRequestBody>;

export const resendEmailVerificationCode = async (
  body: TResendVerificationReqBody
): Promise<TResult> => {
  try {
    console.log("::: Passing body to resendEmailVerificationCode:", body);

    const response = await fetch(
      `${Resource.dododoApi.url}/auth/resend-email-verification`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const responseJson = await response.json();

    return {
      headers: response.headers,
      ...responseJson,
    };
  } catch (error) {
    return {
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
