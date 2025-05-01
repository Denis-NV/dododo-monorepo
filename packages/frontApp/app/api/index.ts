import { Resource } from "sst";
import { z } from "zod";

import { createUserRequestBody, createUserResponseBody } from "@dododo/db";

export type TCreateUserReqBody = z.infer<typeof createUserRequestBody>;
export type TCreateUserResBody = z.infer<typeof createUserResponseBody>;
export type TCreateUserResult = TCreateUserResBody & {
  cookies?: string[];
};

export const createUser = async (
  body: TCreateUserReqBody
): Promise<TCreateUserResult> => {
  try {
    const response = await fetch(`${Resource.dododoApi.url}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseJson = await response.json();

    return { cookies: response.headers.getSetCookie(), ...responseJson };
  } catch (error) {
    return {
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export type TRefreshSessionResult = {
  error?: string;
  message?: string;
  cookies?: string;
};

export const refreshSession = async (
  cookies: string
): Promise<TRefreshSessionResult> => {
  try {
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
      cookies: response.headers.getSetCookie()?.join(";"),
      ...responseJson,
    };
  } catch (error) {
    return {
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
