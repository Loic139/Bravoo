import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, getUserByUid } from "@/lib/auth";
import { getRank, getRemainingDays, MAX_STARS } from "@/lib/ranks";

export async function GET(req: NextRequest) {
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyIdToken(idToken);
    const user = await getUserByUid(decoded.uid);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const rankInfo = getRank(user.stars);
    const remainingDays = getRemainingDays();

    return NextResponse.json({
      id: user.id,
      username: user.username,
      stars: user.stars,
      gold: user.gold || 0,
      rank: rankInfo.name,
      rankEmoji: rankInfo.emoji,
      rankColor: rankInfo.color,
      remainingDays,
      starsToLegend: Math.max(0, MAX_STARS - user.stars),
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
