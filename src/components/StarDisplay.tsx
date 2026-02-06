"use client";

interface StarDisplayProps {
  stars: number;
  maxStars?: number;
}

export default function StarDisplay({ stars, maxStars = 30 }: StarDisplayProps) {
  const percentage = Math.min((stars / maxStars) * 100, 100);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl font-black" style={{ color: "var(--color-star)" }}>
          {stars}
        </span>
        <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
          / {maxStars} stars
        </span>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
        {stars >= maxStars
          ? "You reached LEGEND status!"
          : `${maxStars - stars} more stars to Legend`}
      </p>
    </div>
  );
}
