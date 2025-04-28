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

// export const getCurrentSession = cache((): SessionValidationResult => {
// 	const token = cookies().get("session")?.value ?? null;
// 	if (token === null) {
// 		return { session: null, user: null };
// 	}
// 	const result = validateSessionToken(token);
// 	return result;
// });
