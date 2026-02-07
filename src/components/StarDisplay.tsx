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
        <span className="text-sm font-bold" style={{ color: "var(--color-text-muted)" }}>
          {starsLabel}
        </span>
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {goalText}
        </span>
      </div>

      {/* Star icons row */}
      <div className="flex items-center justify-center gap-3 mb-3">
        {starIcons.map((filled, i) => (
          <div
            key={i}
            className={`text-3xl ${filled ? "animate-star-bounce" : ""}`}
            style={{
              opacity: filled ? 1 : 0.2,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
        {stars >= maxStars ? reachedText : remainingText}
      </p>
    </div>
  );
}
