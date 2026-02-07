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
      // Network error, stay on page
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
          <p style={{ color: "var(--color-text-muted)" }}>{tt("app.loading")}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Build 4 slots: fill with quests or show empty
  const slotContents: (QuestData | null)[] = Array.from({ length: MAX_SLOTS }, (_, i) => {
    return quests.find((q) => q.slot === i) || null;
  });

  const weeklyDone = progress ? progress.weeklyCompleted : 0;
  const weeklyTotal = progress ? progress.weeklyTotal : 0;
  const dailyDone = progress ? progress.dailyCompleted : 0;
  const dailyTotal = progress ? progress.dailyTotal : 0;

  return (
    <div className="p-4 pb-8 space-y-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--color-primary)" }}>
            Bravoo
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium px-3 py-1 rounded-lg"
          style={{ color: "var(--color-text-muted)" }}
        >
          {tt("app.logout")}
        </button>
      </div>

      {/* User Info + Gold */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">{user.username}</p>
            <RankBadge
              rank={tt(`rank.${user.rank}`)}
              emoji={user.rankEmoji}
              color={user.rankColor}
            />
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-1">
              <span className="text-lg">🪙</span>
              <span className="text-xl font-black" style={{ color: "var(--color-star)" }}>
                {user.gold}
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {tt("dashboard.days_left")}: {user.remainingDays}
            </p>
          </div>
        </div>
      </div>

      {/* Stars Progress */}
      <StarDisplay
        stars={user.stars}
        maxStars={MAX_STARS}
        starsLabel={`${user.stars} / ${MAX_STARS} ⭐`}
        goalText={tt("dashboard.stars_goal")}
        reachedText={tt("dashboard.stars_reached")}
        remainingText={tt("dashboard.stars_remaining", { count: MAX_STARS - user.stars })}
      />

      {/* Weekly Progress Bar */}
      {progress && (
        <div className="card" style={{ padding: "1rem 1.5rem" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold" style={{ color: "var(--color-text-muted)" }}>
              {tt("quests.weekly_progress", {
                completed: weeklyDone + dailyDone,
                total: weeklyTotal + dailyTotal,
              })}
            </span>
            {progress.starAwarded && (
              <span className="text-xs font-bold" style={{ color: "var(--color-success)" }}>
                {tt("quests.star_earned")}
              </span>
            )}
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${weeklyTotal + dailyTotal > 0
                  ? ((weeklyDone + dailyDone) / (weeklyTotal + dailyTotal)) * 100
                  : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Quest Slots */}
      <div className="space-y-3">
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
      <button
        onClick={() => router.push("/leaderboard")}
        className="btn-secondary flex items-center justify-center gap-2"
      >
        <span>🏆</span>
        {tt("dashboard.leaderboard")}
      </button>

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
