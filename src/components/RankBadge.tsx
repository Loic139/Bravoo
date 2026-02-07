"use client";

interface RankBadgeProps {
  rank: string;
  emoji: string;
  color: string;
}

export default function RankBadge({ rank, emoji, color }: RankBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold"
      style={{ color }}
    >
      <span>{emoji}</span>
      {rank}
    </span>
  );
}
