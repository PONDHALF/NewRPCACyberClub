import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { db, UPLOAD_DIR } from "./db";

export type Challenge = {
  id: number;
  name: string;
  file_name: string;
  stored_name: string;
  file_size: number | null;
  hint: string | null;
  created_at: string;
};

/** Make a filesystem-safe name for on-disk storage. */
function sanitizeFileName(name: string): string {
  const cleaned = name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/^_+/, "")
    .slice(0, 200);
  return cleaned || "file";
}

export function listChallenges(): Challenge[] {
  return db
    .prepare("SELECT * FROM challenges ORDER BY created_at DESC, id DESC")
    .all() as Challenge[];
}

export function getChallenge(id: number): Challenge | undefined {
  return db.prepare("SELECT * FROM challenges WHERE id = ?").get(id) as
    | Challenge
    | undefined;
}

export async function createChallenge(
  name: string,
  file: File,
  hint: string | null = null,
): Promise<Challenge> {
  // Insert first to obtain the id, then use it to build a collision-free path.
  const info = db
    .prepare(
      "INSERT INTO challenges (name, file_name, stored_name, file_size, hint) VALUES (?, ?, ?, ?, ?)",
    )
    .run(name, file.name, "", file.size, hint);
  const id = Number(info.lastInsertRowid);

  const storedName = `${id}__${sanitizeFileName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, storedName), buffer);

  db.prepare("UPDATE challenges SET stored_name = ? WHERE id = ?").run(
    storedName,
    id,
  );
  return getChallenge(id)!;
}

export function updateChallenge(
  id: number,
  name: string,
  hint: string | null,
): void {
  db.prepare("UPDATE challenges SET name = ?, hint = ? WHERE id = ?").run(
    name,
    hint,
    id,
  );
}

export async function deleteChallenge(id: number): Promise<void> {
  const challenge = getChallenge(id);
  if (!challenge) return;
  db.prepare("DELETE FROM challenges WHERE id = ?").run(id);
  try {
    await fs.unlink(path.join(UPLOAD_DIR, challenge.stored_name));
  } catch {
    // File already gone — nothing to clean up.
  }
}
