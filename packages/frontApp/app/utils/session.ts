import { z } from "zod";

import { REFRESH_TOKEN, accessJwtOutputSchema } from "@dododo/core";

import { refreshSession } from "@/api";
import { getParsedCookies, getPropogatedCookiesHeaders } from "./cookies";
import { createCookieSessionStorage } from "@remix-run/node";

import { Resource } from "sst";

type TAccessJwtPayload = z.infer<typeof accessJwtOutputSchema>;

type TSessionData = {
  accessToken: string;
  payload: TAccessJwtPayload;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<TSessionData, SessionFlashData>({
    cookie: {
      name: "access_session",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secrets: [Resource.AccessSessionSecret.value],
      secure: process.env.NODE_ENV === "production",
    },
  });

export const updateSession = async (
  reqHeaders: Headers,
  accessToken: string
): Promise<Headers> => {
  const session = await getSession(reqHeaders.get("Cookie"));

  const accessPayload: TAccessJwtPayload = JSON.parse(
    atob(accessToken.split(".")[1])
  );

  session.set("accessToken", accessToken);
  session.set("payload", accessPayload);

  const headers = getPropogatedCookiesHeaders(reqHeaders);
  const sessionCookie = await commitSession(session);

  headers.append("Set-Cookie", sessionCookie);

  return headers;
};

type TSession = {
  accessToken?: string;
  user?: TAccessJwtPayload;
  headers: Headers;
};

export const getCurrentSession = async (
  reqHeaders: Headers
): Promise<TSession> => {
  const session = await getSession(reqHeaders.get("Cookie"));

  const expires = session.get("payload")?.exp;

  console.log(">>> getCurrentSession: current seession", expires);

  console.log(
    ">>> getCurrentSession: still valid?",
    expires && new Date(expires * 1000) > new Date()
  );

  if (expires && new Date(expires * 1000) > new Date()) {
    return {
      accessToken: session.get("accessToken"),
      user: session.get("payload"),
      headers: reqHeaders,
    };
  }

  const { refreshToken } = getParsedCookies(reqHeaders.get("cookie"));

  console.log(
    ">>> getCurrentSession: refreshToken found",
    Boolean(refreshToken)
  );

  if (refreshToken) {
    const {
      headers: apiHeaders,
      accessToken: newAccessToken,
      error,
      message,
    } = await refreshSession({ reqHeaders });

    console.log(
      ">>> getCurrentSession: refreshSession headers:",
      Boolean(apiHeaders)
    );
    console.log(
      ">>> getCurrentSession: refreshSession access token:",
      Boolean(newAccessToken),
      newAccessToken,
      error,
      message
    );

    if (apiHeaders && newAccessToken) {
      const accessPayload: TAccessJwtPayload = JSON.parse(
        atob(newAccessToken.split(".")[1])
      );

      console.log(
        ">>> getCurrentSession: Refresh session API cookies:",
        apiHeaders.getSetCookie()
      );

      const newAccessSessionHeaders = await updateSession(
        apiHeaders,
        newAccessToken
      );

      console.log(
        ">>> getCurrentSession: Refresh session new session cookies:",
        newAccessSessionHeaders.getSetCookie()
      );

      return {
        accessToken: newAccessToken,
        user: accessPayload,
        headers: newAccessSessionHeaders,
      };
    }
  }

  const { headers } = await destroyCurrentSession(reqHeaders);

  console.log(">>> getCurrentSession: Destory session:", headers);

  return {
    headers,
  };
};

export const destroyCurrentSession = async (
  reqHeaders: Headers
): Promise<TSession> => {
  const session = await getSession(reqHeaders.get("Cookie"));

  const headers = new Headers();

  headers.append(
    "Set-Cookie",
    `${REFRESH_TOKEN}=; Max-Age=-1; Path=/; HttpOnly`
  );
  headers.append("Set-Cookie", await destroySession(session));

  return {
    headers,
  };
};
