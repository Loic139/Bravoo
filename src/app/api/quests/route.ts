import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/auth";
import { generateQuests, getWeeklyProgress } from "@/lib/business";

export async function GET(req: NextRequest) {
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyIdToken(idToken);
    const quests = await generateQuests(decoded.uid);
    const progress = await getWeeklyProgress(decoded.uid);

    return NextResponse.json({ quests, progress });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
