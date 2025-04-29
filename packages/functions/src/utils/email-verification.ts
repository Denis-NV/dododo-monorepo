import { encodeBase32 } from "@oslojs/encoding";
import {
  db,
  emailVerificationRequestTable,
  eq,
  selectEmailVerificationRequestTableSchema,
} from "@dododo/db";
// import { getCurrentSession } from "./session";
import { z } from "zod";

import { EMAIL_VERIFICATION_EXPIRATION_SECONDS } from "@/const";

import { generateRandomOTP } from "./general";

export type TEmailVerificationRequest = z.infer<
  typeof selectEmailVerificationRequestTableSchema
>;

// export function getUserEmailVerificationRequest(userId: number, id: string): TEmailVerificationRequest | null {
// 	const row = db.queryOne(
// 		"SELECT id, user_id, code, email, expires_at FROM email_verification_request WHERE id = ? AND user_id = ?",
// 		[id, userId]
// 	);
// 	if (row === null) {
// 		return row;
// 	}
// 	const request: TEmailVerificationRequest = {
// 		id: row.string(0),
// 		userId: row.number(1),
// 		code: row.string(2),
// 		email: row.string(3),
// 		expiresAt: new Date(row.number(4) * 1000)
// 	};
// 	return request;
// }

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

export function sendVerificationEmail(email: string, code: string): void {
  console.log(`[ API ] To ${email}: Your verification code is ${code}`);
}

// export function getUserEmailVerificationRequestFromRequest(): TEmailVerificationRequest | null {
// 	const { user } = getCurrentSession();
// 	if (user === null) {
// 		return null;
// 	}
// 	const id = cookies().get("email_verification")?.value ?? null;
// 	if (id === null) {
// 		return null;
// 	}
// 	const request = getUserEmailVerificationRequest(user.id, id);
// 	if (request === null) {
// 		deleteEmailVerificationRequestCookie();
// 	}
// 	return request;
// }
