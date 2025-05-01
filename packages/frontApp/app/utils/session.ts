import * as cookie from "cookie";
import { z } from "zod";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@dododo/core";
import { accessJwtInputSchema } from "@dododo/core";

import { refreshSession } from "@/api";

type TAccessJwtPayload = z.infer<typeof accessJwtInputSchema>;

type TSession = {
  id: string;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;
  user: TAccessJwtPayload;
} | null;

export const getCurrentSession = async (
  cookies: string | null
): Promise<TSession> => {
  const parsedCookies = cookie.parse(cookies || "");
  const accessToken = parsedCookies?.[ACCESS_TOKEN];
  const refreshToken = parsedCookies?.[REFRESH_TOKEN];

  if (accessToken && refreshToken) {
    const accessPayload = JSON.parse(atob(accessToken.split(".")[1]));
    const refreshPayload = JSON.parse(atob(refreshToken.split(".")[1]));
    const sessionId = refreshPayload.sessionId;

    return {
      id: sessionId,
      accessExpiresAt: new Date(accessPayload.exp * 1000),
      refreshExpiresAt: new Date(refreshPayload.exp * 1000),
      user: {
        userId: accessPayload.userId,
        email: accessPayload.email,
        username: accessPayload.username,
        emailVerified: accessPayload.emailVerified,
      },
    };
  }

  if (refreshToken && cookies) {
    const { cookies: newCookies } = await refreshSession(cookies);

    const newParsedCookies = cookie.parse(newCookies || "");
    // const newAccessToken = newParsedCookies.access_token;
    const newRefreshToken = newParsedCookies?.[REFRESH_TOKEN];

    if (newRefreshToken) {
      const newRefreshPayload = JSON.parse(atob(newRefreshToken.split(".")[1]));
      console.log(">>> NEW refreshToken payload", newRefreshPayload);
      console.log(">>> NEW exprires", new Date(newRefreshPayload.exp * 1000));
    }
  }

  return null;
};
