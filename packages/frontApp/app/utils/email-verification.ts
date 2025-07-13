import { z } from "zod";
import { accessJwtOutputSchema, TVerifyEmailBody } from "@dododo/core";

import { resendEmailVerificationCode, verifyEmail } from "@/api";

import { getParsedCookies } from "./cookies";
import { updateSession } from "./session";

type TUser = z.infer<typeof accessJwtOutputSchema>;

type TEmailVerificationResponse = {
  resent?: boolean;
  headers?: Headers;
};

export const getUserEmailVerificationRequest = async (
  reqHeaders: Headers,
  user: TUser
): Promise<TEmailVerificationResponse> => {
  const { emailVerification } = getParsedCookies(reqHeaders.get("cookie"));

  if (!emailVerification) {
    const { headers } = await resendEmailVerificationCode({
      body: {
        userId: user.userId,
        email: user.email,
      },
    });

    console.log("::: Created new email verification request:", headers);

    if (headers) {
      const { emailVerification: newEmailVerification } = getParsedCookies(
        headers.get("set-cookie")
      );

      console.log(
        "::: Got email verification from NEW cookies:",
        newEmailVerification
      );

      reqHeaders.append("set-cookie", headers.get("set-cookie") ?? "");

      return {
        resent: true,
        headers: reqHeaders,
      };
    }

    return {};
  }

  console.log("::: Got email verification from cookies:", emailVerification);

  return {
    resent: false,
    headers: reqHeaders,
  };
};

type TAccessJwtPayload = z.infer<typeof accessJwtOutputSchema>;

export const getVerifiedUser = async (
  reqHeaders: Headers,
  verifyBody: TVerifyEmailBody
) => {
  const {
    accessToken,
    headers: verifyHeaders,
    ...rest
  } = await verifyEmail({ body: verifyBody, reqHeaders });

  console.log(
    "::: getVerifiedUser: verifyEmail:",
    accessToken,
    verifyHeaders,
    rest
  );

  if (accessToken && verifyHeaders) {
    const newHeaders = await updateSession(verifyHeaders, accessToken);

    const accessPayload: TAccessJwtPayload = JSON.parse(
      atob(accessToken.split(".")[1])
    );

    console.log(
      "::: getVerifiedUser: updateSession:",
      newHeaders,
      accessPayload
    );

    return {
      headers: newHeaders,
      verified: accessPayload.emailVerified,
      ...rest,
    };
  }

  return {
    headers: verifyHeaders,
    verified: false,
    ...rest,
  };
};
