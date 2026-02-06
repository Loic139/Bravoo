import { NextRequest, NextResponse } from "next/server";
import { getUserByToken } from "@/lib/auth";
import { getRank, getRemainingDays } from "@/lib/ranks";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = getUserByToken(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rankInfo = getRank(user.stars);
  const remainingDays = getRemainingDays();

  return NextResponse.json({
    id: user.id,
    username: user.username,
    stars: user.stars,
    rank: rankInfo.name,
    rankEmoji: rankInfo.emoji,
    rankColor: rankInfo.color,
    remainingDays,
    starsToLegend: Math.max(0, 30 - user.stars),
  });
}
