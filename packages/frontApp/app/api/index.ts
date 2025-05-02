import { Resource } from "sst";
import { z } from "zod";

import { createUserRequestBody } from "@dododo/db";
import { authResponseSchema } from "@dododo/core";

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
