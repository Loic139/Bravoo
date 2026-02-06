"use client";

import { useState } from "react";

interface MissionCardProps {
  type: "morning" | "evening";
  title: string;
  description: string;
  emoji: string;
  available: boolean;
  completed: boolean;
  onComplete: () => Promise<void>;
}

export default function MissionCard({
  type,
  title,
  description,
  emoji,
  available,
  completed,
  onComplete,
}: MissionCardProps) {
  const [loading, setLoading] = useState(false);

  const icon = type === "morning" ? "🌅" : "🌙";
  const label = type === "morning" ? "Morning Mission" : "Evening Mission";
  const timeLabel = type === "morning" ? "00:00 – 12:00" : "12:00 – 24:00";

  async function handleComplete() {
    setLoading(true);
    try {
      await onComplete();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="font-bold text-sm uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
            {label}
          </span>
        </div>
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {timeLabel}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{emoji}</span>
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {description}
          </p>
        </div>
      </div>

      {completed ? (
        <div
          className="text-center py-3 rounded-xl font-bold"
          style={{ background: "rgba(34, 197, 94, 0.15)", color: "var(--color-success)" }}
        >
          Completed! +1 star earned
        </div>
      ) : available ? (
        <button
          onClick={handleComplete}
          disabled={loading}
          className="btn-primary animate-pulse-gentle"
        >
          {loading ? "Validating..." : "Mission completed!"}
        </button>
      ) : (
        <div
          className="text-center py-3 rounded-xl font-medium"
          style={{ background: "rgba(148, 163, 184, 0.1)", color: "var(--color-text-muted)" }}
        >
          {type === "morning" ? "Morning mission ended" : "Available after 12:00"}
        </div>
      )}
    </div>
  );
}
