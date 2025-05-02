import { z } from "zod";

import { REFRESH_TOKEN, accessJwtOutputSchema } from "@dododo/core";

import { refreshSession } from "@/api";
import { getParsedCookies, getPropogatedCookiesHeaders } from "./cookies";

type TAccessJwtPayload = z.infer<typeof accessJwtOutputSchema>;

type TSession = {
  accessToken?: string;
  user?: TAccessJwtPayload;
  headers?: Headers;
};

export const getCurrentSession = async (
  reqHeaders: Headers
): Promise<TSession> => {
  const { accessToken, refreshToken } = getParsedCookies(
    reqHeaders.get("cookie")
  );

  if (accessToken) {
    const accessPayload: TAccessJwtPayload = JSON.parse(
      atob(accessToken.split(".")[1])
    );

    return {
      accessToken,
      user: { ...accessPayload },
    };
  }

  if (refreshToken) {
    const { headers: apiHeaders } = await refreshSession(reqHeaders);
    const headers = getPropogatedCookiesHeaders(apiHeaders);

    const newParsedCookies = getParsedCookies(headers.get("set-cookie"));
    const newAccessToken = newParsedCookies.accessToken;

    if (newAccessToken) {
      const accessPayload: TAccessJwtPayload = JSON.parse(
        atob(newAccessToken.split(".")[1])
      );

      return {
        accessToken: newAccessToken,
        user: { ...accessPayload },
        headers,
      };
    }
  }

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `${REFRESH_TOKEN}=; Max-Age=-1; Path=/; HttpOnly`
  );

  return {
    headers,
  };
};
