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

export const createUser = async (
  { body }: Request<unknown, unknown, z.infer<typeof createUserRequestBody>>,
  // res: Response
  res: Response<z.infer<typeof createUserResponseBody>>
) => {
  // TODO: Maybe implement request origin checking

  const passwordHash = await hashPassword(body.password);
  const recoveryCode = generateRandomRecoveryCode();
  const encryptedRecoveryCode = encryptString(recoveryCode);

  const newUserValues: z.infer<typeof insertUserTableSchema> = {
    email: body.email,
    username: body.username,
    passwordHash,
    recoveryCode: Buffer.from(encryptedRecoveryCode),
    emailVerified: false,
    firstName: body.firstName,
    lastName: body.lastName,
  };

  const [newUser] = await db
    .insert(userTable)
    .values(newUserValues)
    .returning()
    .onConflictDoNothing();

  console.log("query >>>", newUser);

  res.status(200).json(newUser);
};
