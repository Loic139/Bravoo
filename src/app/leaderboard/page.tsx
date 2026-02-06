"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase-client";

interface LeaderboardEntry {
  username: string;
  stars: number;
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
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDisplayName, setCurrentDisplayName] = useState<string | null>(null);

  useEffect(() => {
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
    <div className="p-4 pb-8 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => router.push("/")}
          className="text-sm font-medium px-3 py-1 rounded-lg"
          style={{ color: "var(--color-text-muted)" }}
        >
          &larr; Back
        </button>
        <h1 className="text-xl font-black" style={{ color: "var(--color-primary)" }}>
          Leaderboard
        </h1>
        <div className="w-16" />
      </div>

      <p className="text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
        Monthly ranking &mdash;{" "}
        {new Date().toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </p>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 animate-pulse-gentle">🏆</div>
          <p style={{ color: "var(--color-text-muted)" }}>Loading...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-4xl mb-4">🌟</p>
          <p className="font-bold">No entries yet</p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Complete missions to appear here!
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
                  ...(isCurrentUser
                    ? {
                        border: "2px solid var(--color-primary)",
                        background: "rgba(255, 107, 53, 0.08)",
                      }
                    : {}),
                  ...(position <= 3
                    ? { background: "rgba(251, 191, 36, 0.08)" }
                    : {}),
                }}
              >
                <div className="text-xl w-10 text-center font-bold">
                  {positionDisplay}
                </div>
                <div className="flex-1">
                  <p className="font-bold">
                    {entry.username}
                    {isCurrentUser && (
                      <span
                        className="text-xs ml-2"
                        style={{ color: "var(--color-primary)" }}
                      >
                        (you)
                      </span>
                    )}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {RANK_EMOJIS[entry.rank] || ""} {entry.rank}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className="text-xl font-black"
                    style={{ color: "var(--color-star)" }}
                  >
                    {entry.stars}
                  </span>
                  <span className="text-xs ml-1" style={{ color: "var(--color-text-muted)" }}>
                    ⭐
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
