import z from "zod";

import { Request, Response } from "express";

import { db, userTable } from "@dododo/db";
import { userProfileResponseSchema } from "@dododo/core";

export const getAuthenticatedUser = async (
  req: Request,
  res: Response<z.infer<typeof userProfileResponseSchema>>
) => {
  try {
    // const { email, password } = parsedBody.data;

    // console.log("==> Log in body password: ", parsedBody.data);
    const users = await db
      .select({
        id: userTable.id,
        email: userTable.email,
        username: userTable.username,
        firstName: userTable.firstName,
        lastName: userTable.lastName,
      })
      .from(userTable);

    console.log(">>> getAuthenticatedUser:", users);

    if (!users) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // console.log("==> Log in body user: ", user);

    // const validPassword = await verifyPasswordHash(user.hashPassword, password);

    // console.log("==> Log in body validPassword: ", validPassword);

    // if (!validPassword) {
    //   return res.status(400).json({
    //     error: "Invalid password",
    //   });
    // }

    // await db.delete(sessionTable).where(eq(sessionTable.userId, user.id));

    // const { session, refreshCookie, accessJWT } = await createSession({
    //   userId: user.id,
    //   email: user.email,
    //   username: user.username,
    //   emailVerified: user.emailVerified,
    // });

    // if (!session) {
    //   return res.status(500).json({
    //     error: "Failed to create session",
    //   });
    // }

    // res.cookie(refreshCookie.name, refreshCookie.val, refreshCookie.options);

    return res.status(200).json({
      user: {
        id: users[0].id,
        email: users[0].email,
        username: users[0].username,
        firstName: users[0].firstName || undefined,
        lastName: users[0].lastName || undefined,
      },
    });
  } catch (error) {
    console.error("[ API ] Error logging in:", error);

    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
