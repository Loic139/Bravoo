"use client";

import { Star } from "lucide-react";

interface StarDisplayProps {
  stars: number;
  maxStars?: number;
  goalText: string;
  reachedText: string;
  remainingText: string;
}

export default function StarDisplay({
  stars, maxStars = 4, goalText, reachedText, remainingText,
}: StarDisplayProps) {
  return (
    <div
      className="bg-white rounded-xl p-3.5"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: maxStars }, (_, i) => (
            <Star
              key={i}
              className="w-4 h-4"
              style={{
                color: i < stars ? "var(--star)" : "#E5E7EB",
                fill: i < stars ? "var(--star)" : "none",
              }}
            />
          ))}
        </div>
        <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
          {goalText}
        </span>
      </div>
      <p className="text-[11px] font-medium mt-1.5" style={{ color: "var(--text-muted)" }}>
        {stars >= maxStars ? reachedText : remainingText}
      </p>
    </div>
  );
}
