import { getDb } from "./firebase";
import { getRank, MAX_STARS } from "./ranks";
import { DAILY_QUESTS, WEEKLY_QUESTS, getRandomQuests, getWeekYear } from "./quests";

export interface ActiveQuest {
  id: string;
  slot: number;
  type: "daily" | "weekly";
  templateId: string;
  titleKey: string;
  descriptionKey: string;
  emoji: string;
  goldReward: number;
  completed: boolean;
  rerolled: boolean;
  weekYear: string;
  day: string;
  createdAt: string;
}

const MAX_SLOTS = 4;

export async function getUserQuests(userId: string): Promise<ActiveQuest[]> {
  const db = getDb();
  const snapshot = await db
    .collection("quests")
    .where("userId", "==", userId)
    .where("completed", "==", false)
    .orderBy("slot")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ActiveQuest));
}

export async function generateQuests(userId: string): Promise<ActiveQuest[]> {
  const db = getDb();
  const today = new Date().toISOString().split("T")[0];
  const weekYear = getWeekYear();

  // Get current active (non-completed) quests
  let quests = await getUserQuests(userId);
  const usedSlots = quests.map((q) => q.slot);
  const freeSlots = Array.from({ length: MAX_SLOTS }, (_, i) => i).filter(
    (s) => !usedSlots.includes(s)
  );

  // Check if weekly quests already assigned this week
  const existingWeekly = quests.filter(
    (q) => q.type === "weekly" && q.weekYear === weekYear
  );

  // Also check completed weekly quests for this week
  const completedWeeklySnap = await db
    .collection("quests")
    .where("userId", "==", userId)
    .where("type", "==", "weekly")
    .where("weekYear", "==", weekYear)
    .where("completed", "==", true)
    .get();
  const totalWeeklyThisWeek = existingWeekly.length + completedWeeklySnap.size;

  // Assign weekly quests if new week and not yet assigned
  if (totalWeeklyThisWeek === 0 && freeSlots.length > 0) {
    const existingIds = quests.map((q) => q.templateId);
    const weeklyQuests = getRandomQuests(WEEKLY_QUESTS, Math.min(3, freeSlots.length), existingIds);

    for (let i = 0; i < weeklyQuests.length; i++) {
      const slot = freeSlots.shift()!;
      const template = weeklyQuests[i];
      const questData = {
        userId,
        slot,
        type: "weekly" as const,
        templateId: template.id,
        titleKey: template.titleKey,
        descriptionKey: template.descriptionKey,
        emoji: template.emoji,
        goldReward: template.goldReward,
        completed: false,
        rerolled: false,
        weekYear,
        day: today,
        createdAt: new Date().toISOString(),
      };
      await db.collection("quests").add(questData);
    }
  }

  // Check if daily quest already assigned today
  const existingDailyToday = quests.find(
    (q) => q.type === "daily" && q.day === today
  );
  const completedDailyTodaySnap = await db
    .collection("quests")
    .where("userId", "==", userId)
    .where("type", "==", "daily")
    .where("day", "==", today)
    .where("completed", "==", true)
    .get();

  // Refresh free slots after potential weekly assignments
  quests = await getUserQuests(userId);
  const updatedUsedSlots = quests.map((q) => q.slot);
  const updatedFreeSlots = Array.from({ length: MAX_SLOTS }, (_, i) => i).filter(
    (s) => !updatedUsedSlots.includes(s)
  );

  if (!existingDailyToday && completedDailyTodaySnap.empty && updatedFreeSlots.length > 0) {
    const existingIds = quests.map((q) => q.templateId);
    const dailyQuests = getRandomQuests(DAILY_QUESTS, 1, existingIds);

    if (dailyQuests.length > 0) {
      const slot = updatedFreeSlots[0];
      const template = dailyQuests[0];
      const questData = {
        userId,
        slot,
        type: "daily" as const,
        templateId: template.id,
        titleKey: template.titleKey,
        descriptionKey: template.descriptionKey,
        emoji: template.emoji,
        goldReward: template.goldReward,
        completed: false,
        rerolled: false,
        weekYear,
        day: today,
        createdAt: new Date().toISOString(),
      };
      await db.collection("quests").add(questData);
    }
  }

  return getUserQuests(userId);
}

