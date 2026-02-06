export type Rank = "Bronze" | "Silver" | "Gold" | "Platinum" | "Legend";

export interface RankInfo {
  name: Rank;
  minStars: number;
  maxStars: number;
  color: string;
  bgColor: string;
  emoji: string;
}

export const RANKS: RankInfo[] = [
  { name: "Bronze", minStars: 0, maxStars: 5, color: "#CD7F32", bgColor: "bg-amber-700", emoji: "🥉" },
  { name: "Silver", minStars: 6, maxStars: 12, color: "#C0C0C0", bgColor: "bg-gray-400", emoji: "🥈" },
  { name: "Gold", minStars: 13, maxStars: 20, color: "#FFD700", bgColor: "bg-yellow-400", emoji: "🥇" },
  { name: "Platinum", minStars: 21, maxStars: 29, color: "#E5E4E2", bgColor: "bg-slate-300", emoji: "💎" },
  { name: "Legend", minStars: 30, maxStars: 999, color: "#FF6B35", bgColor: "bg-orange-500", emoji: "🏆" },
];

export function getRank(stars: number): RankInfo {
  const clamped = Math.max(0, stars);
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (clamped >= RANKS[i].minStars) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}

export function getNextRank(currentRank: Rank): RankInfo | null {
  const idx = RANKS.findIndex((r) => r.name === currentRank);
  if (idx < RANKS.length - 1) {
    return RANKS[idx + 1];
  }
  return null;
}

export function getDaysInMonth(date: Date = new Date()): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getRemainingDays(date: Date = new Date()): number {
  const totalDays = getDaysInMonth(date);
  return totalDays - date.getDate();
}
