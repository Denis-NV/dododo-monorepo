import { Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { Resource } from "sst";

import {
  db,
  userTable,
  createUserRequestBody,
  createUserResponseBody,
  insertUserTableSchema,
} from "@dododo/db";

import { hashPassword } from "@/utils/password";
import { generateRandomRecoveryCode } from "@/utils/general";
import { encryptString } from "@/utils/encryption";
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
} from "@/utils/email-verification";
import { createSession, generateSessionToken } from "@/utils/session";
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  EMAIL_VERIFICATION_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
} from "@/const";

export const createUser = async (
  { body }: Request<unknown, unknown, z.infer<typeof createUserRequestBody>>,
  res: Response<z.infer<typeof createUserResponseBody>>
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

    const jwtPayload = {
      id: newUser.id,
      email: newUser.email,
    };

    const accessToken = jwt.sign(jwtPayload, Resource.AccessTokenSecret.value, {
      expiresIn: EMAIL_VERIFICATION_EXPIRATION_TIME,
    });

    const sessionToken = generateSessionToken();

    const refreshToken = jwt.sign(
      { ...jwtPayload, sessionToken },
      Resource.RefreshTokenSecret.value,
      {
        expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
      }
    );

    const session = await createSession(sessionToken, newUser.id);

    if (!session) {
      return res.status(500).json({
        error: "Failed to create session",
      });
    }

    res.cookie("email_verification", emailVerificationRequest.id, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "lax", // Prevent CSRF attacks
      path: "/", // Cookie is valid for the entire site
      maxAge: EMAIL_VERIFICATION_EXPIRATION_TIME, // 10 minutes
    });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_TOKEN_EXPIRATION_TIME, // 15 minutes
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME, // 30 days
    });

    // Return the created user
    return res.status(201).json({ data: newUser });
  } catch (error) {
    console.error("[ API ] Error creating user:", error);

    // Handle unexpected errors
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
