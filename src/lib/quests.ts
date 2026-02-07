export interface QuestTemplate {
  id: string;
  titleKey: string;
  descriptionKey: string;
  emoji: string;
  goldReward: number;
  type: "daily" | "weekly";
}

export const DAILY_QUESTS: QuestTemplate[] = [
  { id: "d_squats10", titleKey: "quest.daily.squats10", descriptionKey: "quest.daily.squats10.desc", emoji: "🦵", goldReward: 100, type: "daily" },
  { id: "d_pushups5", titleKey: "quest.daily.pushups5", descriptionKey: "quest.daily.pushups5.desc", emoji: "💪", goldReward: 100, type: "daily" },
  { id: "d_jumpingjacks10", titleKey: "quest.daily.jumpingjacks10", descriptionKey: "quest.daily.jumpingjacks10.desc", emoji: "⭐", goldReward: 120, type: "daily" },
  { id: "d_plank30", titleKey: "quest.daily.plank30", descriptionKey: "quest.daily.plank30.desc", emoji: "🧘", goldReward: 150, type: "daily" },
  { id: "d_highknees15", titleKey: "quest.daily.highknees15", descriptionKey: "quest.daily.highknees15.desc", emoji: "🏃", goldReward: 100, type: "daily" },
  { id: "d_lunges10", titleKey: "quest.daily.lunges10", descriptionKey: "quest.daily.lunges10.desc", emoji: "🦿", goldReward: 120, type: "daily" },
  { id: "d_armcircles20", titleKey: "quest.daily.armcircles20", descriptionKey: "quest.daily.armcircles20.desc", emoji: "🔄", goldReward: 80, type: "daily" },
  { id: "d_crunches10", titleKey: "quest.daily.crunches10", descriptionKey: "quest.daily.crunches10.desc", emoji: "🔥", goldReward: 100, type: "daily" },
  { id: "d_wallsit30", titleKey: "quest.daily.wallsit30", descriptionKey: "quest.daily.wallsit30.desc", emoji: "🧱", goldReward: 150, type: "daily" },
  { id: "d_stretch1", titleKey: "quest.daily.stretch1", descriptionKey: "quest.daily.stretch1.desc", emoji: "🌅", goldReward: 80, type: "daily" },
];

export const WEEKLY_QUESTS: QuestTemplate[] = [
  { id: "w_run2k", titleKey: "quest.weekly.run2k", descriptionKey: "quest.weekly.run2k.desc", emoji: "🏃", goldReward: 500, type: "weekly" },
  { id: "w_squats50", titleKey: "quest.weekly.squats50", descriptionKey: "quest.weekly.squats50.desc", emoji: "🦵", goldReward: 400, type: "weekly" },
  { id: "w_pushups30", titleKey: "quest.weekly.pushups30", descriptionKey: "quest.weekly.pushups30.desc", emoji: "💪", goldReward: 400, type: "weekly" },
  { id: "w_plank5min", titleKey: "quest.weekly.plank5min", descriptionKey: "quest.weekly.plank5min.desc", emoji: "🧘", goldReward: 500, type: "weekly" },
  { id: "w_jumpingjacks100", titleKey: "quest.weekly.jumpingjacks100", descriptionKey: "quest.weekly.jumpingjacks100.desc", emoji: "⭐", goldReward: 350, type: "weekly" },
  { id: "w_lunges45", titleKey: "quest.weekly.lunges45", descriptionKey: "quest.weekly.lunges45.desc", emoji: "🦿", goldReward: 400, type: "weekly" },
  { id: "w_coreblast", titleKey: "quest.weekly.coreblast", descriptionKey: "quest.weekly.coreblast.desc", emoji: "🔥", goldReward: 450, type: "weekly" },
  { id: "w_burpees20", titleKey: "quest.weekly.burpees20", descriptionKey: "quest.weekly.burpees20.desc", emoji: "💥", goldReward: 500, type: "weekly" },
  { id: "w_dance10", titleKey: "quest.weekly.dance10", descriptionKey: "quest.weekly.dance10.desc", emoji: "💃", goldReward: 300, type: "weekly" },
  { id: "w_walk5000", titleKey: "quest.weekly.walk5000", descriptionKey: "quest.weekly.walk5000.desc", emoji: "🚶", goldReward: 350, type: "weekly" },
];

export function getISOWeek(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getWeekYear(date: Date = new Date()): string {
  const week = getISOWeek(date);
  const year = date.getFullYear();
  return `${year}-W${String(week).padStart(2, "0")}`;
}

export function getRandomQuests(templates: QuestTemplate[], count: number, exclude: string[] = []): QuestTemplate[] {
  const available = templates.filter((q) => !exclude.includes(q.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
