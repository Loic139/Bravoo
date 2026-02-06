"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import MissionCard from "@/components/MissionCard";
import StarDisplay from "@/components/StarDisplay";
import RankBadge from "@/components/RankBadge";
import CompletionPopup from "@/components/CompletionPopup";

interface UserData {
  username: string;
  stars: number;
  rank: string;
  rankEmoji: string;
  rankColor: string;
  remainingDays: number;
  starsToLegend: number;
}

interface MissionData {
  id: string;
  title: string;
  description: string;
  emoji: string;
  available: boolean;
  completed: boolean;
}

interface MissionsResponse {
  morning: MissionData;
  evening: MissionData;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [missions, setMissions] = useState<MissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupStars, setPopupStars] = useState(0);

  const getToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("bravoo_token")
      : null;

  const fetchData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const [userRes, missionsRes] = await Promise.all([
        fetch("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/missions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!userRes.ok || !missionsRes.ok) {
        localStorage.removeItem("bravoo_token");
        localStorage.removeItem("bravoo_username");
        router.push("/login");
        return;
      }

      const userData = await userRes.json();
      const missionsData = await missionsRes.json();

      setUser(userData);
      setMissions(missionsData);
    } catch {
      // Network error, stay on page
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleCompleteMission(type: "morning" | "evening") {
    const token = getToken();
    if (!token) return;

    const res = await fetch("/api/missions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ missionType: type }),
    });

    if (res.ok) {
      const result = await res.json();
      if (!result.alreadyCompleted) {
        setPopupStars(result.stars);
        setShowPopup(true);
      }
      await fetchData();
    }
  }

  function handleLogout() {
    localStorage.removeItem("bravoo_token");
    localStorage.removeItem("bravoo_username");
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse-gentle">⭐</div>
          <p style={{ color: "var(--color-text-muted)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !missions) return null;

  return (
    <div className="p-4 pb-8 space-y-4">
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
          Logout
        </button>
      </div>

      {/* User Info */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">{user.username}</p>
            <RankBadge
              rank={user.rank}
              emoji={user.rankEmoji}
              color={user.rankColor}
            />
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Days left this month
            </p>
            <p className="text-2xl font-black">{user.remainingDays}</p>
          </div>
        </div>
      </div>

      {/* Stars Progress */}
      <StarDisplay stars={user.stars} />

      {/* Missions */}
      <MissionCard
        type="morning"
        title={missions.morning.title}
        description={missions.morning.description}
        emoji={missions.morning.emoji}
        available={missions.morning.available}
        completed={missions.morning.completed}
        onComplete={() => handleCompleteMission("morning")}
      />

      <MissionCard
        type="evening"
        title={missions.evening.title}
        description={missions.evening.description}
        emoji={missions.evening.emoji}
        available={missions.evening.available}
        completed={missions.evening.completed}
        onComplete={() => handleCompleteMission("evening")}
      />

      {/* Leaderboard Link */}
      <button
        onClick={() => router.push("/leaderboard")}
        className="btn-secondary flex items-center justify-center gap-2"
      >
        <span>🏆</span>
        View Leaderboard
      </button>

      {/* Completion Popup */}
      <CompletionPopup
        visible={showPopup}
        stars={popupStars}
        onContinue={() => setShowPopup(false)}
        onStop={() => setShowPopup(false)}
      />
    </div>
  );
}
