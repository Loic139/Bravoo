"use client";

interface RankBadgeProps {
  rank: string;
  emoji: string;
  color: string;
}

export default function RankBadge({ rank, emoji, color }: RankBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm"
      style={{
        background: `${color}20`,
        color: color,
        border: `2px solid ${color}40`,
      }}
    >
      <span className="text-lg">{emoji}</span>
      {rank}
    </div>
  );
}
