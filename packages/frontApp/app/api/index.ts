import { Resource } from "sst";
import { z } from "zod";
import { createUserRequestBody, createUserResponseBody } from "@dododo/db";
import { sendErrorResponse, TErrorResponse } from "@/utils/errorHandlers";

export type TCreateUserReqBody = z.infer<typeof createUserRequestBody>;
export type TCreateUserResBody = Partial<
  z.infer<typeof createUserResponseBody>
> &
  TErrorResponse;

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
    // Example 500 exception
    // Response {
    //   status: 500,
    //   statusText: 'Internal Server Error',
    //   headers: Headers {
    //     date: 'Wed, 02 Apr 2025 10:32:29 GMT',
    //     'content-type': 'application/json',
    //     'content-length': '35',
    //     connection: 'keep-alive',
    //     'apigw-requestid': 'IY_JXhDUrPEEMvw='
    //   },
    //   body: ReadableStream { locked: true, state: 'closed',
    // supportsBYOB: true },
    //   bodyUsed: true,
    //   ok: false,
    //   redirected: false,
    //   type: 'basic',
    //   url: 'https://qbzx3hqc0e.execute-api.eu-west-2.amazona
    // ws.com/user'
    // }
    console.log("--> json", responseJson);
    // Example 500 exception
    // --> json { message: 'Internal Server Error' }

    // Example 200 response
    // Response {
    //   status: 200,
    //   statusText: 'OK',
    //   headers: Headers {
    //     date: 'Wed, 02 Apr 2025 11:01:40 GMT',
    //     'content-type': 'application/json; charset=utf-8',
    //     'content-length': '530',
    //     connection: 'keep-alive',
    //     'x-powered-by': 'Express',
    //     etag: 'W/"212-vrSuu61SeVEKG2RyMRiqnliXU7M"',
    //     'apigw-requestid': 'IZDbGgnFLPEEKJA='
    //   },
    //   body: ReadableStream { locked: true, state: 'closed',
    // supportsBYOB: true },
    //   bodyUsed: true,
    //   ok: true,
    //   redirected: false,
    //   type: 'basic',
    //   url: 'https://qbzx3hqc0e.execute-api.eu-west-2.amazona
    // ws.com/user'
    // }
    // --> json {
    //   createdAt: '2025-04-02T11:01:40.757Z',
    //   updatedAt: '2025-04-02T11:01:40.757Z',
    //   id: 1,
    //   email: 'denisnv@gmail.com',
    //   username: 'denisnv@gmail.com',
    //   firstName: null,
    //   lastName: null,

    return Response.json({
      ...responseJson,
      ok: true,
      status: 200,
    });
  } catch (error) {
    return sendErrorResponse(error);
  }
};
