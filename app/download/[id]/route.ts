import fs from "node:fs/promises";
import path from "node:path";
import { getChallenge } from "@/lib/challenges";
import { UPLOAD_DIR } from "@/lib/db";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/download/[id]">,
) {
  const { id } = await ctx.params;
  const challenge = getChallenge(Number(id));
  if (!challenge) {
    return new Response("Not found", { status: 404 });
  }

  let data: Buffer;
  try {
    data = await fs.readFile(path.join(UPLOAD_DIR, challenge.stored_name));
  } catch {
    return new Response("File missing", { status: 404 });
  }

  // ASCII fallback + RFC 5987 UTF-8 name for the original filename.
  const asciiName = challenge.file_name
    .replace(/[^\x20-\x7e]/g, "_")
    .replace(/["\\]/g, "_");

  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(challenge.file_name)}`,
      "Content-Length": String(data.length),
    },
  });
}
