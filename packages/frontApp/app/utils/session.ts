import { TSessionUser } from "@dododo/db";
import * as cookie from "cookie";

export type TSession = {
  id: string;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;
  user: TSessionUser;
} | null;

export const getCurrentSession = (cookies: string | null): TSession => {
  const parsedCookies = cookie.parse(cookies || "");
  const accessToken = parsedCookies.access_token;
  const refreshToken = parsedCookies.refresh_token;

  if (accessToken && refreshToken) {
    const accessPayload = JSON.parse(atob(accessToken.split(".")[1]));
    const refreshPayload = JSON.parse(atob(refreshToken.split(".")[1]));
    const sessionId = refreshPayload.sessionId;

    return {
      id: sessionId,
      accessExpiresAt: new Date(accessPayload.exp * 1000),
      refreshExpiresAt: new Date(refreshPayload.exp * 1000),
      user: {
        id: accessPayload.id,
        email: accessPayload.email,
        username: accessPayload.username,
        emailVerified: accessPayload.emailVerified,
      },
    };
  }

  if (refreshToken) {
    const payload = JSON.parse(atob(refreshToken.split(".")[1]));

    console.log(">>> refreshToken payload", payload);
    console.log(">>> exprires", new Date(payload.exp * 1000));
  }

  return null;
};
