import { useMemo, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

// Utility to build a safe image URL with fallback
const fallbackAvatar = (name: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&radius=50&backgroundType=gradientLinear`;

interface Streamer {
  name: string;
  handle: string;
  tags: string[];
  country: string;
  avatar: string;
  description: string;
}

const getCountryFlag = (country: string): string => {
  const flags: Record<string, string> = {
    "Ukraine": "🇺🇦",
    "Spain": "🇪🇸",
    "Germany": "🇩🇪",
    "France": "🇫🇷",
    "Brazil": "🇧🇷",
    "Japan": "🇯🇵",
    "South Korea": "🇰🇷",
    "Sweden": "🇸🇪",
    "Canada": "🇨🇦",
    "USA": "🇺🇸",
    "United Kingdom": "🇬🇧",
  };
  return flags[country] || "🌍";
};

const STREAMERS: Streamer[] = [
  // Ukrainian Streamers
  {
    name: "Leb1ga",
    handle: "leb1ga",
    tags: ["IRL", "Just Chatting", "CS2"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/8f2c9f02-17d4-4269-a629-00a72b1369c0-profile_image-70x70.png",
    description:
      "Ukrainian IRL and Just Chatting star; watch parties and CS2 moments with high-energy community.",
  },
  {
    name: "thetremba",
    handle: "thetremba",
    tags: ["IRL", "Just Chatting", "Variety"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/09213338-43a2-415f-af60-2cfbbe770d2b-profile_image-70x70.png",
    description:
      "Comedic IRL and Just Chatting streams, travel vlogs, and collabs across the Ukrainian scene.",
  },
  {
    name: "Ghostik",
    handle: "ghostik",
    tags: ["Dota 2", "Esports", "Charity"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/7dce1356-3943-41c9-bc9f-e5922756a1e3-profile_image-70x70.png",
    description:
      "Ex‑pro Dota 2 (TI Top‑8). Streams Dota, hosts charity drives, and chats with the community.",
  },
  {
    name: "Dobra_Divka",
    handle: "dobra_divka",
    tags: ["PUBG", "Variety", "Just Chatting"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/848a2696-f924-4baf-a872-e39a105602a5-profile_image-70x70.png",
    description:
      "Popular Ukrainian creator known for PUBG and variety streams with a welcoming vibe.",
  },
  {
    name: "luma_rum",
    handle: "luma_rum",
    tags: ["VTuber", "Cozy", "Variety"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/f9d30272-6dac-4fd7-b5cc-75af355fe347-profile_image-70x70.png",
    description:
      "Ukrainian VTuber focusing on cozy variety streams and community events.",
  },
  {
    name: "Leniniw",
    handle: "leniniw",
    tags: ["CS2", "Analysis", "Esports"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/1385a9e7-b817-4aaa-b4c8-f07b4fce99af-profile_image-70x70.png",
    description:
      "Counter‑Strike streams, analysis, and community watch‑alongs in Ukrainian.",
  },
  {
    name: "ceh9",
    handle: "ceh9",
    tags: ["CS", "Esports", "Talk"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/b9762920-b057-49b2-8287-5f0b0ffa1b61-profile_image-70x70.png",
    description:
      "Former CS pro sharing gameplay, stories from the scene, and talk‑style streams.",
  },
  {
    name: "Solodana",
    handle: "solodana",
    tags: ["Valorant", "Variety"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/7ae35270-113a-494d-b055-b2cc7cede917-profile_image-70x70.png",
    description:
      "Shooter‑focused creator (Valorant) with occasional variety.",
  },
  {
    name: "MrLABR",
    handle: "mrlabr",
    tags: ["Shooters", "Variety", "Just Chatting"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/44d157fe-11df-409b-85f7-31d815cf6671-profile_image-70x70.png",
    description:
      "FPS‑leaning variety with chatty, community‑driven streams.",
  },
  {
    name: "Skevich_",
    handle: "skevich_",
    tags: ["Variety", "Clips", "Chat"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/81b714c5-7952-46ef-bf7c-f1d7a20022b1-profile_image-70x70.png",
    description:
      "Variety content, clips, and chat‑first streams in Ukrainian.",
  },
  {
    name: "Pragen_UA",
    handle: "pragen_ua",
    tags: ["Variety", "Just Chatting"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/991f5a4f-2992-4434-b94b-7a0eac24ccba-profile_image-70x70.png",
    description:
      "Variety and Just Chatting with a focus on Ukrainian community culture.",
  },
  {
    name: "TaiTake",
    handle: "taitake",
    tags: ["Variety", "IRL"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/b0f04cc8-283a-4494-acf9-034f28272cea-profile_image-70x70.png",
    description:
      "Early Ukrainian‑language variety/IRL streamer; community‑centric content.",
  },
  {
    name: "ivonyak",
    handle: "ivonyak",
    tags: ["Variety", "Talk"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/9f6ca44a-6445-4445-a469-73919586abc2-profile_image-70x70.png",
    description:
      "Variety and conversational streams with topical discussions.",
  },
  {
    name: "Kolento",
    handle: "kolento",
    tags: ["Hearthstone", "Card Games"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/kolento-profile_image-b750c756ada12684-70x70.jpeg",
    description:
      "Legendary Hearthstone player from Ukraine; strategy, arena runs, and card game variety.",
  },
  {
    name: "OTOYSOUNDS",
    handle: "otoysounds",
    tags: ["Music", "Beatmaking", "IRL"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/4612231e-dcb5-42d1-951f-d5aba17d6669-profile_image-70x70.png",
    description:
      "Music production and beatmaking sessions, plus IRL collabs with Ukrainian creators.",
  },
  {
    name: "PotatooElf",
    handle: "potatooelf",
    tags: ["Variety", "Cozy"],
    country: "Ukraine",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/44e1c0f5-5ab0-49c6-b829-9420170cda24-profile_image-70x70.png",
    description:
      "Comfy variety streams, artful vibes, and chat‑driven segments.",
  },
  // Spanish Streamers
  {
    name: "TheGrefg",
    handle: "thegrefg",
    tags: ["Variety", "Gaming", "Entertainment"],
    country: "Spain",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/thegrefg-profile_image-1dcf8a83b8c3a13a-70x70.png",
    description:
      "Spanish gaming sensation with massive audience. Variety gaming content and entertainment.",
  },
  {
    name: "ElRubius",
    handle: "elrubius",
    tags: ["Variety", "Gaming", "Just Chatting"],
    country: "Spain",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/elrubius-profile_image-060d6765a40ab676-70x70.png",
    description:
      "Popular Spanish content creator known for variety gaming and entertaining chat interactions.",
  },
  
  // German Streamers
  {
    name: "MontanaBlack88",
    handle: "montanablack88",
    tags: ["Variety", "Just Chatting", "Gaming"],
    country: "Germany",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/montanablack88-profile_image-7d0c4ae5b18a4c9e-70x70.png",
    description:
      "Germany's top streamer with variety content ranging from gaming to lifestyle discussions.",
  },
  {
    name: "Knossi",
    handle: "knossi",
    tags: ["Entertainment", "Gaming", "Variety"],
    country: "Germany",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/knossi-profile_image-665bb6b6b04c0e6c-70x70.png",
    description:
      "Entertaining German streamer known for his energetic personality and diverse content.",
  },
  
  // French Streamers
  {
    name: "Kameto",
    handle: "kameto",
    tags: ["Esports", "League of Legends", "Entertainment"],
    country: "France",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/kameto-profile_image-8d5d5da4b7d4b4e3-70x70.png",
    description:
      "French esports personality and content creator focused on League of Legends and entertainment.",
  },
  {
    name: "Squeezie",
    handle: "squeezie",
    tags: ["Gaming", "Variety", "Entertainment"],
    country: "France",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/squeezie-profile_image-4d5b6c7a8e9f0123-70x70.png",
    description:
      "Popular French content creator with gaming and variety entertainment streams.",
  },
  
  // Brazilian Streamers
  {
    name: "Cellbit",
    handle: "cellbit",
    tags: ["Variety", "Gaming", "RPG"],
    country: "Brazil",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/cellbit-profile_image-1e2f3a4b5c6d7890-70x70.png",
    description:
      "Brazilian streamer known for variety gaming content, RPG sessions, and engaging storytelling.",
  },
  {
    name: "Gaules",
    handle: "gaules",
    tags: ["CS2", "Esports", "Analysis"],
    country: "Brazil",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/gaules-profile_image-f1e2d3c4b5a69870-70x70.png",
    description:
      "Legendary Brazilian CS commentator and streamer with expert game analysis and entertainment.",
  },
  
  // Japanese Streamers
  {
    name: "Kuzuha",
    handle: "kuzuha",
    tags: ["VTuber", "Gaming", "Variety"],
    country: "Japan",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/kuzuha-profile_image-9a8b7c6d5e4f3210-70x70.png",
    description:
      "Popular Japanese VTuber known for gaming content and entertaining variety streams.",
  },
  {
    name: "Shirakami Fubuki",
    handle: "shirakamifubuki",
    tags: ["VTuber", "Gaming", "Cozy"],
    country: "Japan",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/shirakamifubuki-profile_image-2b3c4d5e6f7a8901-70x70.png",
    description:
      "Hololive VTuber from Japan with cozy gaming streams and engaging chat interactions.",
  },
  
  // Korean Streamers
  {
    name: "Faker",
    handle: "faker",
    tags: ["League of Legends", "Esports", "Pro Gaming"],
    country: "South Korea",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/faker-profile_image-3c4d5e6f7a8b9012-70x70.png",
    description:
      "Legendary League of Legends pro player and world champion from South Korea.",
  },
  {
    name: "Lilpa",
    handle: "lilpa",
    tags: ["VTuber", "Gaming", "Variety"],
    country: "South Korea",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/lilpa-profile_image-4d5e6f7a8b9c0123-70x70.png",
    description:
      "Popular Korean VTuber known for entertaining gaming content and variety streams.",
  },
  
  // Nordic Streamers
  {
    name: "Anomaly",
    handle: "anomaly",
    tags: ["CS2", "Gaming", "Entertainment"],
    country: "Sweden",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/anomaly-profile_image-5e6f7a8b9c0d1234-70x70.png",
    description:
      "Swedish CS2 content creator known for entertaining gameplay and energetic personality.",
  },
  {
    name: "TheNorthernLion",
    handle: "northernlion",
    tags: ["Variety", "Indie Games", "Talk"],
    country: "Canada",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/northernlion-profile_image-6f7a8b9c0d1e2345-70x70.png",
    description:
      "Canadian variety streamer known for indie games, clever commentary, and talk shows.",
  },
  
  // US Streamers
  {
    name: "Shroud",
    handle: "shroud",
    tags: ["FPS", "Variety", "Pro Gaming"],
    country: "USA",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/shroud-profile_image-7a8b9c0d1e2f3456-70x70.png",
    description:
      "Former CS pro turned variety streamer, known for incredible FPS skills and chill vibes.",
  },
  {
    name: "Pokimane",
    handle: "pokimane",
    tags: ["Variety", "Just Chatting", "Gaming"],
    country: "USA",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/pokimane-profile_image-8b9c0d1e2f3a4567-70x70.png",
    description:
      "Popular variety streamer and content creator known for gaming and engaging chat interactions.",
  },
  
  // British Streamers
  {
    name: "TommyInnit",
    handle: "tommyinnit",
    tags: ["Minecraft", "Gaming", "Entertainment"],
    country: "United Kingdom",
    avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/tommyinnit-profile_image-9c0d1e2f3a4b5678-70x70.png",
    description:
      "Young British Minecraft content creator known for entertaining and energetic streams.",
  },
];


export default function StreamersDirectory() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activeCountries, setActiveCountries] = useState<string[]>([]);

  const allTags = useMemo(() => [...new Set(STREAMERS.flatMap((s) => s.tags))].sort(), []);
  const allCountries = useMemo(() => [...new Set(STREAMERS.map((s) => s.country))].sort(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STREAMERS.filter((s) => {
      const matchesQuery = !q ||
        s.name.toLowerCase().includes(q) ||
        s.handle.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));
      const matchesTags = activeTags.length === 0 || activeTags.every((t) => s.tags.includes(t));
      const matchesCountries = activeCountries.length === 0 || activeCountries.includes(s.country);
      return matchesQuery && matchesTags && matchesCountries;
    });
  }, [query, activeTags, activeCountries]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleCountry = (country: string) => {
    setActiveCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  return (
    <>
      {/* SEO Meta Tags for React */}
      <div style={{ display: 'none' }}>
        <h1>Global Twitch Streamers Directory</h1>
        <p>Discover the best Twitch streamers from around the world including gaming, IRL, esports, and variety content creators. Search and filter through international streaming community.</p>
      </div>
      
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 p-6">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Global Streamers 🌍</h1>
              <p className="text-slate-600">Discover amazing streamers from around the world. Search, filter, and explore diverse content creators.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  placeholder="Search by name, tag, or description"
                  className="pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search global Twitch streamers"
                />
              </div>
            </div>
          </header>

          <nav className="mb-6 space-y-4" aria-label="Filter streamers">
            {/* Tags Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-sm text-slate-600">Filter by tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
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
              </div>
            </div>

            {/* Countries Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🌍</span>
                <span className="text-sm text-slate-600">Filter by country</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allCountries.map((country) => (
                  <Badge
                    key={country}
                    onClick={() => toggleCountry(country)}
                    className={`cursor-pointer select-none transition ${
                      activeCountries.includes(country)
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {getCountryFlag(country)} {country}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(activeTags.length > 0 || activeCountries.length > 0) && (
              <div className="pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setActiveTags([]);
                    setActiveCountries([]);
                  }} 
                  aria-label="Clear all filters"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </nav>

          <main className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="main" aria-label="Global Twitch streamers directory">
            {filtered.map((s, idx) => (
              <article
                key={s.handle}
                className="opacity-0 animate-fadeIn"
                style={{animationDelay: `${idx * 20}ms`, animationFillMode: 'forwards'}}
                itemScope
                itemType="https://schema.org/Person"
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
                      itemProp="image"
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate" itemProp="name">{s.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="truncate" itemProp="alternateName">@{s.handle}</span>
                        <span className="text-sm" title={s.country}>
                          {getCountryFlag(s.country)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 h-[60px] overflow-hidden relative">
                    <p 
                      className="text-sm text-slate-700 leading-5 transition-all duration-300 hover:overflow-y-auto hover:h-full line-clamp-3"
                      title={s.description}
                      itemProp="description"
                      onMouseLeave={(e) => {
                        e.currentTarget.scrollTop = 0;
                      }}
                    >
                      {s.description}
                    </p>
                  </div>

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
            </article>
          ))}
        </main>

        <footer className="mt-10 text-xs text-slate-500" role="contentinfo">
          <p>Made with ❤️ using Copilot, 2025</p>
          <p className="mt-2">
            <span>Total streamers: {STREAMERS.length}</span>
            {filtered.length !== STREAMERS.length && (
              <span> • Found: {filtered.length}</span>
            )}
          </p>
        </footer>
      </div>
    </div>
    </>
  );
}
