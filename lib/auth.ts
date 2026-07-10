import "server-only";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "./db";
import { getSession } from "./session";
import type { SessionPayload } from "./session-token";

type AdminRow = {
  id: number;
  username: string;
  password_hash: string;
};

/** Returns the admin if the credentials are valid, otherwise null. */
export function verifyLogin(
  username: string,
  password: string,
): { id: number; username: string } | null {
  const row = db
    .prepare("SELECT id, username, password_hash FROM admins WHERE username = ?")
    .get(username) as AdminRow | undefined;
  if (!row) return null;
  if (!bcrypt.compareSync(password, row.password_hash)) return null;
  return { id: row.id, username: row.username };
}

/** Guards admin-only server actions and pages. Redirects to /login if unauthenticated. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}
