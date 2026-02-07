export type Rank = "Bronze" | "Silver" | "Gold" | "Platinum" | "Legend";

export interface RankInfo {
  name: Rank;
  minStars: number;
  maxStars: number;
  color: string;
  emoji: string;
}

export const RANKS: RankInfo[] = [
  { name: "Bronze", minStars: 0, maxStars: 0, color: "#CD7F32", emoji: "🥉" },
  { name: "Silver", minStars: 1, maxStars: 1, color: "#C0C0C0", emoji: "🥈" },
  { name: "Gold", minStars: 2, maxStars: 2, color: "#FFD700", emoji: "🥇" },
  { name: "Platinum", minStars: 3, maxStars: 3, color: "#E5E4E2", emoji: "💎" },
  { name: "Legend", minStars: 4, maxStars: 999, color: "#FF6B35", emoji: "🏆" },
];

export const MAX_STARS = 4;

export function getRank(stars: number): RankInfo {
  const clamped = Math.max(0, stars);
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (clamped >= RANKS[i].minStars) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}

export function getDaysInMonth(date: Date = new Date()): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getRemainingDays(date: Date = new Date()): number {
  const totalDays = getDaysInMonth(date);
  return totalDays - date.getDate();
}
