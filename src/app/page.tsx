"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { detectLocale, t as translate, Locale } from "@/lib/i18n";
import { motion } from "framer-motion";
import { LogOut, Trophy, Star, Coins, CalendarDays, Loader2 } from "lucide-react";
import QuestCard from "@/components/QuestCard";
import EmptySlot from "@/components/EmptySlot";
import StarDisplay from "@/components/StarDisplay";
import RankBadge from "@/components/RankBadge";
import CompletionPopup from "@/components/CompletionPopup";
import { MAX_STARS } from "@/lib/ranks";

interface UserData {
  username: string; stars: number; gold: number; rank: string;
  rankEmoji: string; rankColor: string; remainingDays: number; starsToLegend: number;
}
interface QuestData {
  id: string; slot: number; type: "daily" | "weekly"; templateId: string;
  titleKey: string; descriptionKey: string; emoji: string;
  goldReward: number; completed: boolean; rerolled: boolean;
}
interface WeeklyProgress {
  weeklyCompleted: number; weeklyTotal: number;
  dailyCompleted: number; dailyTotal: number; starAwarded: boolean;
}

const MAX_SLOTS = 4;

export default function Dashboard() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("en");
  const [user, setUser] = useState<UserData | null>(null);
  const [quests, setQuests] = useState<QuestData[]>([]);
  const [progress, setProgress] = useState<WeeklyProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupGold, setPopupGold] = useState(0);
  const [popupStars, setPopupStars] = useState(0);
  const [idToken, setIdToken] = useState<string | null>(null);

  const tt = useCallback((key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params), [locale]);

  useEffect(() => { setLocale(detectLocale()); }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setIdToken(await u.getIdToken());
    });
    return () => unsub();
  }, [router]);

  const fetchData = useCallback(async () => {
    if (!idToken) return;
    try {
      const [userRes, questsRes] = await Promise.all([
        fetch("/api/user", { headers: { Authorization: `Bearer ${idToken}` } }),
        fetch("/api/quests", { headers: { Authorization: `Bearer ${idToken}` } }),
      ]);
      if (!userRes.ok || !questsRes.ok) { router.push("/login"); return; }
      const userData = await userRes.json();
      const questsData = await questsRes.json();
      setUser(userData);
      setQuests(questsData.quests || []);
      setProgress(questsData.progress || null);
    } catch { /* */ } finally { setLoading(false); }
  }, [idToken, router]);

  useEffect(() => { if (idToken) fetchData(); }, [idToken, fetchData]);

  async function handleComplete(questId: string) {
    if (!idToken) return;
    const res = await fetch("/api/quests/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ questId }),
    });
    if (res.ok) {
      const r = await res.json();
      setPopupGold(r.goldEarned); setPopupStars(r.stars); setShowPopup(true);
      await fetchData();
    }
  }

  async function handleReroll(questId: string) {
    if (!idToken) return;
    const res = await fetch("/api/quests/reroll", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ questId }),
    });
    if (res.ok) await fetchData();
  }

  async function handleLogout() {
    await signOut(auth);
    localStorage.removeItem("bravoo_uid");
    localStorage.removeItem("bravoo_username");
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--text-muted)" }} />
      </div>
    );
  }

  if (!user) return null;

  const slots: (QuestData | null)[] = Array.from({ length: MAX_SLOTS }, (_, i) =>
    quests.find((q) => q.slot === i) || null
  );
  const totalDone = (progress?.weeklyCompleted || 0) + (progress?.dailyCompleted || 0);
  const totalAll = (progress?.weeklyTotal || 0) + (progress?.dailyTotal || 0);
  const pct = totalAll > 0 ? (totalDone / totalAll) * 100 : 0;

  return (
    <div className="pb-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "var(--accent)" }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold">{user.username}</p>
            <RankBadge rank={tt(`rank.${user.rank}`)} emoji={user.rankEmoji} color={user.rankColor} />
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl transition-colors hover:bg-gray-100"
          title={tt("app.logout")}
        >
          <LogOut className="w-4.5 h-4.5" style={{ color: "var(--text-muted)" }} />
        </button>
      </div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3 px-5 mt-2 mb-4"
      >
        {[
          { icon: <Star className="w-4 h-4" style={{ color: "var(--star)" }} />, value: user.stars, label: tt("dashboard.stars_progress") },
          { icon: <Coins className="w-4 h-4" style={{ color: "var(--gold)" }} />, value: user.gold, label: tt("dashboard.gold") },
          { icon: <CalendarDays className="w-4 h-4" style={{ color: "var(--text-muted)" }} />, value: user.remainingDays, label: tt("dashboard.days_left") },
        ].map((s, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border"
            style={{ background: "white", borderColor: "var(--border)" }}
          >
            {s.icon}
            <span className="text-xl font-extrabold">{s.value}</span>
            <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Stars */}
      <div className="px-5 mb-4">
        <StarDisplay
          stars={user.stars} maxStars={MAX_STARS}
          starsLabel={`${user.stars} / ${MAX_STARS} ⭐`}
          goalText={tt("dashboard.stars_goal")}
          reachedText={tt("dashboard.stars_reached")}
          remainingText={tt("dashboard.stars_remaining", { count: MAX_STARS - user.stars })}
        />
      </div>

      {/* Progress bar */}
      {progress && (
        <div className="px-5 mb-5">
          <div className="rounded-2xl p-4 border" style={{ background: "white", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                {tt("quests.weekly_progress", { completed: totalDone, total: totalAll })}
              </span>
              {progress.starAwarded && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(16,185,129,0.1)", color: "var(--success)" }}>
                  {tt("quests.star_earned")}
                </span>
              )}
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--accent), var(--star))" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quests */}
      <div className="px-5 space-y-3 mb-5">
        {slots.map((q, i) =>
          q ? (
            <QuestCard
              key={q.id} id={q.id} type={q.type}
              title={tt(q.titleKey)} description={tt(q.descriptionKey)}
              emoji={q.emoji} goldReward={q.goldReward}
              completed={q.completed} rerolled={q.rerolled}
              onComplete={handleComplete} onReroll={handleReroll} t={tt}
            />
          ) : (
            <EmptySlot key={`e-${i}`} message={tt("quests.empty_slot")} />
          )
        )}
      </div>

      {/* Leaderboard */}
      <div className="px-5">
        <button
          onClick={() => router.push("/leaderboard")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-semibold transition-all hover:bg-gray-50"
          style={{ background: "white", borderColor: "var(--border)", color: "var(--text)" }}
        >
          <Trophy className="w-4 h-4" style={{ color: "var(--star)" }} />
          {tt("dashboard.leaderboard")}
        </button>
      </div>

      <CompletionPopup
        visible={showPopup} goldEarned={popupGold} stars={popupStars}
        locale={locale} t={tt} onClose={() => setShowPopup(false)}
      />
    </div>
  );
}
