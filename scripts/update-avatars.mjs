// Downloads each streamer's Twitch avatar and converts it to a local WebP
// file under public/avatars/, named after their handle. The app tries this
// local file first and falls back to the original Twitch CDN URL (still the
// source of truth in streamers.json) if it's missing, so this script is
// safe to run on a schedule without ever touching streamers.json - re-runs
// simply refresh the WebP from whatever Twitch is currently serving.
// Removes the static-cdn.jtvnw.net origin from the page's critical path and
// serves avatars as small, pre-optimized first-party assets instead of
// full-size PNG/JPEG fetched at runtime. Run by
// .github/workflows/update-avatars.yml.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const streamersPath = path.join(__dirname, "..", "src", "data", "streamers.json");
const avatarsDir = path.join(__dirname, "..", "public", "avatars");

mkdirSync(avatarsDir, { recursive: true });

const streamers = JSON.parse(readFileSync(streamersPath, "utf-8"));

let updated = 0;
let failed = 0;

for (const streamer of streamers) {
  try {
    const res = await fetch(streamer.avatar);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const bytes = new Uint8Array(await res.arrayBuffer());

    const sourcePath = path.join(tmpdir(), `${streamer.handle}-source`);
    const outputPath = path.join(avatarsDir, `${streamer.handle}.webp`);
    writeFileSync(sourcePath, bytes);
    execFileSync("cwebp", ["-quiet", "-q", "82", sourcePath, "-o", outputPath]);

    updated++;
  } catch (err) {
    console.warn(`Skipping ${streamer.handle}: ${err.message}`);
    failed++;
  }
}

console.log(`Converted ${updated} avatar(s), ${failed} failure(s), ${streamers.length} total.`);
