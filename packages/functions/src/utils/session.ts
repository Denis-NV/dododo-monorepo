import jwt from "jsonwebtoken";
import { Resource } from "sst";
import { z } from "zod";
import { CookieOptions } from "express";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { db, selectSessionTableSchema, sessionTable } from "@dododo/db";
import {
  ACCESS_TOKEN_EXPIRATION_SECONDS,
  REFRESH_TOKEN_EXPIRATION_SECONDS,
} from "@/const";
import {
  accessJwtInputSchema,
  REFRESH_TOKEN,
  refreshJWTInputSchema,
} from "@dododo/core";

export type Session = z.infer<typeof selectSessionTableSchema>;

export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
  return token;
}

async function createDbSession(userId: string): Promise<Session> {
  const sessionToken = generateSessionToken();
  const sessionId = encodeHexLowerCase(
    sha256(new TextEncoder().encode(sessionToken))
  );

  const [newSession] = await db
    .insert(sessionTable)
    .values({
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_SECONDS * 1000),
    })
    .returning();

  console.log("[ API ] Created session:", newSession.id.substring(0, 4));

  return newSession;
}

type TAccessJwtPayload = z.infer<typeof accessJwtInputSchema>;

const generateAccessToken = (payload: TAccessJwtPayload) => {
  const token = jwt.sign(payload, Resource.AccessTokenSecret.value, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_SECONDS,
  });

  return {
    accessJWT: token,
  };
};

type TRefreshJwtPayload = z.infer<typeof refreshJWTInputSchema>;

const generateRefreshToken = (payload: TRefreshJwtPayload) => {
  const token = jwt.sign(payload, Resource.RefreshTokenSecret.value, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_SECONDS,
  });

  const options: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_EXPIRATION_SECONDS * 1000, // 30 days
  };
  return {
    refreshJWT: token,
    refreshCookie: {
      name: REFRESH_TOKEN,
      val: token,
      options,
    },
  };
};

export const createSession = async (user: TAccessJwtPayload) => {
  const session = await createDbSession(user.userId);

  // Generate brand-new tokens
  const { accessJWT } = generateAccessToken({
    userId: user.userId,
    email: user.email,
    username: user.username,
    emailVerified: user.emailVerified,
  });

  const { refreshCookie } = generateRefreshToken({
    userId: user.userId,
    email: user.email,
    username: user.username,
    emailVerified: user.emailVerified,
    sessionId: session?.id,
  });

  return {
    accessJWT,
    refreshCookie,
    session,
  };
};
