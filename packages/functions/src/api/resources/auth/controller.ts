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
  verifyEmailBody,
  emailVerificationRequestTable,
  and,
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
  deleteUserEmailVerificationRequest,
  sendVerificationEmail,
} from "@/utils/email-verification";
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

    await sendVerificationEmail(
      emailVerificationRequest.email,
      emailVerificationRequest.code
    );

    const { session, refreshCookie, accessJWT } = await createSession({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      emailVerified: newUser.emailVerified,
    });

    if (!session) {
      return res.status(500).json({
        error: "Failed to create session",
      });
    }

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

    const { session, refreshCookie, accessJWT } = await createSession({
      userId: user.id,
      email: user.email,
      username: user.username,
      emailVerified: user.emailVerified,
    });

    if (!session) {
      return res.status(500).json({
        error: "Failed to create session",
      });
    }

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
          });
        }

        const { sessionId, userId } = parsedPayload.data;

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

        console.log(
          ">> Refresh Session expired:",
          Date.now() >= oldSession.expiresAt.getTime()
        );

        if (Date.now() >= oldSession.expiresAt.getTime()) {
          res.clearCookie(REFRESH_TOKEN);

          await db.delete(sessionTable).where(eq(sessionTable.userId, userId));

          return res.status(401).json({ message: "The session has expired" });
        }

        // Remove the old token from "db"
        await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));

        const { session, refreshCookie, accessJWT } = await createSession({
          userId,
          email: oldSession.email,
          username: oldSession.username,
          emailVerified: oldSession.emailVerified,
        });

        if (!session) {
          return res.status(500).json({
            error: "Failed to create session",
          });
        }

        res.cookie(
          refreshCookie.name,
          refreshCookie.val,
          refreshCookie.options
        );

        console.log(">> Refresh Session new access JWT:", accessJWT);
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

    await sendVerificationEmail(
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

export const verifyEmail = async (
  { body, headers }: Request<unknown, unknown, z.infer<typeof verifyEmailBody>>,
  res: Response<z.infer<typeof authResponseSchema>>
) => {
  try {
    const parsedCookies = cookie.parse(headers.cookie || "");
    const verificationReqId = parsedCookies?.[EMAIL_VERIFICATION];

    if (!verificationReqId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsedBody = verifyEmailBody.safeParse(body);

    console.log("--> Verify email body: ", parsedBody.success);

    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Invalid input",
      });
    }

    const { userId } = parsedBody.data;

    console.log("--> Verify email data: ", userId);

    const [verifyReq] = await db
      .select()
      .from(emailVerificationRequestTable)
      .where(
        and(
          eq(emailVerificationRequestTable.id, verificationReqId),
          eq(emailVerificationRequestTable.userId, userId)
        )
      );

    console.log("--> Found email request for: ", verifyReq.email);

    if (!verifyReq) {
      return res.status(500).json({
        error: "Failed to find email verification request",
      });
    }

    const valid =
      Date.now() < verifyReq.expiresAt.getTime() &&
      verifyReq.code === body.code;

    console.log("--> Email valid: ", valid);
    console.log(
      "--> Email NOT expiried: ",
      Date.now(),
      verifyReq.expiresAt.getTime(),
      Date.now() < verifyReq.expiresAt.getTime()
    );
    console.log(
      "--> Email codes: ",
      verifyReq.code,
      body.code,
      verifyReq.code === body.code
    );

    if (!valid) {
      return res.status(400).json({
        error: "Invalid email verification code",
      });
    }

    const [updatedUser] = await db
      .update(userTable)
      .set({ emailVerified: true })
      .where(eq(userTable.id, userId))
      .returning();

    if (!updatedUser) {
      return res.status(500).json({
        error: "Failed to update user",
      });
    }

    await deleteUserEmailVerificationRequest(updatedUser.id);

    await db.delete(sessionTable).where(eq(sessionTable.userId, userId));

    const { session, refreshCookie, accessJWT } = await createSession({
      userId: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      emailVerified: updatedUser.emailVerified,
    });

    if (!session) {
      return res.status(500).json({
        error: "Failed to create session",
      });
    }

    res.cookie(refreshCookie.name, refreshCookie.val, refreshCookie.options);
    res.cookie(EMAIL_VERIFICATION, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: -1, // Expire the cookie immediately
    });

    return res.status(200).json({
      accessToken: accessJWT,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("[ API ] Error verifying email:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
