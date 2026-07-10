"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  createChallenge,
  deleteChallenge,
  renameChallenge,
} from "@/lib/challenges";

const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB

export type CreateState = { error?: string; ok?: boolean };

export async function createChallengeAction(
  _prevState: CreateState,
  formData: FormData,
): Promise<CreateState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const file = formData.get("file");

  if (!name) {
    return { error: "Challenge name is required." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "A file is required." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { error: "File is too large (max 50 MB)." };
  }

  await createChallenge(name, file);
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}

export async function renameChallengeAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (!Number.isInteger(id) || !name) return;

  renameChallenge(id, name);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteChallengeAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await deleteChallenge(id);
  revalidatePath("/admin");
  revalidatePath("/");
}
