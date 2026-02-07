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

  const typeColor = type === "weekly" ? "#A855F7" : "#3B82F6";
  const typeLabel = type === "weekly" ? t("quests.weekly") : t("quests.daily");

  return (
    <div
      className="quest-card animate-slide-up"
      style={{
        borderLeft: `4px solid ${completed ? "var(--color-success)" : typeColor}`,
        opacity: completed ? 0.7 : 1,
      }}
    >
      {/* Header row: type badge + gold reward */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: `${typeColor}25`,
            color: typeColor,
          }}
        >
          {typeLabel}
        </span>
        <span className="flex items-center gap-1 text-sm font-bold" style={{ color: "var(--color-star)" }}>
          <span>🪙</span>
          {t("quests.gold_reward", { amount: goldReward })}
        </span>
      </div>

      {/* Quest content */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold leading-tight">{title}</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {description}
          </p>
        </div>
      </div>

      {/* Actions */}
      {completed ? (
        <div
          className="text-center py-2.5 rounded-xl font-bold text-sm"
          style={{ background: "rgba(34, 197, 94, 0.15)", color: "var(--color-success)" }}
        >
          {t("quests.completed")}
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handleComplete}
            disabled={completing}
            className="btn-primary flex-1 text-sm !py-2.5"
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
