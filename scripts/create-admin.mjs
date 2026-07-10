// Seed an admin account.
// Usage: node scripts/create-admin.mjs <username> <password>

import path from "node:path";
import fs from "node:fs";
import process from "node:process";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const [, , username, password] = process.argv;

if (!username || !password) {
  console.error("Usage: node scripts/create-admin.mjs <username> <password>");
  process.exit(1);
}

const DATA_DIR = process.env.DB_DIR ?? path.join(process.cwd(), "data");
const DB_PATH = process.env.DB_PATH ?? path.join(DATA_DIR, "ctf.db");

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const passwordHash = bcrypt.hashSync(password, 12);

try {
  db.prepare(
    "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
  ).run(username, passwordHash);
  console.log(`Admin "${username}" created.`);
} catch (err) {
  if (String(err).includes("UNIQUE")) {
    db.prepare("UPDATE admins SET password_hash = ? WHERE username = ?").run(
      passwordHash,
      username,
    );
    console.log(`Admin "${username}" already existed — password updated.`);
  } else {
    console.error(err);
    process.exit(1);
  }
}

db.close();
