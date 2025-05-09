import { z } from "zod";
import { accessJwtOutputSchema } from "@dododo/core";

import { resendEmailVerificationCode } from "@/api";

import { getParsedCookies } from "./cookies";

type TUser = z.infer<typeof accessJwtOutputSchema>;

type TEmailVerificationRequest = {
  id?: string;
  resent?: boolean;
  headers?: Headers;
};

export const getUserEmailVerificationRequest = async (
  reqHeaders: Headers,
  user: TUser
): Promise<TEmailVerificationRequest> => {
  const { emailVerification } = getParsedCookies(reqHeaders.get("cookie"));

  if (!emailVerification) {
    const { headers } = await resendEmailVerificationCode({
      userId: user.userId,
      email: user.email,
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

      return {
        id: newEmailVerification,
        resent: true,
        headers,
      };
    }

    return {};
  }

  console.log("::: Got email verification from cookies:", emailVerification);

  return {
    id: emailVerification,
    resent: false,
  };
};
