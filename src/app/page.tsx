"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { detectLocale, t as translate, Locale } from "@/lib/i18n";
import QuestCard from "@/components/QuestCard";
import EmptySlot from "@/components/EmptySlot";
import StarDisplay from "@/components/StarDisplay";
import RankBadge from "@/components/RankBadge";
import CompletionPopup from "@/components/CompletionPopup";
import { MAX_STARS } from "@/lib/ranks";

interface UserData {
  username: string;
  stars: number;
  gold: number;
  rank: string;
  rankEmoji: string;
  rankColor: string;
  remainingDays: number;
  starsToLegend: number;
}

interface QuestData {
  id: string;
  slot: number;
  type: "daily" | "weekly";
  templateId: string;
  titleKey: string;
  descriptionKey: string;
  emoji: string;
  goldReward: number;
  completed: boolean;
  rerolled: boolean;
}

interface WeeklyProgress {
  weeklyCompleted: number;
  weeklyTotal: number;
  dailyCompleted: number;
  dailyTotal: number;
  starAwarded: boolean;
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

  const tt = useCallback((key: string, params?: Record<string, string | number>) => {
    return translate(key, locale, params);
  }, [locale]);

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
        return;
      }
      const token = await firebaseUser.getIdToken();
      setIdToken(token);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchData = useCallback(async () => {
    if (!idToken) return;

    try {
      const [userRes, questsRes] = await Promise.all([
        fetch("/api/user", {
          headers: { Authorization: `Bearer ${idToken}` },
        }),
        fetch("/api/quests", {
          headers: { Authorization: `Bearer ${idToken}` },
        }),
      ]);

      if (!userRes.ok || !questsRes.ok) {
        router.push("/login");
        return;
      }

      const userData = await userRes.json();
      const questsData = await questsRes.json();

      setUser(userData);
      setQuests(questsData.quests || []);
      setProgress(questsData.progress || null);
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  }, [idToken, router]);

  useEffect(() => {
    if (idToken) fetchData();
  }, [idToken, fetchData]);

  async function handleCompleteQuest(questId: string) {
    if (!idToken) return;

    const res = await fetch("/api/quests/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ questId }),
    });

    if (res.ok) {
      const result = await res.json();
      setPopupGold(result.goldEarned);
      setPopupStars(result.stars);
      setShowPopup(true);
      await fetchData();
    }
  }

  async function handleRerollQuest(questId: string) {
    if (!idToken) return;

    const res = await fetch("/api/quests/reroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ questId }),
    });

    if (res.ok) {
      await fetchData();
    }
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
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse-gentle">⭐</div>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{tt("app.loading")}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const slotContents: (QuestData | null)[] = Array.from({ length: MAX_SLOTS }, (_, i) => {
    return quests.find((q) => q.slot === i) || null;
  });

  const totalDone = (progress?.weeklyCompleted || 0) + (progress?.dailyCompleted || 0);
  const totalQuests = (progress?.weeklyTotal || 0) + (progress?.dailyTotal || 0);

  return (
    <div className="pb-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "var(--color-accent)" }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{user.username}</p>
            <RankBadge
              rank={tt(`rank.${user.rank}`)}
              emoji={user.rankEmoji}
              color={user.rankColor}
            />
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: "var(--color-text-muted)", background: "var(--color-bg)" }}
        >
          {tt("app.logout")}
        </button>
      </div>

      {/* Stat pills row */}
      <div className="flex gap-3 px-5 mb-4">
        <div className="stat-pill flex-1">
          <span className="text-lg mb-0.5">⭐</span>
          <span className="text-xl font-extrabold" style={{ color: "var(--color-text)" }}>{user.stars}</span>
          <span className="text-[10px] font-medium" style={{ color: "var(--color-text-muted)" }}>
            {tt("dashboard.stars_progress")}
          </span>
        </div>
        <div className="stat-pill flex-1">
          <span className="text-lg mb-0.5">🪙</span>
          <span className="text-xl font-extrabold" style={{ color: "var(--color-text)" }}>{user.gold}</span>
          <span className="text-[10px] font-medium" style={{ color: "var(--color-text-muted)" }}>
            {tt("dashboard.gold")}
          </span>
        </div>
        <div className="stat-pill flex-1">
          <span className="text-lg mb-0.5">📅</span>
          <span className="text-xl font-extrabold" style={{ color: "var(--color-text)" }}>{user.remainingDays}</span>
          <span className="text-[10px] font-medium" style={{ color: "var(--color-text-muted)" }}>
            {tt("dashboard.days_left")}
          </span>
        </div>
      </div>

      {/* Stars Progress */}
      <div className="px-5 mb-4">
        <StarDisplay
          stars={user.stars}
          maxStars={MAX_STARS}
          starsLabel={`${user.stars} / ${MAX_STARS} ⭐`}
          goalText={tt("dashboard.stars_goal")}
          reachedText={tt("dashboard.stars_reached")}
          remainingText={tt("dashboard.stars_remaining", { count: MAX_STARS - user.stars })}
        />
      </div>

      {/* Weekly Progress Bar */}
      {progress && (
        <div className="px-5 mb-5">
          <div className="card" style={{ padding: "0.875rem 1.25rem" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                {tt("quests.weekly_progress", { completed: totalDone, total: totalQuests })}
              </span>
              {progress.starAwarded && (
                <span className="text-xs font-semibold" style={{ color: "var(--color-success)" }}>
                  {tt("quests.star_earned")}
                </span>
              )}
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${totalQuests > 0 ? (totalDone / totalQuests) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quest Slots */}
      <div className="px-5 space-y-3 mb-5">
        {slotContents.map((quest, slotIndex) =>
          quest ? (
            <QuestCard
              key={quest.id}
              id={quest.id}
              type={quest.type}
              title={tt(quest.titleKey)}
              description={tt(quest.descriptionKey)}
              emoji={quest.emoji}
              goldReward={quest.goldReward}
              completed={quest.completed}
              rerolled={quest.rerolled}
              onComplete={handleCompleteQuest}
              onReroll={handleRerollQuest}
              t={tt}
            />
          ) : (
            <EmptySlot
              key={`empty-${slotIndex}`}
              message={tt("quests.empty_slot")}
            />
          )
        )}
      </div>

      {/* Leaderboard Link */}
      <div className="px-5">
        <button
          onClick={() => router.push("/leaderboard")}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <span>🏆</span>
          {tt("dashboard.leaderboard")}
        </button>
      </div>

      {/* Completion Popup */}
      <CompletionPopup
        visible={showPopup}
        goldEarned={popupGold}
        stars={popupStars}
        locale={locale}
        t={tt}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
}
