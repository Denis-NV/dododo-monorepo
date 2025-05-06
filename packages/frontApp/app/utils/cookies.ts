import * as cookie from "cookie";
import { REFRESH_TOKEN } from "@dododo/core";

export const getPropogatedCookiesHeaders = (
  originalHeaders?: Headers,
  newHeaders?: Headers
): Headers => {
  const cookies = originalHeaders?.getSetCookie();
  const headers = newHeaders || new Headers();

  cookies?.forEach((cookie) => headers.append("Set-Cookie", cookie));

  return headers;
};

type TParsedCookies = {
  refreshToken: string | undefined;
};

export const getParsedCookies = (cookies: string | null): TParsedCookies => {
  const parsedCookies = cookie.parse(cookies || "");

  return {
    refreshToken: parsedCookies?.[REFRESH_TOKEN],
  };
};