export async function completeQuest(
  userId: string,
  questId: string
): Promise<{ gold: number; stars: number; rank: string; goldEarned: number } | null> {
  const db = getDb();
  const questRef = db.collection("quests").doc(questId);
  const questSnap = await questRef.get();

  if (!questSnap.exists) return null;

  const quest = questSnap.data()!;
  if (quest.userId !== userId || quest.completed) return null;

  await questRef.update({ completed: true });

  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();
  const userData = userSnap.data()!;
  const newGold = (userData.gold || 0) + quest.goldReward;

  await userRef.update({
    gold: newGold,
    lastActiveDate: new Date().toISOString().split("T")[0],
  });

  const weekYear = quest.weekYear;
  await checkWeeklyStar(userId, weekYear);

  const updatedUser = (await userRef.get()).data()!;

  return {
    gold: updatedUser.gold,
    stars: updatedUser.stars,
    rank: getRank(updatedUser.stars).name,
    goldEarned: quest.goldReward,
  };
}

async function checkWeeklyStar(userId: string, weekYear: string) {
  const db = getDb();

  const trackingRef = db.collection("weeklyTracking").doc(`${userId}_${weekYear}`);
  const trackingSnap = await trackingRef.get();
  if (trackingSnap.exists && trackingSnap.data()?.starAwarded) return;

  const allQuestsSnap = await db
    .collection("quests")
    .where("userId", "==", userId)
    .where("weekYear", "==", weekYear)
    .get();

  const allQuests = allQuestsSnap.docs.map((d) => d.data());
  const weekly = allQuests.filter((q) => q.type === "weekly");
  const daily = allQuests.filter((q) => q.type === "daily");

  const allWeeklyDone = weekly.length >= 3 && weekly.every((q) => q.completed);
  const allDailyDone = daily.length > 0 && daily.every((q) => q.completed);

  if (allWeeklyDone && allDailyDone) {
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();
    const userData = userSnap.data()!;
    const newStars = Math.min((userData.stars || 0) + 1, MAX_STARS);
    const newRank = getRank(newStars);

    await userRef.update({ stars: newStars, rank: newRank.name });
    await trackingRef.set({ userId, weekYear, starAwarded: true });
  }
}

export async function rerollQuest(
  userId: string,
  questId: string
): Promise<ActiveQuest | null> {
  const db = getDb();
  const questRef = db.collection("quests").doc(questId);
  const questSnap = await questRef.get();

  if (!questSnap.exists) return null;

  const quest = questSnap.data()!;
  if (quest.userId !== userId || quest.completed || quest.rerolled) return null;

  const templates = quest.type === "daily" ? DAILY_QUESTS : WEEKLY_QUESTS;
  const currentQuests = await getUserQuests(userId);
  const excludeIds = currentQuests.map((q) => q.templateId);
  const newQuests = getRandomQuests(templates, 1, excludeIds);

  if (newQuests.length === 0) return null;

  const template = newQuests[0];
  await questRef.update({
    templateId: template.id,
    titleKey: template.titleKey,
    descriptionKey: template.descriptionKey,
    emoji: template.emoji,
    goldReward: template.goldReward,
    rerolled: true,
  });

  const updated = (await questRef.get()).data()!;
  return { id: questId, ...updated } as ActiveQuest;
}

export async function getWeeklyProgress(userId: string): Promise<{
  weeklyCompleted: number;
  weeklyTotal: number;
  dailyCompleted: number;
  dailyTotal: number;
  starAwarded: boolean;
}> {
  const db = getDb();
  const weekYear = getWeekYear();

  const allQuestsSnap = await db
    .collection("quests")
    .where("userId", "==", userId)
    .where("weekYear", "==", weekYear)
    .get();

  const allQuests = allQuestsSnap.docs.map((d) => d.data());
  const weekly = allQuests.filter((q) => q.type === "weekly");
  const daily = allQuests.filter((q) => q.type === "daily");

  const trackingSnap = await db
    .collection("weeklyTracking")
    .doc(`${userId}_${weekYear}`)
    .get();

  return {
    weeklyCompleted: weekly.filter((q) => q.completed).length,
    weeklyTotal: weekly.length,
    dailyCompleted: daily.filter((q) => q.completed).length,
    dailyTotal: daily.length,
    starAwarded: trackingSnap.exists && !!trackingSnap.data()?.starAwarded,
  };
}

export async function getLeaderboard(): Promise<
  { username: string; stars: number; gold: number; rank: string }[]
> {
  const db = getDb();
  const snapshot = await db
    .collection("users")
    .orderBy("stars", "desc")
    .limit(50)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      username: data.username,
      stars: data.stars,
      gold: data.gold || 0,
      rank: data.rank,
    };
  });
}

export async function processMonthlyReset(): Promise<number> {
  const today = new Date();
  if (today.getDate() !== 1) return 0;

  const db = getDb();
  const usersSnap = await db.collection("users").get();

  const batch = db.batch();
  let count = 0;

  for (const doc of usersSnap.docs) {
    batch.update(doc.ref, { stars: 0, rank: "Bronze" });
    count++;
  }

  if (count > 0) await batch.commit();
  return count;
}
