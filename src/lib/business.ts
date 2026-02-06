import { getDb } from "./db";
import { getRank } from "./ranks";

export function completeMission(
  userId: number,
  missionType: "morning" | "evening"
): { stars: number; rank: string; alreadyCompleted: boolean } {
  const db = getDb();
  const today = new Date().toISOString().split("T")[0];

  // Ensure daily activity row exists
  db.prepare(
    `INSERT OR IGNORE INTO daily_activity (user_id, date, morning_completed, evening_completed) VALUES (?, ?, 0, 0)`
  ).run(userId, today);

  const column =
    missionType === "morning" ? "morning_completed" : "evening_completed";

  // Check if already completed
  const activity = db
    .prepare(`SELECT ${column} as completed FROM daily_activity WHERE user_id = ? AND date = ?`)
    .get(userId, today) as { completed: number } | undefined;

  if (activity && activity.completed) {
    const user = db
      .prepare("SELECT stars, rank FROM users WHERE id = ?")
      .get(userId) as { stars: number; rank: string };
    return { stars: user.stars, rank: user.rank, alreadyCompleted: true };
  }

  // Mark mission as completed
  db.prepare(
    `UPDATE daily_activity SET ${column} = 1 WHERE user_id = ? AND date = ?`
  ).run(userId, today);

  // Add star
  db.prepare("UPDATE users SET stars = MIN(stars + 1, 30), last_active_date = ? WHERE id = ?").run(
    today,
    userId
  );

  // Get updated user data
  const user = db
    .prepare("SELECT stars, rank FROM users WHERE id = ?")
    .get(userId) as { stars: number; rank: string };

  // Update rank
  const newRank = getRank(user.stars);
  if (newRank.name !== user.rank) {
    db.prepare("UPDATE users SET rank = ? WHERE id = ?").run(
      newRank.name,
      userId
    );
  }

  // Check for legend achievement
  if (user.stars >= 30) {
    const month = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    db.prepare(
      "INSERT OR IGNORE INTO legend_history (user_id, month) VALUES (?, ?)"
    ).run(userId, month);
  }

  return {
    stars: user.stars,
    rank: newRank.name,
    alreadyCompleted: false,
  };
}

export function processDailyCheck() {
  const db = getDb();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // Find users who were active before but had no activity yesterday
  const usersToDeduct = db
    .prepare(
      `SELECT u.id FROM users u
       WHERE u.last_active_date IS NOT NULL
       AND u.stars > 0
       AND NOT EXISTS (
         SELECT 1 FROM daily_activity da
         WHERE da.user_id = u.id
         AND da.date = ?
         AND (da.morning_completed = 1 OR da.evening_completed = 1)
       )`
    )
    .all(yesterdayStr) as { id: number }[];

  for (const user of usersToDeduct) {
    db.prepare(
      "UPDATE users SET stars = MAX(stars - 1, 0) WHERE id = ?"
    ).run(user.id);

    // Update rank after deduction
    const updated = db
      .prepare("SELECT stars FROM users WHERE id = ?")
      .get(user.id) as { stars: number };
    const newRank = getRank(updated.stars);
    db.prepare("UPDATE users SET rank = ? WHERE id = ?").run(
      newRank.name,
      user.id
    );
  }

  return usersToDeduct.length;
}

export function processMonthlyReset() {
  const db = getDb();
  const today = new Date();

  // Only reset on the 1st of the month
  if (today.getDate() !== 1) return 0;

  const result = db
    .prepare("UPDATE users SET stars = 0, rank = 'Bronze'")
    .run();

  return result.changes;
}
