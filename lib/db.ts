import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = process.env.DB_DIR ?? path.join(process.cwd(), "data");
const DB_PATH = process.env.DB_PATH ?? path.join(DATA_DIR, "ctf.db");

/** Directory holding uploaded challenge files. */
export const UPLOAD_DIR =
  process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS admins (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS challenges (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  file_name   TEXT NOT NULL,
  stored_name TEXT NOT NULL,
  file_size   INTEGER,
  hint        TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

/** Add columns that may be missing on databases created by an older version. */
function migrate(database: Database.Database): void {
  const columns = database
    .prepare("PRAGMA table_info(challenges)")
    .all() as { name: string }[];
  if (!columns.some((c) => c.name === "hint")) {
    database.exec("ALTER TABLE challenges ADD COLUMN hint TEXT");
  }
}

function init(): Database.Database {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const database = new Database(DB_PATH);
  database.pragma("journal_mode = WAL");
  database.exec(SCHEMA);
  migrate(database);
  return database;
}

// Memoize on globalThis so the connection survives dev HMR / module reloads.
const globalForDb = globalThis as unknown as { __ctfDb?: Database.Database };
export const db = globalForDb.__ctfDb ?? (globalForDb.__ctfDb = init());
