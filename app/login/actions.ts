"use server";

import { redirect } from "next/navigation";
import { verifyLogin } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";

export type LoginState = { error?: string };

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  const admin = verifyLogin(username, password);
  if (!admin) {
    return { error: "Invalid username or password." };
  }

  await createSession(admin.id, admin.username);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}
