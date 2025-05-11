import { z } from "zod";
import { encodeBase32 } from "@oslojs/encoding";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { Resource } from "sst";
import { render } from "jsx-email";

import {
  db,
  emailVerificationRequestTable,
  eq,
  selectEmailVerificationRequestTableSchema,
} from "@dododo/db";

import { generateRandomOTP } from "./general";
import { EMAIL_VERIFICATION_EXPIRATION_SECONDS } from "@/const";
import { Template } from "@/emailTemplates/confirmationCode";

const client = new SESv2Client();

export type TEmailVerificationRequest = z.infer<
  typeof selectEmailVerificationRequestTableSchema
>;

export async function createEmailVerificationRequest(
  userId: string,
  email: string
): Promise<TEmailVerificationRequest> {
  await deleteUserEmailVerificationRequest(userId);

  const idBytes = new Uint8Array(20);
  crypto.getRandomValues(idBytes);
  const id = encodeBase32(idBytes).toLowerCase();

  const code = generateRandomOTP();
  const expiresAt = new Date(
    Date.now() + EMAIL_VERIFICATION_EXPIRATION_SECONDS * 1000
  );

  const [emailReq] = await db
    .insert(emailVerificationRequestTable)
    .values({
      id,
      userId,
      code,
      email,
      expiresAt,
    })
    .returning();

  console.log(
    "[ API ] Created email verification request:",
    emailReq.id.substring(0, 4)
  );

  return emailReq;
}

export async function deleteUserEmailVerificationRequest(
  userId: string
): Promise<void> {
  const [emailReq] = await db
    .delete(emailVerificationRequestTable)
    .where(eq(emailVerificationRequestTable.userId, userId))
    .returning();

  if (emailReq) {
    console.log("[ API ] Deleted email verification request:", emailReq);
  }
}

export const sendVerificationEmail = async (email: string, code: string) => {
  console.log(`[ API ] To ${email}: Your verification code is ${code}`);
  console.log(
    `[ API ] Sending email to ${email} from ${Resource.DododoEmail.sender}`
  );

  await client.send(
    new SendEmailCommand({
      FromEmailAddress: Resource.DododoEmail.sender,
      Destination: {
        ToAddresses: [email],
      },
      Content: {
        Simple: {
          Subject: {
            Data: "Dododo registration",
          },
          Body: {
            Html: {
              Data: await render(
                Template({
                  code,
                })
              ),
            },
          },
        },
      },
    })
  );
};
