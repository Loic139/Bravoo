"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, RefreshCw, Loader2, Coins } from "lucide-react";

interface QuestCardProps {
  id: string;
  type: "daily" | "weekly";
  title: string;
  description: string;
  goldReward: number;
  completed: boolean;
  rerolled: boolean;
  onComplete: (questId: string) => Promise<void>;
  onReroll: (questId: string) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function QuestCard({
  id, type, title, description, goldReward,
  completed, rerolled, onComplete, onReroll, t,
}: QuestCardProps) {
  const [completing, setCompleting] = useState(false);
  const [rerolling, setRerolling] = useState(false);

  async function handleComplete() {
    setCompleting(true);
    try { await onComplete(id); } finally { setCompleting(false); }
  }

  async function handleReroll() {
    setRerolling(true);
    try { await onReroll(id); } finally { setRerolling(false); }
  }

  const isWeekly = type === "weekly";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-xl overflow-hidden"
      style={{
        border: completed ? "1px solid var(--success)" : "1px solid var(--border)",
        opacity: completed ? 0.7 : 1,
      }}
    >
      {/* Color strip top */}
      <div
        className="h-[3px]"
        style={{
          background: completed
            ? "var(--success)"
            : isWeekly
            ? "var(--weekly)"
            : "var(--accent)",
        }}
      />

      <div className="p-3.5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{
              color: isWeekly ? "var(--weekly)" : "var(--daily)",
            }}
          >
            {isWeekly ? t("quests.weekly") : t("quests.daily")}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--gold)" }}>
            <Coins className="w-3 h-3" />
            {t("quests.gold_reward", { amount: goldReward })}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-[14px] font-bold leading-snug">{title}</h3>
        <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {description}
        </p>

        {/* Action */}
        <div className="mt-3">
          {completed ? (
            <div
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-semibold"
              style={{ background: "var(--success-light)", color: "var(--success)" }}
            >
              <Check className="w-3.5 h-3.5" />
              {t("quests.completed")}
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleComplete}
                disabled={completing}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all duration-150 active:scale-[0.97] disabled:opacity-50"
                style={{ background: "var(--accent)" }}
              >
                {completing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                {completing ? t("quests.validating") : t("quests.complete")}
              </button>
              {!rerolled && (
                <button
                  onClick={handleReroll}
                  disabled={rerolling}
                  className="flex items-center justify-center w-10 rounded-lg transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30"
                  style={{ border: "1px solid var(--border)" }}
                  title={t("quests.reroll")}
                >
                  {rerolling ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "var(--text-muted)" }} />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
