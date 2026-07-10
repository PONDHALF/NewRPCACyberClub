import { SignJWT, jwtVerify } from "jose";

// Edge-safe module: pure `jose`, no Node APIs and no `server-only` import, so it
// can be used from both Server Actions/Components and `proxy.ts` (Edge runtime).

export const SESSION_COOKIE = "ctf_session";

export type SessionPayload = {
  adminId: number;
  username: string;
};

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set. Add it to .env.local.");
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.adminId !== "number" || typeof payload.username !== "string") {
      return null;
    }
    return { adminId: payload.adminId, username: payload.username };
  } catch {
    return null;
  }
}
