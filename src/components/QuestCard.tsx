"use client";

import { useState } from "react";

interface QuestCardProps {
  id: string;
  type: "daily" | "weekly";
  title: string;
  description: string;
  emoji: string;
  goldReward: number;
  completed: boolean;
  rerolled: boolean;
  onComplete: (questId: string) => Promise<void>;
  onReroll: (questId: string) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function QuestCard({
  id,
  type,
  title,
  description,
  emoji,
  goldReward,
  completed,
  rerolled,
  onComplete,
  onReroll,
  t,
}: QuestCardProps) {
  const [completing, setCompleting] = useState(false);
  const [rerolling, setRerolling] = useState(false);

  async function handleComplete() {
    setCompleting(true);
    try {
      await onComplete(id);
    } finally {
      setCompleting(false);
    }
  }

  async function handleReroll() {
    setRerolling(true);
    try {
      await onReroll(id);
    } finally {
      setRerolling(false);
    }
  }

  const typeColor = type === "weekly" ? "var(--color-weekly)" : "var(--color-daily)";
  const typeLabel = type === "weekly" ? t("quests.weekly") : t("quests.daily");

  return (
    <div
      className="quest-card animate-slide-up"
      style={{
        borderLeft: `3px solid ${completed ? "var(--color-success)" : typeColor}`,
        opacity: completed ? 0.6 : 1,
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          className="badge"
          style={{
            background: `${type === "weekly" ? "#7C3AED" : "#2563EB"}10`,
            color: typeColor,
          }}
        >
          {typeLabel}
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--color-gold)" }}>
          🪙 {t("quests.gold_reward", { amount: goldReward })}
        </span>
      </div>

      {/* Quest content */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: "var(--color-bg)" }}
        >
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold leading-tight" style={{ color: "var(--color-text)" }}>{title}</h3>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            {description}
          </p>
        </div>
      </div>

      {/* Actions */}
      {completed ? (
        <div
          className="text-center py-2 rounded-xl font-semibold text-xs"
          style={{ background: "#ECFDF5", color: "var(--color-success)" }}
        >
          {t("quests.completed")}
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handleComplete}
            disabled={completing}
            className="btn-accent flex-1 !text-sm !py-2.5 !rounded-xl"
          >
            {completing ? t("quests.validating") : t("quests.complete")}
          </button>
          {!rerolled && (
            <button
              onClick={handleReroll}
              disabled={rerolling}
              className="quest-reroll-btn"
              title={t("quests.reroll")}
            >
              🔄
            </button>
          )}
        </div>
      )}
    </div>
  );
}
