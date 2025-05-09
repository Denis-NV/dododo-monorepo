import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import * as cookie from "cookie";
import { Resource } from "sst";

import {
  db,
  eq,
  sessionTable,
  userTable,
  createUserRequestBody,
  loginUserRequestBody,
  logoutUserRequestBody,
  insertUserTableSchema,
  resentVerificationRequestBody,
} from "@dododo/db";
import {
  authResponseSchema,
  EMAIL_VERIFICATION,
  REFRESH_TOKEN,
  refreshJWTOutputSchema,
  responseSchema,
} from "@dododo/core";

import { hashPassword, verifyPasswordHash } from "@/utils/password";
import { generateRandomRecoveryCode } from "@/utils/general";
import { encryptString } from "@/utils/encryption";
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
} from "@/utils/email-verification";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";
import { createSession } from "@/utils/session";
import { EMAIL_VERIFICATION_EXPIRATION_SECONDS } from "@/const";

export const registerUser = async (
  { body }: Request<unknown, unknown, z.infer<typeof createUserRequestBody>>,
  res: Response<z.infer<typeof authResponseSchema>>
) => {
  try {
    // Validate the request body
    const parsedBody = createUserRequestBody.safeParse(body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parsedBody.error.flatten(),
      });
    }

    const { email, username, password, firstName, lastName } = parsedBody.data;

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Generate and encrypt the recovery code
    const recoveryCode = generateRandomRecoveryCode();
    const encryptedRecoveryCode = encryptString(recoveryCode);

    // Prepare the new user values
    const newUserValues: z.infer<typeof insertUserTableSchema> = {
      email,
      username,
      passwordHash,
      recoveryCode: Buffer.from(encryptedRecoveryCode),
      emailVerified: false,
      firstName,
      lastName,
    };

    // Insert the new user into the database
    const [newUser] = await db
      .insert(userTable)
      .values(newUserValues)
      .returning()
      .onConflictDoNothing();

    // Handle conflict or unexpected errors
    if (!newUser) {
      return res.status(409).json({
        error: "User already exists or conflict occurred",
      });
    }

    const emailVerificationRequest = await createEmailVerificationRequest(
      newUser.id,
      newUser.email
    );

    if (!emailVerificationRequest) {
      return res.status(500).json({
        error: "Failed to create email verification request",
      });
    }

    sendVerificationEmail(
      emailVerificationRequest.email,
      emailVerificationRequest.code
    );

    const session = await createSession(newUser.id);

    if (!session) {
      return res.status(500).json({
        error: "Failed to create session",
      });
    }

    const { accessJWT } = generateAccessToken({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      emailVerified: newUser.emailVerified,
    });

    const { refreshCookie } = generateRefreshToken({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      emailVerified: newUser.emailVerified,
      sessionId: session.id,
    });

    res.cookie(EMAIL_VERIFICATION, emailVerificationRequest.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: EMAIL_VERIFICATION_EXPIRATION_SECONDS * 1000, // 10 minutes
    });

    res.cookie(refreshCookie.name, refreshCookie.val, refreshCookie.options);

    // Return the created user
    return res.status(201).json({ accessToken: accessJWT });
  } catch (error) {
    console.error("[ API ] Error creating user:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const login = async (
  { body }: Request<unknown, unknown, z.infer<typeof loginUserRequestBody>>,
  res: Response<z.infer<typeof authResponseSchema>>
) => {
  try {
    const parsedBody = loginUserRequestBody.safeParse(body);

    console.log("==> Log in body parsed: ", parsedBody.success);

    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parsedBody.error.flatten(),
      });
    }

    const { email, password } = parsedBody.data;

    console.log("==> Log in body password: ", parsedBody.data);

    const [user] = await db
      .select({
        id: userTable.id,
        email: userTable.email,
        username: userTable.username,
        emailVerified: userTable.emailVerified,
        hashPassword: userTable.passwordHash,
      })
      .from(userTable)
      .where(eq(userTable.email, email));

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    console.log("==> Log in body user: ", user);

    const validPassword = await verifyPasswordHash(user.hashPassword, password);

    console.log("==> Log in body validPassword: ", validPassword);

    if (!validPassword) {
      return res.status(400).json({
        error: "Invalid password",
      });
    }

    await db.delete(sessionTable).where(eq(sessionTable.userId, user.id));

    const session = await createSession(user.id);

    if (!session) {
      return res.status(500).json({
        error: "Failed to create session",
      });
    }

    const { accessJWT } = generateAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      emailVerified: user.emailVerified,
    });

    const { refreshCookie } = generateRefreshToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      emailVerified: user.emailVerified,
      sessionId: session.id,
    });

    res.cookie(refreshCookie.name, refreshCookie.val, refreshCookie.options);

    return res.status(201).json({ accessToken: accessJWT });
  } catch (error) {
    console.error("[ API ] Error logging in:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const logout = async (
  { body }: Request<unknown, unknown, z.infer<typeof logoutUserRequestBody>>,
  res: Response<z.infer<typeof authResponseSchema>>
) => {
  try {
    const parsedBody = logoutUserRequestBody.safeParse(body);

    console.log("--> Log out body: ", parsedBody.success);

    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parsedBody.error.flatten(),
      });
    }

    const { id } = parsedBody.data;

    console.log("--> Log out user id: ", id);

    await db.delete(sessionTable).where(eq(sessionTable.userId, id));

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("[ API ] Error logging out:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const refresh = async (
  req: Request,
  res: Response<z.infer<typeof authResponseSchema>>
) => {
  try {
    const parsedCookies = cookie.parse(req.headers.cookie || "");
    const oldToken = parsedCookies?.[REFRESH_TOKEN];

    console.log(">> Refresh Session request cookies:", parsedCookies);

    if (!oldToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(
      oldToken,
      Resource.RefreshTokenSecret.value,
      async (err: any, payload: any) => {
        console.log(">> Refresh Session error:", err);
        console.log(">> Refresh Session payload:", payload);

        // If token is invalid or not the latest one

        if (err) {
          res.clearCookie(REFRESH_TOKEN);

          return res.status(401).json({ message: "Invalid refresh token" });
        }

        const parsedPayload = refreshJWTOutputSchema.safeParse(payload);

        console.log(">> Refresh Session parsedPayload:", parsedPayload.success);

        if (!parsedPayload.success) {
          return res.status(401).json({
            error: "Invalid refresh token payload",
            details: parsedPayload.error.flatten(),
          });
        }

        const { sessionId, userId, email, username, emailVerified } =
          parsedPayload.data;

        console.log(">> Refresh Session Id:", sessionId);

        if (!sessionId) {
          res.clearCookie(REFRESH_TOKEN);

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

        console.log(">> Refresh Session oldSession:", oldSession);

        if (!oldSession) {
          res.clearCookie(REFRESH_TOKEN);

          await db.delete(sessionTable).where(eq(sessionTable.userId, userId));

          return res.status(401).json({ message: "Invalid session" });
        }

        // Remove the old token from "db"
        await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));

        console.log(
          ">> Refresh Session expired:",
          Date.now() >= oldSession.expiresAt.getTime()
        );

        if (Date.now() >= oldSession.expiresAt.getTime()) {
          res.clearCookie(REFRESH_TOKEN);

          await db.delete(sessionTable).where(eq(sessionTable.userId, userId));

          return res.status(401).json({ message: "The session has expired" });
        }

        const session = await createSession(userId);

        if (!session) {
          return res.status(500).json({
            error: "Failed to create session",
          });
        }

        // Generate brand-new tokens
        const { accessJWT } = generateAccessToken({
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

        res.cookie(
          refreshCookie.name,
          refreshCookie.val,
          refreshCookie.options
        );

        console.log("<<<<");
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

export const resentEmailVerification = async (
  {
    body,
  }: Request<unknown, unknown, z.infer<typeof resentVerificationRequestBody>>,
  res: Response<z.infer<typeof responseSchema>>
) => {
  try {
    const parsedBody = resentVerificationRequestBody.safeParse(body);

    console.log("--> Resent email verification body: ", parsedBody.success);

    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parsedBody.error.flatten(),
      });
    }

    const { email, userId } = parsedBody.data;

    console.log("--> Resent email verification data: ", email, userId);

    const emailVerificationRequest = await createEmailVerificationRequest(
      userId,
      email
    );

    if (!emailVerificationRequest) {
      return res.status(500).json({
        error: "Failed to create email verification request",
      });
    }

    sendVerificationEmail(
      emailVerificationRequest.email,
      emailVerificationRequest.code
    );

    res.cookie(EMAIL_VERIFICATION, emailVerificationRequest.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: EMAIL_VERIFICATION_EXPIRATION_SECONDS * 1000, // 10 minutes
    });

    return res.status(200).json({
      message: "Successfully resent email verification code",
    });
  } catch (error) {
    console.error("[ API ] Error resending email verification code:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
