import { Request, Response } from "express";
import { z } from "zod";

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
import { createSession } from "@/utils/session";
import { EMAIL_VERIFICATION_EXPIRATION_SECONDS } from "@/const";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";

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

    const session = await createSession(newUser.id);

    if (!session) {
      return res.status(500).json({
        error: "Failed to create session",
      });
    }

    const { accessCookie } = generateAccessToken({
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

    res.cookie("email_verification", emailVerificationRequest.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: EMAIL_VERIFICATION_EXPIRATION_SECONDS * 1000, // 10 minutes
    });

    res.cookie(accessCookie.name, accessCookie.val, accessCookie.options);
    res.cookie(refreshCookie.name, refreshCookie.val, refreshCookie.options);

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
