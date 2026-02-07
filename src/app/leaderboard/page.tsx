"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase-client";
import { detectLocale, t as translate, Locale } from "@/lib/i18n";

interface LeaderboardEntry {
  username: string;
  stars: number;
  gold: number;
  rank: string;
}

const RANK_EMOJIS: Record<string, string> = {
  Bronze: "🥉",
  Silver: "🥈",
  Gold: "🥇",
  Platinum: "💎",
  Legend: "🏆",
};

export default function LeaderboardPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("en");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDisplayName, setCurrentDisplayName] = useState<string | null>(null);

  const tt = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);

  useEffect(() => {
    setLocale(detectLocale());
    const user = auth.currentUser;
    if (user) {
      setCurrentDisplayName(user.displayName || user.email?.split("@")[0] || null);
    }

    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) {
          const data = await res.json();
          setEntries(data.leaderboard);
        }
      } catch {
        // Network error
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="pb-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={() => router.push("/")}
          className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: "var(--color-text-secondary)", background: "var(--color-bg)" }}
        >
          &larr; {tt("leaderboard.back")}
        </button>
        <h1 className="text-lg font-extrabold" style={{ color: "var(--color-text)", letterSpacing: "-0.02em" }}>
          {tt("leaderboard.title")}
        </h1>
        <div className="w-16" />
      </div>

      <p className="text-center text-xs mb-4 font-medium" style={{ color: "var(--color-text-muted)" }}>
        {tt("leaderboard.monthly")} &mdash;{" "}
        {new Date().toLocaleString(locale === "fr" ? "fr-FR" : "en-US", {
          month: "long",
          year: "numeric",
        })}
      </p>

      <div className="px-5">
        {loading ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4 animate-pulse-gentle">🏆</div>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{tt("app.loading")}</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 card">
            <p className="text-4xl mb-3">🌟</p>
            <p className="font-bold text-sm" style={{ color: "var(--color-text)" }}>{tt("leaderboard.no_entries")}</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
              {tt("leaderboard.no_entries_sub")}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => {
              const isCurrentUser = entry.username === currentDisplayName;
              const position = index + 1;
              const positionDisplay =
                position === 1
                  ? "🥇"
                  : position === 2
                    ? "🥈"
                    : position === 3
                      ? "🥉"
                      : `#${position}`;

              return (
                <div
                  key={entry.username}
                  className="card flex items-center gap-3"
                  style={{
                    padding: "0.875rem 1.25rem",
                    ...(isCurrentUser
                      ? {
                          border: "2px solid var(--color-accent)",
                          background: "rgba(255, 107, 53, 0.04)",
                        }
                      : {}),
                    ...(position <= 3 && !isCurrentUser
                      ? { background: "#FFFBEB" }
                      : {}),
                  }}
                >
                  <div className="text-lg w-8 text-center font-bold">
                    {positionDisplay}
                  </div>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ background: position <= 3 ? "var(--color-accent)" : "#D1D5DB" }}
                  >
                    {entry.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--color-text)" }}>
                      {entry.username}
                      {isCurrentUser && (
                        <span
                          className="text-[10px] ml-1.5 font-semibold"
                          style={{ color: "var(--color-accent)" }}
                        >
                          {tt("leaderboard.you")}
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] font-medium" style={{ color: "var(--color-text-muted)" }}>
                      {RANK_EMOJIS[entry.rank] || ""} {tt(`rank.${entry.rank}`)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-lg font-extrabold" style={{ color: "var(--color-text)" }}>
                        {entry.stars}
                      </span>
                      <span className="text-xs">⭐</span>
                    </div>
                    <div className="flex items-center gap-0.5 justify-end">
                      <span className="text-[10px]">🪙</span>
                      <span className="text-[10px] font-semibold" style={{ color: "var(--color-gold)" }}>
                        {entry.gold}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
