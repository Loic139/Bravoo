import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();

  const leaderboard = db
    .prepare(
      `SELECT username, stars, rank FROM users
       ORDER BY stars DESC, username ASC
       LIMIT 50`
    )
    .all() as { username: string; stars: number; rank: string }[];

  return NextResponse.json({ leaderboard });
}
