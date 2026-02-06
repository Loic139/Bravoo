import { getDb } from "./firebase";
import { getRank } from "./ranks";

export async function completeMission(
  userId: string,
  missionType: "morning" | "evening"
): Promise<{ stars: number; rank: string; alreadyCompleted: boolean }> {
  const db = getDb();
  const today = new Date().toISOString().split("T")[0];
  const activityRef = db.collection("dailyActivity").doc(`${userId}_${today}`);
  const userRef = db.collection("users").doc(userId);

  const activitySnap = await activityRef.get();
  const field = missionType === "morning" ? "morningCompleted" : "eveningCompleted";

  // Check if already completed
  if (activitySnap.exists && activitySnap.data()?.[field]) {
    const userSnap = await userRef.get();
    const userData = userSnap.data()!;
    return { stars: userData.stars, rank: userData.rank, alreadyCompleted: true };
  }

  // Create or update daily activity
  if (activitySnap.exists) {
    await activityRef.update({ [field]: true });
  } else {
    await activityRef.set({
      userId,
      date: today,
      morningCompleted: missionType === "morning",
      eveningCompleted: missionType === "evening",
    });
  }

  // Get current user and add star
  const userSnap = await userRef.get();
  const userData = userSnap.data()!;
  const newStars = Math.min(userData.stars + 1, 30);
  const newRank = getRank(newStars);

  await userRef.update({
    stars: newStars,
    rank: newRank.name,
    lastActiveDate: today,
  });

  // Check for legend achievement
  if (newStars >= 30) {
    const month = new Date().toISOString().slice(0, 7);
    const legendRef = db.collection("legendHistory").doc(`${userId}_${month}`);
    const legendSnap = await legendRef.get();
    if (!legendSnap.exists) {
      await legendRef.set({
        userId,
        month,
        achievedAt: new Date().toISOString(),
      });
    }
  }

  return { stars: newStars, rank: newRank.name, alreadyCompleted: false };
}

export async function getDailyActivity(
  userId: string,
  date: string
): Promise<{ morningCompleted: boolean; eveningCompleted: boolean } | null> {
  const db = getDb();
  const snap = await db.collection("dailyActivity").doc(`${userId}_${date}`).get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  return {
    morningCompleted: !!data.morningCompleted,
    eveningCompleted: !!data.eveningCompleted,
  };
}

export async function processDailyCheck(): Promise<number> {
  const db = getDb();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // Find all users with stars > 0 who have been active before
  const usersSnap = await db
    .collection("users")
    .where("stars", ">", 0)
    .get();

  let deductions = 0;

  for (const userDoc of usersSnap.docs) {
    const userData = userDoc.data();
    if (!userData.lastActiveDate) continue;

    // Check if they had any activity yesterday
    const activityRef = db.collection("dailyActivity").doc(`${userDoc.id}_${yesterdayStr}`);
    const activitySnap = await activityRef.get();

    const hadActivity =
      activitySnap.exists &&
      (activitySnap.data()?.morningCompleted || activitySnap.data()?.eveningCompleted);

    if (!hadActivity) {
      const newStars = Math.max(userData.stars - 1, 0);
      const newRank = getRank(newStars);
      await userDoc.ref.update({ stars: newStars, rank: newRank.name });
      deductions++;
    }
  }

  return deductions;
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

export async function getLeaderboard(): Promise<
  { username: string; stars: number; rank: string }[]
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
      rank: data.rank,
    };
  });
}
