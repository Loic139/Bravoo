"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase-client";
import { detectLocale, t as translate, Locale } from "@/lib/i18n";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Star, Coins, Trophy } from "lucide-react";

interface Entry {
  username: string; stars: number; gold: number; rank: string;
}

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
      <div className="bg-white" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.push("/")}
            className="p-1.5 rounded-lg transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
          </button>
          <h1 className="text-[15px] font-bold">
            {tt("leaderboard.title")}
          </h1>
          <div className="w-8" />
        </div>
        <p className="text-center text-[11px] pb-2.5 font-medium" style={{ color: "var(--text-muted)" }}>
          {tt("leaderboard.monthly")} &mdash;{" "}
          {new Date().toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="px-4 mt-3">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--accent)" }} />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl" style={{ border: "1px solid var(--border)" }}>
            <Trophy className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
            <p className="font-bold text-sm">{tt("leaderboard.no_entries")}</p>
            <p className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>{tt("leaderboard.no_entries_sub")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => {
              const isMe = entry.username === me;
              const pos = index + 1;

              return (
                <motion.div
                  key={entry.username}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-3 bg-white rounded-xl p-3"
                  style={{
                    border: isMe ? "2px solid var(--accent)" : "1px solid var(--border)",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                    style={{
                      background: pos <= 3 ? "var(--accent)" : "var(--bg)",
                      color: pos <= 3 ? "white" : "var(--text-secondary)",
                    }}
                  >
                    {pos}
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ background: pos <= 3 ? "var(--star)" : "#D1D5DB" }}
                  >
                    {entry.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13px] truncate">
                      {entry.username}
                      {isMe && (
                        <span className="text-[10px] ml-1 font-semibold" style={{ color: "var(--accent)" }}>
                          {tt("leaderboard.you")}
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                      {tt(`rank.${entry.rank}`)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" style={{ color: "var(--star)", fill: "var(--star)" }} />
                      <span className="text-sm font-bold">{entry.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="w-3 h-3" style={{ color: "var(--gold)" }} />
                      <span className="text-[11px] font-semibold" style={{ color: "var(--gold)" }}>{entry.gold}</span>
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
