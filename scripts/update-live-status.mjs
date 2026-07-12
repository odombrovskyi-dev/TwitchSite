// Fetches current Twitch live status for every streamer in src/data/streamers.json
// and writes public/live-status.json. Run by .github/workflows/live-status.yml.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const streamersPath = path.join(__dirname, "..", "src", "data", "streamers.json");
const outputPath = path.join(__dirname, "..", "public", "live-status.json");

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET must be set");
  process.exit(1);
}

const streamers = JSON.parse(readFileSync(streamersPath, "utf-8"));
const handles = streamers.map((s) => s.handle);

async function getAppAccessToken() {
  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to get app access token: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function getLiveHandles(token) {
  const params = new URLSearchParams();
  for (const handle of handles) params.append("user_login", handle);

  const res = await fetch(`https://api.twitch.tv/helix/streams?${params.toString()}`, {
    headers: {
      "Client-Id": clientId,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to get streams: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.data.map((stream) => stream.user_login.toLowerCase());
}

const token = await getAppAccessToken();
const live = await getLiveHandles(token);

writeFileSync(
  outputPath,
  JSON.stringify({ updatedAt: new Date().toISOString(), live }, null, 2) + "\n"
);

console.log(`Wrote ${outputPath}: ${live.length} of ${handles.length} streamers live`);
