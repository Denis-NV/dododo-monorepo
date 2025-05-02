import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import * as cookie from "cookie";
import { Resource } from "sst";

import { db, eq, sessionTable, userTable } from "@dododo/db";
import {
  ACCESS_TOKEN,
  authResponseSchema,
  REFRESH_TOKEN,
  refreshJWTOutputSchema,
} from "@dododo/core";

import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";
import { createSession } from "@/utils/session";

export const refresh = async (
  req: Request,
  res: Response<z.infer<typeof authResponseSchema>>
) => {
  try {
    const parsedCookies = cookie.parse(req.headers.cookie || "");
    const oldToken = parsedCookies?.[REFRESH_TOKEN];

    if (!oldToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(
      oldToken,
      Resource.RefreshTokenSecret.value,
      async (err: any, payload: any) => {
        // If token is invalid or not the latest one
        if (err) {
          res.clearCookie(REFRESH_TOKEN);
          res.clearCookie(ACCESS_TOKEN);

          return res.status(401).json({ message: "Invalid refresh token" });
        }

        const parsedPayload = refreshJWTOutputSchema.safeParse(payload);

        if (!parsedPayload.success) {
          return res.status(401).json({
            error: "Invalid refresh token payload",
            details: parsedPayload.error.flatten(),
          });
        }

        const { sessionId, userId, email, username, emailVerified } =
          parsedPayload.data;

        if (!sessionId) {
          res.clearCookie(REFRESH_TOKEN);
          res.clearCookie(ACCESS_TOKEN);

          return res.status(401).json({ message: "Invalid session ID" });
        }

        const [oldSession] = await db
          .select({
            expiresAt: sessionTable.expiresAt,
            userId: userTable.id,
            email: userTable.email,
            username: userTable.username,
            emailVerified: userTable.emailVerified,
          })
          .from(sessionTable)
          .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
          .where(eq(sessionTable.id, sessionId));

        if (!oldSession) {
          res.clearCookie(REFRESH_TOKEN);
          res.clearCookie(ACCESS_TOKEN);

          await db.delete(sessionTable).where(eq(sessionTable.userId, userId));

          return res.status(401).json({ message: "Invalid session" });
        }

        // Remove the old token from "db"
        await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));

        const session = await createSession(userId);

        if (!session) {
          return res.status(500).json({
            error: "Failed to create session",
          });
        }

        if (Date.now() >= session.expiresAt.getTime()) {
          res.clearCookie(REFRESH_TOKEN);
          res.clearCookie(ACCESS_TOKEN);

          await db.delete(sessionTable).where(eq(sessionTable.userId, userId));

          return res.status(401).json({ message: "The session has expired" });
        }

        // Generate brand-new tokens
        const { accessJWT, accessCookie } = generateAccessToken({
          userId,
          email,
          username,
          emailVerified,
        });

        const { refreshCookie } = generateRefreshToken({
          userId,
          email,
          username,
          emailVerified,
          sessionId: session.id,
        });

        res.cookie(accessCookie.name, accessCookie.val, accessCookie.options);
        res.cookie(
          refreshCookie.name,
          refreshCookie.val,
          refreshCookie.options
        );

        return res.status(200).json({ accessToken: accessJWT });
      }
    );
  } catch (error) {
    console.error("[ API ] Error refreshing token:", error);

    // Handle unexpected errors
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
