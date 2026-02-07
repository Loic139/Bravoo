"use client";

interface StarDisplayProps {
  stars: number;
  maxStars?: number;
  goalText: string;
  reachedText: string;
  remainingText: string;
  starsLabel: string;
}

export default function StarDisplay({
  stars,
  maxStars = 4,
  goalText,
  reachedText,
  remainingText,
  starsLabel,
}: StarDisplayProps) {
  const starIcons = Array.from({ length: maxStars }, (_, i) => i < stars);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
          {starsLabel}
        </span>
        <span className="text-[10px] font-medium" style={{ color: "var(--color-text-muted)" }}>
          {goalText}
        </span>
      </div>

      {/* Star icons row */}
      <div className="flex items-center justify-center gap-4 mb-3">
        {starIcons.map((filled, i) => (
          <div
            key={i}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${filled ? "animate-star-bounce" : ""}`}
            style={{
              background: filled ? "#FEF3C7" : "var(--color-bg)",
              opacity: filled ? 1 : 0.5,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      <p className="text-[11px] text-center font-medium" style={{ color: "var(--color-text-muted)" }}>
        {stars >= maxStars ? reachedText : remainingText}
      </p>
    </div>
  );
}
