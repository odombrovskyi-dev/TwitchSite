import { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import streamersData from "./data/streamers.json";

const LIVE_STATUS_URL =
  "https://raw.githubusercontent.com/odombrovskyi-dev/TwitchSite/main/public/live-status.json";
const LIVE_STATUS_POLL_INTERVAL_MS = 60_000;

// Pre-optimized local copy of the streamer's Twitch avatar (refreshed daily
// by scripts/update-avatars.mjs). Falls back to the original Twitch CDN URL,
// then to a generated placeholder, if it's missing or fails to load.
const localAvatar = (handle: string) => `/avatars/${handle}.webp`;

const fallbackAvatar = (name: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&radius=50&backgroundType=gradientLinear`;

// Utility to shuffle array randomly
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

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
    "Poland": "🇵🇱",
    "Italy": "🇮🇹",
    "Mexico": "🇲🇽",
  };
  return flags[country] || "🌍";
};

const STREAMERS: Streamer[] = streamersData;

export default function StreamersDirectory() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activeCountries, setActiveCountries] = useState<string[]>([]);
  const [liveHandles, setLiveHandles] = useState<Set<string>>(new Set());
  const [onlyLive, setOnlyLive] = useState(false);

  // Initialize search from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setQuery(decodeURIComponent(searchParam));
    }
  }, []);

  // Poll live status (updated out-of-band by a scheduled GitHub Action)
  useEffect(() => {
    let cancelled = false;

    const fetchLiveStatus = async () => {
      try {
        const res = await fetch(`${LIVE_STATUS_URL}?t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data.live)) {
          setLiveHandles(new Set(data.live));
        }
      } catch {
        // Live status is a nice-to-have overlay; ignore failures silently.
      }
    };

    // Defer the initial fetch slightly so it doesn't compete with the
    // JS/CSS bundle for bandwidth during the most contended part of the
    // initial load. A short timeout (well before typical LCP) keeps the
    // "Live now" badges from visibly lagging for real users.
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;
    if (typeof window.requestIdleCallback === "function") {
      idleHandle = window.requestIdleCallback(fetchLiveStatus, { timeout: 1500 });
    } else {
      timeoutHandle = window.setTimeout(fetchLiveStatus, 500);
    }

    const interval = setInterval(fetchLiveStatus, LIVE_STATUS_POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
    };
  }, []);

  // Update URL when search changes
  const updateSearchParam = (newQuery: string) => {
    setQuery(newQuery);
    const url = new URL(window.location.href);
    if (newQuery.trim()) {
      url.searchParams.set('search', encodeURIComponent(newQuery));
    } else {
      url.searchParams.delete('search');
    }
    // Update URL without page reload
    window.history.replaceState({}, '', url.toString());
  };

  // Create a shuffled version of streamers on component mount, but not if search param is present
  const shuffledStreamers = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasSearchParam = urlParams.has('search');
    return hasSearchParam ? STREAMERS : shuffleArray(STREAMERS);
  }, []);

  const allTags = useMemo(() => [...new Set(shuffledStreamers.flatMap((s) => s.tags))].sort(), [shuffledStreamers]);
  const allCountries = useMemo(() => [...new Set(shuffledStreamers.map((s) => s.country))].sort(), [shuffledStreamers]);
  const liveCount = useMemo(
    () => shuffledStreamers.filter((s) => liveHandles.has(s.handle)).length,
    [shuffledStreamers, liveHandles]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shuffledStreamers.filter((s) => {
      const matchesQuery = !q ||
        s.name.toLowerCase().includes(q) ||
        s.handle.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));
      const matchesTags = activeTags.length === 0 || activeTags.every((t) => s.tags.includes(t));
      const matchesCountries = activeCountries.length === 0 || activeCountries.includes(s.country);
      const matchesLive = !onlyLive || liveHandles.has(s.handle);
      return matchesQuery && matchesTags && matchesCountries && matchesLive;
    });
  }, [query, activeTags, activeCountries, onlyLive, liveHandles, shuffledStreamers]);

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
        <h1>Global Twitch Streamers Directory - Discover International Content Creators</h1>
        <h2>Find the Best Streamers from Around the World</h2>
        <p>Discover the best Twitch streamers from around the world including gaming, IRL, esports, VTubers, and variety content creators. Search and filter through our comprehensive international streaming community directory featuring creators from Ukraine, Spain, Germany, France, Brazil, Japan, South Korea, Sweden, USA, Canada, and the United Kingdom.</p>
        <p>Our global directory includes popular streamers like Leb1ga, Ghostik, TheGrefg, ElRubius, MontanaBlack88, Kameto, Cellbit, Gaules, Kuzuha, Faker, Shroud, Pokimane, and many more international content creators.</p>
        <ul>
          <li>Gaming streamers from every continent</li>
          <li>VTubers and virtual content creators</li>
          <li>Esports professionals and pro gamers</li>
          <li>IRL and Just Chatting streamers</li>
          <li>Variety content creators</li>
          <li>International streaming community</li>
        </ul>
        <p>Filter by tags: Gaming, Esports, VTuber, Just Chatting, IRL, Variety, CS2, Dota 2, League of Legends, Minecraft, Valorant, Entertainment, and more.</p>
        <p>Browse by countries: Ukraine, Spain, Germany, France, Brazil, Japan, South Korea, Sweden, Canada, USA, United Kingdom, and other nations.</p>
      </div>
      
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 p-6">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" role="banner">
            <div itemScope itemType="https://schema.org/WebSite">
              <h1 className="text-3xl font-bold" itemProp="name">Global Streamers 🌍</h1>
              <p className="text-slate-600" itemProp="description">Discover amazing streamers from around the world. Search, filter, and explore diverse content creators.</p>
              <meta itemProp="url" content="https://the-streamers.com/" />
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
                  onChange={(e) => updateSearchParam(e.target.value)}
                  aria-label="Search global Twitch streamers"
                />
              </div>
            </div>
          </header>

          <nav className="mb-6 space-y-4" aria-label="Filter streamers">
            {/* Live Filter */}
            <div>
              <Badge
                onClick={() => setOnlyLive((v) => !v)}
                aria-pressed={onlyLive}
                className={`cursor-pointer select-none transition ${
                  onlyLive
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🔴 Live now {liveCount > 0 && `(${liveCount})`}
              </Badge>
            </div>

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
            {(activeTags.length > 0 || activeCountries.length > 0 || onlyLive) && (
              <div className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveTags([]);
                    setActiveCountries([]);
                    setOnlyLive(false);
                  }}
                  aria-label="Clear all filters"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </nav>

          <main className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="main" aria-label="Global Twitch streamers directory">
            <h2 className="sr-only">Streamer directory</h2>
            {filtered.map((s, idx) => (
              <article
                key={s.handle}
                className="opacity-0 animate-fadeIn"
                style={{animationDelay: `${idx * 20}ms`, animationFillMode: 'forwards'}}
                itemScope
                itemType="https://schema.org/Person"
              >
              <meta itemProp="jobTitle" content="Content Creator" />
              <meta itemProp="nationality" content={s.country} />
              <meta itemProp="url" content={`https://twitch.tv/${s.handle}`} />
              <meta itemProp="sameAs" content={`https://twitch.tv/${s.handle}`} />
              <div itemProp="mainEntityOfPage" itemScope itemType="https://schema.org/WebPage">
                <meta itemProp="url" content={`https://twitch.tv/${s.handle}`} />
              </div>
              <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={localAvatar(s.handle)}
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          // Local WebP missing (not converted yet) -> try the
                          // original Twitch CDN URL -> generated placeholder.
                          if (img.src.endsWith(".webp")) {
                            img.src = s.avatar;
                          } else {
                            img.src = fallbackAvatar(s.name);
                          }
                        }}
                        alt={`${s.name} avatar`}
                        className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200"
                        loading="lazy"
                        itemProp="image"
                      />
                      {liveHandles.has(s.handle) && (
                        <span
                          className="absolute -bottom-1 -right-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white ring-2 ring-white"
                          title="Live now on Twitch"
                        >
                          Live
                        </span>
                      )}
                    </div>
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

                  <div className="mt-3 flex flex-wrap gap-1.5" itemProp="keywords">
                    {s.tags.map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700" itemProp="about" itemScope itemType="https://schema.org/Thing">
                        <meta itemProp="name" content={t} />
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
            <span>Total streamers: {shuffledStreamers.length}</span>
            {filtered.length !== shuffledStreamers.length && (
              <span> • Found: {filtered.length}</span>
            )}
          </p>
        </footer>
      </div>
    </div>
    </>
  );
}
