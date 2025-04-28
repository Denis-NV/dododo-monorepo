import * as cookie from "cookie";

export const parseSetCookie = (
  setCookieStrings: string[]
): Record<string, string> => {
  const cookies: Record<string, string> = {};

  setCookieStrings.forEach((cookieString) => {
    const parsedCookie = cookie.parse(cookieString);
    const cookieName = Object.keys(parsedCookie)[0];

    if (cookieName && parsedCookie[cookieName]) {
      cookies[cookieName] = parsedCookie[cookieName];
    }
  });

  return cookies;
};
