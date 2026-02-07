"use client";

import { motion } from "framer-motion";

interface StarDisplayProps {
  stars: number;
  maxStars?: number;
  goalText: string;
  reachedText: string;
  remainingText: string;
  starsLabel: string;
}

export default function StarDisplay({
  stars, maxStars = 4, goalText, reachedText, remainingText, starsLabel,
}: StarDisplayProps) {
  return (
    <div
      className="rounded-2xl p-4 border"
      style={{ background: "white", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
          {starsLabel}
        </span>
        <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
          {goalText}
        </span>
      </div>

      <div className="flex items-center justify-center gap-3 mb-3">
        {Array.from({ length: maxStars }, (_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 15 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
            style={{
              background: i < stars ? "#FEF3C7" : "var(--bg)",
              opacity: i < stars ? 1 : 0.4,
            }}
          >
            ⭐
          </motion.div>
        ))}
      </div>

      <p className="text-[11px] text-center font-medium" style={{ color: "var(--text-muted)" }}>
        {stars >= maxStars ? reachedText : remainingText}
      </p>
    </div>
  );
}
