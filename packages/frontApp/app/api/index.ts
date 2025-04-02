import { Resource } from "sst";
import { z } from "zod";
import { createUserRequestBody, createUserResponseBody } from "@dododo/db";

export type TCreateUserReqBody = z.infer<typeof createUserRequestBody>;
export type TCreateUserResBody = z.infer<typeof createUserResponseBody>;

export const createUser = async (
  body: TCreateUserReqBody
): Promise<TCreateUserResBody> => {
  try {
    const response = await fetch(`${Resource.dododoApi.url}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseJson = await response.json();

    console.log(">>> response", response);
    console.log("--> json", responseJson);

    return responseJson;
  } catch (error) {
    return {
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
