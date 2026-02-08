"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { detectLocale, t as translate, Locale } from "@/lib/i18n";
import { motion } from "framer-motion";
import { LogOut, Star, Coins, CalendarDays, Loader2, TrendingUp, ChevronRight } from "lucide-react";
import QuestCard from "@/components/QuestCard";
import EmptySlot from "@/components/EmptySlot";
import StarDisplay from "@/components/StarDisplay";
import CompletionPopup from "@/components/CompletionPopup";
import TabBar from "@/components/TabBar";
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
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--accent)" }} />
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
    <div className="pb-24 max-w-lg mx-auto">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "var(--accent)" }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[15px] font-bold leading-tight">{user.username}</p>
              <p className="text-[11px] font-medium" style={{ color: user.rankColor }}>
                {tt(`rank.${user.rank}`)}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 -mr-1 rounded-lg transition-colors hover:bg-gray-50 active:bg-gray-100"
            title={tt("app.logout")}
          >
            <LogOut className="w-[18px] h-[18px]" style={{ color: "var(--text-muted)" }} />
          </button>
        </div>

        {/* Compact stats bar */}
        <div className="flex items-center border-t px-4 py-2.5" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-1.5 flex-1">
            <Star className="w-3.5 h-3.5" style={{ color: "var(--star)" }} />
            <span className="text-sm font-bold">{user.stars}</span>
            <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>/{MAX_STARS}</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5 flex-1 justify-center">
            <Coins className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
            <span className="text-sm font-bold">{user.gold}</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5 flex-1 justify-end">
            <CalendarDays className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
            <span className="text-sm font-bold">{user.remainingDays}</span>
            <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{tt("dashboard.days_short")}</span>
          </div>
        </div>
      </motion.div>

      {/* Monthly stars progress */}
      <div className="px-4 mt-3">
        <StarDisplay
          stars={user.stars}
          maxStars={MAX_STARS}
          goalText={tt("dashboard.stars_goal")}
          reachedText={tt("dashboard.stars_reached")}
          remainingText={tt("dashboard.stars_remaining", { count: MAX_STARS - user.stars })}
        />
      </div>

      {/* Weekly progress */}
      {progress && (
        <div className="px-4 mt-3">
          <div className="bg-white rounded-xl p-3.5" style={{ border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {tt("quests.weekly_progress", { completed: totalDone, total: totalAll })}
                </span>
              </div>
              {progress.starAwarded && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--success-light)", color: "var(--success)" }}
                >
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
                style={{ background: "var(--accent)" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Section title */}
      <div className="flex items-center justify-between px-4 mt-5 mb-2.5">
        <h2 className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
          {tt("quests.today_title")}
        </h2>
        <button
          onClick={() => router.push("/leaderboard")}
          className="flex items-center gap-0.5 text-[12px] font-semibold transition-colors hover:opacity-70"
          style={{ color: "var(--accent)" }}
        >
          {tt("dashboard.leaderboard")}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quests */}
      <div className="px-4 space-y-2.5">
        {slots.map((q, i) =>
          q ? (
            <QuestCard
              key={q.id} id={q.id} type={q.type}
              title={tt(q.titleKey)} description={tt(q.descriptionKey)}
              goldReward={q.goldReward}
              completed={q.completed} rerolled={q.rerolled}
              onComplete={handleComplete} onReroll={handleReroll} t={tt}
            />
          ) : (
            <EmptySlot key={`e-${i}`} message={tt("quests.empty_slot")} />
          )
        )}
      </div>

      <CompletionPopup
        visible={showPopup} goldEarned={popupGold} stars={popupStars}
        locale={locale} t={tt} onClose={() => setShowPopup(false)}
      />

      <TabBar t={tt} />
    </div>
  );
}
