"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase-client";
import { detectLocale, t as translate, Locale } from "@/lib/i18n";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Entry {
  username: string; stars: number; gold: number; rank: string;
}

const RANK_EMOJIS: Record<string, string> = {
  Bronze: "🥉", Silver: "🥈", Gold: "🥇", Platinum: "💎", Legend: "🏆",
};

export default function LeaderboardPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("en");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<string | null>(null);

  const tt = (key: string, params?: Record<string, string | number>) => translate(key, locale, params);

  useEffect(() => {
    setLocale(detectLocale());
    const u = auth.currentUser;
    if (u) setMe(u.displayName || u.email?.split("@")[0] || null);
    (async () => {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) setEntries((await res.json()).leaderboard);
      } catch { /* */ } finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="pb-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-xl transition-colors hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
        </button>
        <h1 className="text-lg font-extrabold" style={{ letterSpacing: "-0.02em" }}>
          {tt("leaderboard.title")}
        </h1>
        <div className="w-9" />
      </div>

      <p className="text-center text-xs mb-4 font-medium" style={{ color: "var(--text-muted)" }}>
        {tt("leaderboard.monthly")} &mdash;{" "}
        {new Date().toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { month: "long", year: "numeric" })}
      </p>

      <div className="px-5">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--text-muted)" }} />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border" style={{ background: "white", borderColor: "var(--border)" }}>
            <p className="text-4xl mb-3">🌟</p>
            <p className="font-bold text-sm">{tt("leaderboard.no_entries")}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{tt("leaderboard.no_entries_sub")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => {
              const isMe = entry.username === me;
              const pos = index + 1;
              const medal = pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : `#${pos}`;

              return (
                <motion.div
                  key={entry.username}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex items-center gap-3 rounded-2xl border p-3.5"
                  style={{
                    background: isMe ? "rgba(255,107,53,0.04)" : pos <= 3 ? "#FFFBEB" : "white",
                    borderColor: isMe ? "var(--accent)" : "var(--border)",
                    borderWidth: isMe ? 2 : 1,
                  }}
                >
                  <div className="text-lg w-8 text-center font-bold">{medal}</div>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ background: pos <= 3 ? "var(--accent)" : "#D1D5DB" }}
                  >
                    {entry.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {entry.username}
                      {isMe && (
                        <span className="text-[10px] ml-1.5 font-semibold" style={{ color: "var(--accent)" }}>
                          {tt("leaderboard.you")}
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                      {RANK_EMOJIS[entry.rank] || ""} {tt(`rank.${entry.rank}`)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-lg font-extrabold">{entry.stars}</span>
                      <span className="text-xs">⭐</span>
                    </div>
                    <div className="flex items-center gap-0.5 justify-end">
                      <span className="text-[10px]">🪙</span>
                      <span className="text-[10px] font-semibold" style={{ color: "var(--gold)" }}>{entry.gold}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
