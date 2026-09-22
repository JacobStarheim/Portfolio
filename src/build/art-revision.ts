import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/** Build-time only. One revision keeps responsive art and its edge data in sync. */
export function createArtRevision(directory: string): string {
  const filenames = readdirSync(directory)
    .filter((name) => name.endsWith(".webp") || name === "thread-profiles.json")
    .sort();
  if (!filenames.includes("thread-profiles.json") || !filenames.some((name) => name.endsWith(".webp"))) {
    throw new Error("Artwork revision requires WebP artwork and thread-profiles.json.");
  }
  const manifest = filenames.map((name) => [
    name,
    createHash("sha256").update(readFileSync(path.join(directory, name))).digest("hex"),
  ]);
  return createHash("sha256").update(JSON.stringify(manifest)).digest("hex");
}
