import { useMemo, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

// --- How to use --------------------------------------------------------------
// Drop this file into a React project. Tailwind + shadcn/ui + lucide-react should be available.
// Add or edit entries in the `STREAMERS` array. Only person streamers are included.
// Avatars auto-load from Twitch via unavatar.io; if unavailable, a DiceBear initials avatar is used.
// -----------------------------------------------------------------------------

// Utility to build a safe image URL with fallback
const fallbackAvatar = (name: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&radius=50&backgroundType=gradientLinear`;

interface Streamer {
  name: string;
  handle: string;
  tags: string[];
  avatar: string;
  description: string;
}

const STREAMERS: Streamer[] = [
  {
    name: "Leb1ga",
    handle: "leb1ga",
    tags: ["IRL", "Just Chatting", "CS2"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/8f2c9f02-17d4-4269-a629-00a72b1369c0-profile_image-70x70.png",
    description:
      "Ukrainian IRL and Just Chatting star; watch parties and CS2 moments with high-energy community.",
  },
  {
    name: "thetremba",
    handle: "thetremba",
    tags: ["IRL", "Just Chatting", "Variety"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/09213338-43a2-415f-af60-2cfbbe770d2b-profile_image-70x70.png",
    description:
      "Comedic IRL and Just Chatting streams, travel vlogs, and collabs across the Ukrainian scene.",
  },
  {
    name: "Ghostik",
    handle: "ghostik",
    tags: ["Dota 2", "Esports", "Charity"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/7dce1356-3943-41c9-bc9f-e5922756a1e3-profile_image-70x70.png",
    description:
      "Ex‑pro Dota 2 (TI Top‑8). Streams Dota, hosts charity drives, and chats with the community.",
  },
  {
    name: "Dobra_Divka",
    handle: "dobra_divka",
    tags: ["PUBG", "Variety", "Just Chatting"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/848a2696-f924-4baf-a872-e39a105602a5-profile_image-70x70.png",
    description:
      "Popular Ukrainian creator known for PUBG and variety streams with a welcoming vibe.",
  },
  {
    name: "luma_rum",
    handle: "luma_rum",
    tags: ["VTuber", "Cozy", "Variety"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/f9d30272-6dac-4fd7-b5cc-75af355fe347-profile_image-70x70.png",
    description:
      "Ukrainian VTuber focusing on cozy variety streams and community events.",
  },
  {
    name: "Leniniw",
    handle: "leniniw",
    tags: ["CS2", "Analysis", "Esports"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/1385a9e7-b817-4aaa-b4c8-f07b4fce99af-profile_image-70x70.png",
    description:
      "Counter‑Strike streams, analysis, and community watch‑alongs in Ukrainian.",
  },
  {
    name: "ceh9",
    handle: "ceh9",
    tags: ["CS", "Esports", "Talk"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/b9762920-b057-49b2-8287-5f0b0ffa1b61-profile_image-70x70.png",
    description:
      "Former CS pro sharing gameplay, stories from the scene, and talk‑style streams.",
  },
  {
    name: "Solodana",
    handle: "solodana",
    tags: ["Valorant", "Variety"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/7ae35270-113a-494d-b055-b2cc7cede917-profile_image-70x70.png",
    description:
      "Shooter‑focused creator (Valorant) with occasional variety.",
  },
  {
    name: "MrLABR",
    handle: "mrlabr",
    tags: ["Shooters", "Variety", "Just Chatting"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/44d157fe-11df-409b-85f7-31d815cf6671-profile_image-70x70.png",
    description:
      "FPS‑leaning variety with chatty, community‑driven streams.",
  },
  {
    name: "Skevich_",
    handle: "skevich_",
    tags: ["Variety", "Clips", "Chat"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/81b714c5-7952-46ef-bf7c-f1d7a20022b1-profile_image-70x70.png",
    description:
      "Variety content, clips, and chat‑first streams in Ukrainian.",
  },
  {
    name: "Pragen_UA",
    handle: "pragen_ua",
    tags: ["Variety", "Just Chatting"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/991f5a4f-2992-4434-b94b-7a0eac24ccba-profile_image-70x70.png",
    description:
      "Variety and Just Chatting with a focus on Ukrainian community culture.",
  },
  {
    name: "TaiTake",
    handle: "taitake",
    tags: ["Variety", "IRL"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/b0f04cc8-283a-4494-acf9-034f28272cea-profile_image-70x70.png",
    description:
      "Early Ukrainian‑language variety/IRL streamer; community‑centric content.",
  },
  {
    name: "ivonyak",
    handle: "ivonyak",
    tags: ["Variety", "Talk"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/9f6ca44a-6445-4445-a469-73919586abc2-profile_image-70x70.png",
    description:
      "Variety and conversational streams with topical discussions.",
  },
  {
    name: "Kolento",
    handle: "kolento",
    tags: ["Hearthstone", "Card Games"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/kolento-profile_image-b750c756ada12684-70x70.jpeg",
    description:
      "Legendary Hearthstone player from Ukraine; strategy, arena runs, and card game variety.",
  },
  {
    name: "OTOYSOUNDS",
    handle: "otoysounds",
    tags: ["Music", "Beatmaking", "IRL"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/4612231e-dcb5-42d1-951f-d5aba17d6669-profile_image-70x70.png",
    description:
      "Music production and beatmaking sessions, plus IRL collabs with Ukrainian creators.",
  },
  {
    name: "PotatooElf",
    handle: "potatooelf",
    tags: ["Variety", "Cozy"],
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/44e1c0f5-5ab0-49c6-b829-9420170cda24-profile_image-70x70.png",
    description:
      "Comfy variety streams, artful vibes, and chat‑driven segments.",
  },
];

const TAGS = Array.from(
  STREAMERS.reduce((s, x) => {
    x.tags.forEach((t) => s.add(t));
    return s;
  }, new Set<string>())
).sort();

export default function UkrainianStreamersDirectory() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STREAMERS.filter((s) => {
      const matchesQuery = !q ||
        s.name.toLowerCase().includes(q) ||
        s.handle.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));
      const matchesTags = activeTags.length === 0 || activeTags.every((t) => s.tags.includes(t));
      return matchesQuery && matchesTags;
    });
  }, [query, activeTags]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Ukrainian Twitch Streamers</h1>
            <p className="text-slate-600">Only person streamers. Search, filter, and click through to Twitch profiles.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="Search by name, tag, or description"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm text-slate-600">Filter by tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <Badge
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`cursor-pointer select-none transition ${
                  activeTags.includes(tag)
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tag}
              </Badge>
            ))}
            {activeTags.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setActiveTags([])}>
                Clear
              </Button>
            )}
          </div>
        </section>

        <main className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((s, idx) => (
            <div
              key={s.handle}
              className="opacity-0 animate-fadeIn"
              style={{animationDelay: `${idx * 20}ms`, animationFillMode: 'forwards'}}
            >
              <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={s.avatar}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = fallbackAvatar(s.name);
                      }}
                      alt={`${s.name} avatar`}
                      className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{s.name}</h3>
                      <p className="text-xs text-slate-500 truncate ">@{s.handle}</p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-700 line-clamp-3 h-[60px] leading-5">{s.description}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4">
                    <a href={`https://twitch.tv/${s.handle}`} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View on Twitch
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </main>

        <footer className="mt-10 text-xs text-slate-500">Made with ❤️ by Copilot.</footer>
      </div>
    </div>
  );
}
