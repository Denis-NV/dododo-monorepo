import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { z } from "zod";
import { db, selectSessionTableSchema, sessionTable } from "@dododo/db";
import { REFRESH_TOKEN_EXPIRATION_SECONDS } from "@/const";

export type Session = z.infer<typeof selectSessionTableSchema>;

export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
  return token;
}

export async function createSession(
  token: string,
  userId: string
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

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
