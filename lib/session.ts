import "server-only";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  signToken,
  verifyToken,
  type SessionPayload,
} from "./session-token";

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days, matches the JWT expiry.

export async function createSession(
  adminId: number,
  username: string,
): Promise<void> {
  const token = await signToken({ adminId, username });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // Secure cookies require HTTPS. Set COOKIE_INSECURE=1 when serving over
    // plain HTTP (e.g. a bare-IP deployment) so the session cookie still sticks.
    secure:
      process.env.NODE_ENV === "production" &&
      process.env.COOKIE_INSECURE !== "1",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
