"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, RefreshCw, Loader2, Coins } from "lucide-react";

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
  id, type, title, description, emoji, goldReward,
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
  const typeColor = isWeekly ? "var(--weekly)" : "var(--daily)";
  const typeBg = isWeekly ? "rgba(124,58,237,0.08)" : "rgba(37,99,235,0.08)";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-4 border transition-shadow duration-200"
      style={{
        background: completed ? "#FAFAFA" : "white",
        borderColor: completed ? "var(--success)" : "var(--border)",
        borderLeftWidth: 3,
        borderLeftColor: completed ? "var(--success)" : typeColor,
        opacity: completed ? 0.65 : 1,
        boxShadow: completed ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{ background: typeBg, color: typeColor }}
        >
          {isWeekly ? t("quests.weekly") : t("quests.daily")}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--gold)" }}>
          <Coins className="w-3.5 h-3.5" />
          {t("quests.gold_reward", { amount: goldReward })}
        </span>
      </div>

      {/* Content */}
      <div className="flex items-center gap-3.5 mb-3.5">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: "var(--bg)" }}
        >
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-bold leading-snug">{title}</h3>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {description}
          </p>
        </div>
      </div>

      {/* Action */}
      {completed ? (
        <div
          className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold"
          style={{ background: "rgba(16,185,129,0.08)", color: "var(--success)" }}
        >
          <Check className="w-3.5 h-3.5" />
          {t("quests.completed")}
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handleComplete}
            disabled={completing}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-md active:scale-[0.97] disabled:opacity-50"
            style={{ background: "var(--accent)" }}
          >
            {completing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {completing ? t("quests.validating") : t("quests.complete")}
          </button>
          {!rerolled && (
            <motion.button
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              onClick={handleReroll}
              disabled={rerolling}
              className="flex items-center justify-center w-10 rounded-xl border transition-colors hover:bg-gray-50 disabled:opacity-30"
              style={{ borderColor: "var(--border)" }}
              title={t("quests.reroll")}
            >
              {rerolling ? (
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--text-muted)" }} />
              ) : (
                <RefreshCw className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              )}
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}
